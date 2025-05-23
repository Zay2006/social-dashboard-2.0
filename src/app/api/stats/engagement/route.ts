import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface EngagementRow extends RowDataPacket {
  name: string;
  value: number;
  platform: string;
}

type AggregatedData = {
  [key: string]: {
    name: string;
    value: number;
  };
};

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: 'Start date and end date are required' },
      { status: 400 }
    );
  }

  try {
    const pool = await connectToDatabase();
    const connection = await pool.getConnection();

    try {
      const query = `
        WITH daily_stats AS (
          SELECT 
            DATE(em.timestamp) as date,
            p.name as platform,
            COUNT(DISTINCT em.id) as engagement_count,
            SUM(em.engagement_count) as total_engagement
          FROM engagement_metrics em
          JOIN platforms p ON em.platform_id = p.id
          WHERE em.timestamp BETWEEN ? AND ?
          ${platform && platform !== 'all' ? 'AND p.name = ?' : ''}
          GROUP BY DATE(em.timestamp), p.name
        )
        SELECT 
          DATE_FORMAT(ds.date, '%a') as name,
          COALESCE(ds.total_engagement, 0) as value,
          ds.platform,
          ds.date
        FROM daily_stats ds
        ORDER BY ds.date ASC
      `;
      
      const params: (string)[] = [startDate, endDate];
      if (platform && platform !== 'all') {
        params.push(platform);
      }

      const [rows] = await connection.execute<EngagementRow[]>(query, params);
      
      if (platform === 'all') {
        // For 'all' platform, sum up engagement across all platforms per day
        const aggregatedData = rows.reduce<AggregatedData>((acc, row) => {
          const date = row.name;
          if (!acc[date]) {
            acc[date] = { name: date, value: 0 };
          }
          acc[date].value += row.value;
          return acc;
        }, {});
        
        return NextResponse.json(Object.values(aggregatedData));
      }

      return NextResponse.json(rows);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch engagement data' },
      { status: 500 }
    );
  }
}
