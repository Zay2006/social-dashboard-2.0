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
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    
    // Get token from cookie
    const cookieHeader = request.headers.get('cookie');
    console.log('Cookie header:', cookieHeader); // Debug log
    
    if (!cookieHeader) {
      console.log('No cookie header found');
      return NextResponse.json({ message: 'No authentication cookie found' }, { status: 401 });
    }
    
    const token = cookieHeader.split('token=')[1]?.split(';')[0];
    console.log('Extracted token:', token ? 'Present' : 'Not found'); // Debug log
    
    if (!token) {
      console.log('No token found in cookie');
      return NextResponse.json({ message: 'No authentication token found' }, { status: 401 });
    }

    try {
      const pool = await connectToDatabase();
      const connection = await pool.getConnection();

      try {
        console.log('Attempting database query...'); // Debug log
        
        // Get aggregated platform stats across all users
        const query = `
          SELECT DISTINCT
            p.id,
            p.name as platform,
            COALESCE(SUM(pf.followers_count), 0) as followers,
            COALESCE(COUNT(DISTINCT em.id), 0) as engagement_count
          FROM platforms p
          LEFT JOIN platform_followers pf ON p.id = pf.platform_id
          LEFT JOIN engagement_metrics em ON p.id = em.platform_id AND em.timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
          ${platform && platform !== 'all' ? 'WHERE p.name = ?' : ''}
          GROUP BY p.id, p.name
          ORDER BY p.name ASC
        `;

        const params: string[] = [];
        if (platform && platform !== 'all') {
          params.push(platform);
        }

        console.log('Executing query:', query); // Debug log
        console.log('Query params:', params); // Debug log

        const [rows] = await connection.execute<PlatformStatsRow[]>(query, params);
        console.log('Query results:', rows); // Debug log

        // Format the results
        const formattedStats: FormattedPlatformStats[] = rows.map(row => ({
          platform: row.platform,
          followers: row.followers.toString(),
          engagement: ((row.engagement_count / (row.followers || 1)) * 100).toFixed(2)
        }));

        console.log('Formatted stats:', formattedStats); // Debug log
        return NextResponse.json(formattedStats);
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { message: 'Database error: ' + (error instanceof Error ? error.message : 'Unknown error') },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      { message: 'Server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
