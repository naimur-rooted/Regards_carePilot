import { getNetworkStats } from '@/lib/content';
import { handle, ok } from '@/lib/api/http';

export const revalidate = 300;

/** Headline counts for the app's home screen statistics strip. */
export async function GET() {
  return handle(async () => {
    const stats = await getNetworkStats();
    return ok(stats, { source: 'database' }, { cacheable: true });
  });
}
