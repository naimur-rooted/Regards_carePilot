import { createClient, type SanityClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01';

/**
 * The studio and the public site share one dataset. Until a project ID is
 * configured the client is `null` and every read falls back to demonstration
 * content, so the site can still be reviewed locally.
 */
export const sanityConfigured = Boolean(projectId && dataset);

export const sanityClient: SanityClient | null = sanityConfigured
  ? createClient({
      projectId: projectId as string,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production',
      token: process.env.SANITY_API_READ_TOKEN || undefined,
      perspective: 'published',
    })
  : null;

/**
 * Runs a GROQ query and falls back to bundled content when Sanity is not
 * configured or the request fails.
 */
export async function sanityFetch<T>(
  query: string,
  fallback: T,
  params: Record<string, unknown> = {},
  tags: string[] = [],
): Promise<{ data: T; usedFallback: boolean }> {
  if (!sanityClient) return { data: fallback, usedFallback: true };

  try {
    const data = await sanityClient.fetch<T>(query, params, {
      next: { revalidate: 300, tags },
    });
    return { data, usedFallback: false };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[carepilot] Sanity query failed; serving demo content. ${(error as Error).message}`);
    }
    return { data: fallback, usedFallback: true };
  }
}

/** Builds a served image URL for a Sanity image reference. */
export function sanityImageUrl(ref: string | null | undefined, width = 1200): string | null {
  if (!ref || !sanityConfigured) return null;
  const cleaned = ref.replace('image-', '').replace('-', '/');
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${cleaned}?w=${width}&fit=max&auto=format`;
}
