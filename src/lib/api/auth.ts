import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { User } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ApiError } from './http';

/**
 * Supabase Auth is the single source of truth for identity across the website
 * and the mobile app. Both clients send the Supabase **access token** as
 * `Authorization: Bearer …`; this module verifies it against the same Supabase
 * project (`NEXT_PUBLIC_SUPABASE_URL`) and maps it onto the shared Prisma
 * `users` row through `users.supabase_id`.
 *
 * Because both clients authenticate against the same hosted service, an account
 * registered in the app is immediately usable on the website and vice-versa —
 * there is no mobile-only user table anywhere in this codebase.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseAuthConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let verifier: SupabaseClient | null = null;

/**
 * A bare client used only to call `/auth/v1/user`. It deliberately does not
 * persist or refresh sessions — the verified claims are handed straight to the
 * request handler.
 */
function getVerifier(): SupabaseClient {
  if (!verifier) {
    verifier = createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
  return verifier;
}

export type AuthClaims = {
  supabaseUserId: string;
  email: string;
  name: string | null;
  phone: string | null;
  image: string | null;
};

export function getBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization') ?? request.headers.get('Authorization');
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match?.[1]?.trim() || null;
}

/** Verifies a Supabase access token. Returns null when it is invalid/expired. */
export async function verifyToken(token: string): Promise<AuthClaims | null> {
  if (!supabaseAuthConfigured) return null;

  try {
    const { data, error } = await getVerifier().auth.getUser(token);
    if (error || !data.user) return null;

    const user = data.user;
    const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;

    return {
      supabaseUserId: user.id,
      email: user.email ?? '',
      name: (metadata.full_name as string) || (metadata.name as string) || null,
      phone: user.phone ?? ((metadata.phone as string) || null),
      image: (metadata.avatar_url as string) || null,
    };
  } catch {
    return null;
  }
}

/**
 * Returns the Prisma user for the bearer token, creating the row on first
 * contact. This is the bridge that keeps `users.supabase_id` populated, so a
 * patient who registers in the app is a full first-class user on the website.
 */
export async function requireUser(request: Request): Promise<User> {
  const token = getBearerToken(request);
  if (!token) {
    throw new ApiError('UNAUTHORIZED', 'A Supabase access token is required.');
  }

  if (!supabaseAuthConfigured) {
    throw new ApiError(
      'SERVICE_UNAVAILABLE',
      'Supabase Auth is not configured on this deployment.',
    );
  }

  const claims = await verifyToken(token);
  if (!claims) {
    throw new ApiError('UNAUTHORIZED', 'That access token is invalid or has expired.');
  }

  return upsertUserFromClaims(claims);
}

/**
 * Finds the user by Supabase subject first, then by email (so an account
 * created on the website before Supabase Auth was wired up is linked rather
 * than duplicated).
 */
export async function upsertUserFromClaims(claims: AuthClaims): Promise<User> {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { supabaseId: claims.supabaseUserId },
        ...(claims.email ? [{ email: claims.email }] : []),
      ],
    },
  });

  if (existing) {
    const needsUpdate =
      existing.supabaseId !== claims.supabaseUserId ||
      (!existing.name && claims.name) ||
      (!existing.phone && claims.phone) ||
      (!existing.image && claims.image);

    if (!needsUpdate) return existing;

    return prisma.user.update({
      where: { id: existing.id },
      data: {
        supabaseId: claims.supabaseUserId,
        name: existing.name ?? claims.name,
        phone: existing.phone ?? claims.phone,
        image: existing.image ?? claims.image,
      },
    });
  }

  return prisma.user.create({
    data: {
      supabaseId: claims.supabaseUserId,
      email: claims.email,
      name: claims.name,
      phone: claims.phone,
      image: claims.image,
    },
  });
}

/**
 * Optional authentication for the content endpoints: a signed-in patient gets
 * personalized fields, an anonymous caller still gets public data.
 */
export async function optionalUser(request: Request): Promise<User | null> {
  const token = getBearerToken(request);
  if (!token || !supabaseAuthConfigured) return null;
  try {
    return await requireUser(request);
  } catch {
    return null;
  }
}
