import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/api/auth';
import { addressDto } from '@/lib/api/dto';
import { created, handle, ok, readJson } from '@/lib/api/http';
import { addressSchema, validate } from '@/lib/api/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** The patient's address book, shared with the website. */
export async function GET(request: Request) {
  return handle(async () => {
    const user = await requireUser(request);
    const addresses = await prisma.savedAddress.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });

    return ok(addresses.map(addressDto), { count: addresses.length });
  });
}

export async function POST(request: Request) {
  return handle(async () => {
    const user = await requireUser(request);
    const payload = validate(addressSchema, await readJson(request));

    const address = await prisma.$transaction(async (tx) => {
      // Only one address can be the default, exactly as the picker expects.
      if (payload.isDefault) {
        await tx.savedAddress.updateMany({
          where: { userId: user.id },
          data: { isDefault: false },
        });
      }

      const isFirst = (await tx.savedAddress.count({ where: { userId: user.id } })) === 0;

      return tx.savedAddress.create({
        data: {
          userId: user.id,
          label: payload.label,
          fullName: payload.fullName,
          phone: payload.phone,
          address: payload.address,
          area: payload.area ?? null,
          city: payload.city ?? null,
          isDefault: payload.isDefault || isFirst,
        },
      });
    });

    return created(addressDto(address));
  });
}
