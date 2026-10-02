import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

/**
 * Browser-side Supabase client for the patient portal.
 *
 * The site is deliberately usable without credentials, so the client is created
 * lazily and `null` is returned when the project is not configured — the portal
 * then shows its sign-in screen as unavailable rather than crashing.
 */
export function getBrowserClient(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  if (!browserClient) {
    browserClient = createClient(url, key);
  }
  return browserClient;
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
