import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/api/auth';
import { created, handle, ok, readJson } from '@/lib/api/http';
import { deleteDeviceTokenSchema, deviceTokenSchema, validate } from '@/lib/api/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Registers this device for push notifications. Called by the app after login
 * and whenever FCM rotates the token.
 *
 * The token is unique globally, so signing in on a shared device transfers the
 * registration to the new patient instead of leaving the previous patient's
 * alerts going to that handset.
 */
export async function POST(request: Request) {
  return handle(async () => {
    const user = await requireUser(request);
    const payload = validate(deviceTokenSchema, await readJson(request));

    const record = await prisma.deviceToken.upsert({
      where: { token: payload.token },
      create: {
        userId: user.id,
        token: payload.token,
        platform: payload.platform,
        locale: payload.locale,
        appVersion: payload.appVersion ?? null,
      },
      update: {
        userId: user.id,
        platform: payload.platform,
        locale: payload.locale,
        appVersion: payload.appVersion ?? null,
        lastSeenAt: new Date(),
      },
    });

    return created({ id: record.id, registered: true });
  });
}

/** Called on sign-out so this handset stops receiving another patient's alerts. */
export async function DELETE(request: Request) {
  return handle(async () => {
    await requireUser(request);
    const payload = validate(deleteDeviceTokenSchema, await readJson(request));

    await prisma.deviceToken.deleteMany({ where: { token: payload.token } });

    return ok({ removed: true });
  });
}
