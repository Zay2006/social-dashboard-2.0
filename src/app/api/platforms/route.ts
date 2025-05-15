import { NextResponse, NextRequest } from 'next/server';
import { getConnection } from '@/lib/db';
import jwt from 'jsonwebtoken';

export interface Platform {
  id: number;
  user_id: number;
  platform_name: string;
  access_token: string;
  followers_count: number;
}

// Helper function to get user ID from token
const getUserIdFromToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
};

// Get user's platforms
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const connection = await getConnection();
    const [platforms] = await connection.execute(
      `SELECT p.*, pf.followers_count 
       FROM platforms p 
       LEFT JOIN platform_followers pf ON p.id = pf.platform_id AND pf.user_id = ?`,
      [userId]
    );
    connection.release();

    return NextResponse.json(platforms);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Add platform for user
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { platform_name, followersCount } = await request.json();

    const connection = await getConnection();
    
    // Check if platform is already added
    const [existing] = await connection.execute(
      'SELECT id FROM platform_followers WHERE user_id = ? AND platform_name = ?',
      [userId, platform_name]
    );

    if ((existing as { id: number }[]).length > 0) {
      connection.release();
      return NextResponse.json(
        { message: 'Platform already added for this user' },
        { status: 400 }
      );
    }

    // Add platform for user
    await connection.execute(
      'INSERT INTO platform_followers (user_id, platform_name, followers_count) VALUES (?, ?, ?)',
      [userId, platform_name, followersCount]
    );
    
    connection.release();

    return NextResponse.json({ message: 'Platform added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding platform:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Remove platform for user
export async function DELETE(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { platformId } = await request.json();

    const connection = await getConnection();
    await connection.execute(
      'DELETE FROM platform_followers WHERE user_id = ? AND platform_id = ?',
      [userId, platformId]
    );
    connection.release();

    return NextResponse.json({ message: 'Platform removed successfully' });
  } catch (error) {
    console.error('Error removing platform:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
