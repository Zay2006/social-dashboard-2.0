import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

interface PlatformRow {
  id: number;
  name: string;
}

export async function GET() {
  try {
    const connection = await getConnection();

    // Insert sample engagement metrics
    const platforms = ['Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube', 'Pinterest'];
    const now = new Date();
    
    for (const platform of platforms) {
      // Get platform ID
      const [platformRows] = await connection.execute(
        'SELECT id FROM platforms WHERE name = ?',
        [platform]
      );
      
      const platformId = (platformRows as PlatformRow[])[0]?.id;
      if (!platformId) continue;

      // Add engagement metrics for the last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        
        await connection.execute(
          'INSERT INTO engagement_metrics (user_id, platform_id, engagement_count, follower_growth, timestamp) VALUES (?, ?, ?, ?, ?)',
          [
            1, // Default user ID
            platformId,
            Math.floor(Math.random() * 1000) + 500, // Random engagement between 500-1500
            Math.floor(Math.random() * 100) + 10, // Random growth between 10-110
            date
          ]
        );
      }
    }

    connection.release();
    return NextResponse.json({ message: 'Sample data added successfully' });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json(
      { error: 'Failed to seed data' },
      { status: 500 }
    );
  }
}
