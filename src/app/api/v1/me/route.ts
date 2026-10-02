import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/api/auth';
import { addressDto, userDto } from '@/lib/api/dto';
import { ApiError, handle, ok, readJson } from '@/lib/api/http';
import { updateProfileSchema, validate } from '@/lib/api/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The signed-in patient's profile.
 *
 * `GET` is the account-sync handshake: it verifies the Supabase token sent by
 * the Flutter app and returns (creating if necessary) the matching Prisma `User`
 * row. A patient who registered in the app therefore has a real row in
 * `users`, reachable by the website portal, on their very first call.
 */
export async function GET(request: Request) {
  return handle(async () => {
    const user = await requireUser(request);
    const addresses = await prisma.savedAddress.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });

    return ok({
      ...userDto(user),
      addresses: addresses.map(addressDto),
    });
  });
}

/** Profile edits land in the same `users` row the website profile form writes. */
export async function PATCH(request: Request) {
  return handle(async () => {
    const user = await requireUser(request);
    const payload = validate(updateProfileSchema, await readJson(request));

    if (Object.keys(payload).length === 0) {
      throw new ApiError('BAD_REQUEST', 'Provide at least one field to update.');
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
        ...(payload.locale !== undefined ? { locale: payload.locale } : {}),
        ...(payload.image !== undefined ? { image: payload.image ?? null } : {}),
      },
    });

    return ok(userDto(updated));
  });
}

/**
 * Account deletion. Removes the shared Prisma row (cascading to appointments,
 * reports, saved addresses and device tokens) and then the Supabase Auth user,
 * so the account cannot sign back in from either client.
 */
export async function DELETE(request: Request) {
  return handle(async () => {
    const user = await requireUser(request);

    await prisma.user.delete({ where: { id: user.id } });

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    let authUserDeleted = false;

    if (serviceRoleKey && supabaseUrl && user.supabaseId) {
      const admin = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { error } = await admin.auth.admin.deleteUser(user.supabaseId);
      authUserDeleted = !error;
    }

    return ok({ deleted: true, authUserDeleted });
  });
}
