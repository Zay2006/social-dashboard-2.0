import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { getConnection } from '@/lib/db';

interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const connection = await getConnection();
    
    // Find user by email
    const [users] = await connection.execute(
      'SELECT id, username, email, password_hash FROM users WHERE email = ?',
      [email]
    );
    connection.release();

    const user = (users as User[])[0];

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('🔑 Attempting password verification...');
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('🔐 Password verification result:', isValidPassword ? 'SUCCESS' : 'FAILED');
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const token = await new jose.SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    console.log('🎉 Authentication successful for user:', user.email);
    
    console.log('🍪 Setting auth cookie with token:', token);
    
    // Set HTTP-only cookie with the token
    const response = NextResponse.json(
      { message: 'Sign in successful', user: { id: user.id, email: user.email, username: user.username } },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false, // Set to false for local development
      sameSite: 'lax', // Changed to lax for better compatibility
      path: '/', // Ensure cookie is available on all paths
      maxAge: 86400 // 24 hours
    });

    console.log('🔒 Cookie set, headers:', response.headers.get('set-cookie'));

    return response;
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
