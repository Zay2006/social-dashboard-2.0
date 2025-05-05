import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ status: 'healthy', message: 'Database connected successfully' });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed' },
      { status: 500 }
    );
  }
}
