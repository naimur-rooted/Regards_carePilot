import { prisma } from '@/lib/prisma';
import { handle, ok } from '@/lib/api/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Liveness probe used by the mobile app's connectivity banner and by CI.
 * Reports datastore reachability without failing the request, because the
 * website is designed to serve demonstration content when Postgres is down.
 */
export async function GET() {
  return handle(async () => {
    let database: 'up' | 'down' = 'up';

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      database = 'down';
    }

    return ok(
      {
        status: 'ok',
        database,
        version: 'v1',
        time: new Date().toISOString(),
      },
      {},
    );
  });
}
