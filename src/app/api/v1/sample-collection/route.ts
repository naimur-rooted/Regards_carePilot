import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/api/auth';
import { sampleCollectionDto, withCollectionType } from '@/lib/api/dto';
import { sendPushToUser } from '@/lib/api/push';
import { referenceCode } from '@/lib/notifications';
import { ApiError, created, handle, ok, parseLocale, parsePagination, readJson } from '@/lib/api/http';
import { createSampleCollectionSchema, validate } from '@/lib/api/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BRANCH_REF = { select: { slug: true, nameEn: true, nameBn: true, cityEn: true, cityBn: true } };

/** The signed-in patient's sample-collection requests, newest first. */
export async function GET(request: Request) {
  return handle(async () => {
    const user = await requireUser(request);
    const locale = parseLocale(request);
    const { page, pageSize, skip } = parsePagination(request, { pageSize: 20 });
    const statusParam = new URL(request.url).searchParams.get('status');
    const allowed = ['NEW', 'CONTACTED', 'SCHEDULED', 'COMPLETED', 'CANCELLED'] as const;
    const status = allowed.find((value) => value === statusParam?.toUpperCase());

    if (statusParam && !status) {
      throw new ApiError('BAD_REQUEST', `Unknown status "${statusParam}".`, { allowed });
    }

    // `sample_collection_requests` has no user_id column on the website schema,
    // so ownership is established by the phone number captured at booking —
    // which is the patient's verified profile phone.
    const where = {
      phone: user.phone ?? '',
      ...(status ? { status } : {}),
    };

    if (!user.phone) {
      return ok([], { locale, count: 0, page, pageSize, total: 0, hasMore: false });
    }

    const [rows, total] = await Promise.all([
      prisma.sampleCollectionRequest.findMany({
        where,
        include: { branch: BRANCH_REF },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.sampleCollectionRequest.count({ where }),
    ]);

    return ok(
      rows.map((row) => sampleCollectionDto(row, locale)),
      { locale, count: rows.length, page, pageSize, total, hasMore: skip + rows.length < total },
    );
  });
}

/**
 * Creates a home-collection or in-branch request in the same
 * `sample_collection_requests` table the website form writes to.
 */
export async function POST(request: Request) {
  return handle(async () => {
    const user = await requireUser(request);
    const locale = parseLocale(request);
    const payload = validate(createSampleCollectionSchema, await readJson(request));

    const branch = payload.branchSlug
      ? await prisma.branch.findUnique({ where: { slug: payload.branchSlug } })
      : null;

    if (payload.branchSlug && !branch) {
      throw new ApiError('NOT_FOUND', `No branch matches "${payload.branchSlug}".`);
    }

    const fullName = payload.fullName ?? user.name;
    const phone = payload.phone ?? user.phone;

    if (!fullName) {
      throw new ApiError('BAD_REQUEST', 'A patient name is required.', { field: 'fullName' });
    }
    if (!phone) {
      throw new ApiError('BAD_REQUEST', 'A contact number is required.', { field: 'phone' });
    }

    const record = await prisma.sampleCollectionRequest.create({
      data: {
        referenceCode: referenceCode('SC'),
        fullName,
        phone,
        email: payload.email ?? user.email,
        address: payload.address,
        area: payload.area ?? null,
        city: payload.city ?? null,
        testsRequested: payload.testsRequested,
        preferredDate: new Date(`${payload.preferredDate}T00:00:00.000Z`),
        preferredSlot: payload.preferredSlot,
        notes: withCollectionType(payload.notes ?? null, payload.collectionType),
        locale: payload.locale ?? locale,
        branchId: branch?.id ?? null,
      },
      include: { branch: BRANCH_REF },
    });

    void sendPushToUser(user.id, {
      kind: 'appointment',
      title: `Sample collection ${record.referenceCode}`,
      body: `${payload.preferredDate} · ${payload.preferredSlot}`,
      refType: 'sample-collection',
      refId: record.id,
      locale: record.locale,
    }).catch(() => undefined);

    return created(sampleCollectionDto(record, locale), { locale });
  });
}
