import { NextResponse } from 'next/server';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import { getConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface JwtPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string;
}

export async function GET() {
  try {
    const cookiesList = await cookies();
    const token = cookiesList.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jose.jwtVerify(token.value, secret);
    const decoded = payload as unknown as JwtPayload;
    if (!decoded.userId || !decoded.email) {
      throw new Error('Invalid token payload');
    }

    const connection = await getConnection();
    const [users] = await connection.execute<UserRow[]>(
      'SELECT id, username, email FROM users WHERE id = ?',
      [decoded.userId]
    );
    connection.release();

    const user = users[0];
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 401 }
      );
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
}
