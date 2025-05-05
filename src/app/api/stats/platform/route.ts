import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');

  try {
    const pool = await connectToDatabase();
    const connection = await pool.getConnection();

    try {
      // Get platform followers and engagement metrics
      let query = `
        SELECT 
          pf.platform,
          SUM(pf.followers_count) as followers,
          COALESCE(ROUND((SUM(em.engagement_count) / SUM(pf.followers_count)) * 100, 2), 0) as engagement
        FROM platform_followers pf
        LEFT JOIN engagement_metrics em ON pf.platform = em.platform
        ${platform && platform !== 'all' ? 'WHERE pf.platform = ?' : ''}
        GROUP BY pf.platform
      `;
      const params: any[] = platform && platform !== 'all' ? [platform] : [];

      const [rows] = await connection.execute(query, params);
      
      // Format the response to match the expected structure
      const formattedRows = (rows as any[]).map(row => ({
        ...row,
        engagement: `${row.engagement}%`,
        followers: row.followers.toString()
      }));

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
