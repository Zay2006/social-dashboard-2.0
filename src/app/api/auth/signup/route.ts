import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getConnection } from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
}

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    const connection = await getConnection();

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if ((existingUsers as User[]).length > 0) {
      connection.release();
      return NextResponse.json(
        { message: 'User with this email or username already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Start a transaction
    await connection.beginTransaction();

    try {
      // Create new user
      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      
      const userId = result.insertId;

      // Get all platform IDs
      const [platforms] = await connection.execute('SELECT id FROM platforms');
      const platformIds = (platforms as { id: number }[]).map(p => p.id);

      if (platformIds.length > 0) {
        // Create initial platform_followers entries with 0 followers
        for (const platformId of platformIds) {
          await connection.execute(
            'INSERT INTO platform_followers (user_id, platform_id, followers_count) VALUES (?, ?, ?)',
            [userId, platformId, 0]
          );
        }

        // Create initial engagement_metrics with 0 counts
        const now = new Date();
        for (const platformId of platformIds) {
          await connection.execute(
            'INSERT INTO engagement_metrics (user_id, platform_id, engagement_count, follower_growth, timestamp) VALUES (?, ?, ?, ?, ?)',
            [userId, platformId, 0, 0, now]
          );
        }

        // Create initial welcome posts
        const welcomeMessages: Record<number, string> = {
          1: "Hello Twitter! Excited to start tracking my social media journey! 📊",
          2: "First post on Instagram! Ready to analyze and grow my social presence 📈",
          3: "Connected and ready to track my LinkedIn growth! 🚀",
          4: "New to TikTok! Time to measure that engagement! ✨",
          5: "YouTube analytics journey begins now! 🎥",
          6: "Pinterest tracking starts today! Let's grow together! 🎯"
        };

        for (const platformId of platformIds) {
          await connection.execute(
            'INSERT INTO posts (user_id, platform_id, content, created_at) VALUES (?, ?, ?, ?)',
            [userId, platformId, welcomeMessages[platformId], now]
          );
        };
      }

      // Update dashboard KPIs
      await connection.execute(
        'UPDATE dashboard_kpis SET total_users = total_users + 1, active_users = active_users + 1'
      );

      // Commit the transaction
      await connection.commit();
    } catch (error) {
      // If anything fails, roll back the transaction
      await connection.rollback();
      throw error;
    }

    connection.release();

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
