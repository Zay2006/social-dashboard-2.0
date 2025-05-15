import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import jwt from 'jsonwebtoken';

// Helper function to get user ID from token
const getUserIdFromToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
};

export async function deletePlatform(id: string, token: string | null): Promise<NextResponse> {
  try {
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const platformId = parseInt(id);
    if (isNaN(platformId)) {
      return NextResponse.json({ message: 'Invalid platform ID' }, { status: 400 });
    }

    const connection = await getConnection();

    // Check if platform exists and belongs to user
    const [platform] = await connection.execute(
      'SELECT id FROM platform_followers WHERE user_id = ? AND platform_id = ?',
      [userId, platformId]
    );

    if (!(platform as { id: number }[])[0]) {
      connection.release();
      return NextResponse.json(
        { message: 'Platform not found or not owned by user' },
        { status: 404 }
      );
    }

    // Delete platform
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
