import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();

    // First, delete existing test users
    await connection.execute(
      'DELETE FROM users WHERE email IN (?, ?)',
      ['test@example.com', 'demo@example.com']
    );

    // Create a new test user
    const salt = await bcrypt.genSalt(10);
    const password = 'test123';
    const hashedPassword = await bcrypt.hash(password, salt);

    await connection.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      ['test', 'test@example.com', hashedPassword]
    );

    connection.release();
    return NextResponse.json({ message: 'Default user created successfully' });
  } catch (error) {
    console.error('Error creating default user:', error);
    return NextResponse.json(
      { error: 'Failed to create default user' },
      { status: 500 }
    );
  }
}
