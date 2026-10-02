import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/api/auth';
import { addressDto } from '@/lib/api/dto';
import { ApiError, handle, noContent, ok, readJson } from '@/lib/api/http';
import { addressUpdateSchema, validate } from '@/lib/api/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Loads an address only when it belongs to the caller. */
async function ownedAddress(userId: string, id: string) {
  const address = await prisma.savedAddress.findFirst({ where: { id, userId } });
  if (!address) throw new ApiError('NOT_FOUND', 'That address does not exist.');
  return address;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    const user = await requireUser(request);
    await ownedAddress(user.id, params.id);
    const payload = validate(addressUpdateSchema, await readJson(request));

    const updated = await prisma.$transaction(async (tx) => {
      if (payload.isDefault === true) {
        await tx.savedAddress.updateMany({
          where: { userId: user.id },
          data: { isDefault: false },
        });
      }

      return tx.savedAddress.update({
        where: { id: params.id },
        data: {
          ...(payload.label !== undefined ? { label: payload.label } : {}),
          ...(payload.fullName !== undefined ? { fullName: payload.fullName } : {}),
          ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
          ...(payload.address !== undefined ? { address: payload.address } : {}),
          ...(payload.area !== undefined ? { area: payload.area ?? null } : {}),
          ...(payload.city !== undefined ? { city: payload.city ?? null } : {}),
          ...(payload.isDefault !== undefined ? { isDefault: payload.isDefault } : {}),
        },
      });
    });

    return ok(addressDto(updated));
  });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    const user = await requireUser(request);
    const address = await ownedAddress(user.id, params.id);

    await prisma.savedAddress.delete({ where: { id: address.id } });

    // Never leave the patient without a default address.
    if (address.isDefault) {
      const next = await prisma.savedAddress.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' },
      });
      if (next) {
        await prisma.savedAddress.update({ where: { id: next.id }, data: { isDefault: true } });
      }
    }

    return noContent();
  });
}
