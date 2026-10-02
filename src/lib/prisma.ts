import { PrismaClient } from '@prisma/client';

/**
 * A single PrismaClient instance is reused across hot reloads in development so
 * that we do not exhaust the Postgres connection pool.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Database reachability helper.
 *
 * The public pages read through `safeQuery`, which falls back to the bundled
 * demonstration dataset when the database is unreachable (for example before
 * Supabase credentials have been configured). This keeps the site browsable
 * for reviewers while making the fallback completely explicit in the logs.
 */
export async function safeQuery<T>(
  query: () => Promise<T>,
  fallback: T,
  label: string,
): Promise<{ data: T; usedFallback: boolean }> {
  try {
    return { data: await query(), usedFallback: false };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[carepilot] Database query "${label}" failed; serving demo data instead. ${(error as Error).message}`,
      );
    }
    return { data: fallback, usedFallback: true };
  }
}
