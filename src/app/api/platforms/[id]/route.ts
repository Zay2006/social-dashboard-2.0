import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export const dynamic = 'force-dynamic';

export interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const platformId = parseInt(params.id);

    if (isNaN(platformId)) {
      return NextResponse.json(
        { error: 'Invalid platform ID' },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      const [result] = await connection.execute(
        'DELETE FROM platforms WHERE id = ?',
        [platformId]
      );

      // @ts-expect-error - MySQL2 types are not perfect
      if (!result?.affectedRows) {
        return NextResponse.json(
          { error: 'Platform not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: 'Platform deleted successfully' },
        { status: 200 }
      );
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting platform:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
