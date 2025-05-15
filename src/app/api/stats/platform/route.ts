import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface PlatformStatsRow extends RowDataPacket {
  platform: string;
  followers: number;
  engagement_count: number;
}

interface FormattedPlatformStats {
  platform: string;
  followers: string;
  engagement: string;
}

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');

  try {
    const pool = await connectToDatabase();
    const connection = await pool.getConnection();

    try {
      // Get platform followers and engagement metrics
      const query = `
        SELECT 
          p.name as platform,
          COALESCE(pf.followers_count, 0) as followers,
          COALESCE(COUNT(em.id), 0) as engagement_count
        FROM platforms p
        LEFT JOIN platform_followers pf ON p.id = pf.platform_id
        LEFT JOIN engagement_metrics em ON p.id = em.platform_id AND em.timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        ${platform && platform !== 'all' ? 'WHERE p.name = ?' : ''}
        GROUP BY p.id, p.name, pf.followers_count
        ORDER BY p.name ASC
      `;
      const params: string[] = platform && platform !== 'all' ? [platform] : [];

      const [rows] = await connection.execute<PlatformStatsRow[]>(query, params);
      
      // Format the response to match the expected structure
      const formattedRows: FormattedPlatformStats[] = rows.map(row => {
        const engagementRate = row.followers > 0
          ? ((row.engagement_count / row.followers) * 100).toFixed(1)
          : '0';

        return {
          platform: row.platform,
          followers: row.followers.toString(),
          engagement: `${engagementRate}%`,
          rawEngagement: row.engagement_count
        };
      });

      return NextResponse.json(formattedRows);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform stats' },
      { status: 500 }
    );
  }
}
