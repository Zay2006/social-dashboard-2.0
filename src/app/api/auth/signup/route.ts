import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getConnection } from '@/lib/db';

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

    // Create new user
    await connection.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

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
