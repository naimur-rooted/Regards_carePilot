import {
  demoArticles,
  demoBranches,
  demoDoctors,
  demoNotices,
  demoSpecialties,
  demoTests,
} from './demo-data';
import { prisma, safeQuery } from './prisma';
import {
  pick,
  type ArticleView,
  type BranchView,
  type DoctorAvailability,
  type DoctorFilters,
  type DoctorView,
  type Locale,
  type NetworkStats,
  type NoticeView,
  type SpecialtyView,
  type TestCategory,
  type TestView,
} from './types';

/**
 * The single read path for clinical content.
 *
 * Every function tries Postgres first (which is kept in step with Sanity by the
 * content sync job) and transparently falls back to the bundled demonstration
 * dataset when the database cannot be reached. Pages therefore never contain
 * try/catch boilerplate and the fallback is observable in one place.
 */

// ---------------------------------------------------------------------------
// Demonstration-data mappers
// ---------------------------------------------------------------------------

function demoSpecialtyViews(locale: Locale): SpecialtyView[] {
  return demoSpecialties.map((specialty) => ({
    id: `demo-specialty-${specialty.slug}`,
    slug: specialty.slug,
    name: pick(specialty.name, locale),
    description: pick(specialty.description, locale),
    icon: specialty.icon,
    doctorCount: demoDoctors.filter((doctor) => doctor.specialtySlug === specialty.slug).length,
  }));
}

function demoBranchViews(locale: Locale): BranchView[] {
  return demoBranches.map((branch) => ({
    id: `demo-branch-${branch.slug}`,
    slug: branch.slug,
    name: pick(branch.name, locale),
    address: pick(branch.address, locale),
    city: pick(branch.city, locale),
    phone: branch.phone,
    altPhone: branch.altPhone,
    email: branch.email,
    hours: pick(branch.hours, locale),
    mapUrl: branch.mapUrl,
    image: branch.image,
    latitude: branch.latitude,
    longitude: branch.longitude,
    offersHomeCollection: branch.offersHomeCollection,
    doctorCount: demoDoctors.filter((doctor) =>
      doctor.availability.some((slot) => slot.branchSlug === branch.slug),
    ).length,
    testCount: demoTests.filter(
      (test) => test.branchSlug === null || test.branchSlug === branch.slug,
    ).length,
  }));
}

function demoDoctorViews(locale: Locale, filters: DoctorFilters = {}): DoctorView[] {
  const branches = demoBranchViews(locale);
  const specialties = demoSpecialtyViews(locale);

  const views = demoDoctors.map<DoctorView>((doctor) => {
    const specialty = specialties.find((item) => item.slug === doctor.specialtySlug);
    const availability: DoctorAvailability[] = doctor.availability.map((slot) => {
      const branch = branches.find((item) => item.slug === slot.branchSlug);
      return {
        branchSlug: slot.branchSlug,
        branchName: branch?.name ?? slot.branchSlug,
        branchCity: branch?.city ?? '',
        schedule: pick(slot.schedule, locale),
        fee: slot.fee,
        isPrimary: slot.isPrimary,
      };
    });

    return {
      id: `demo-doctor-${doctor.slug}`,
      slug: doctor.slug,
      name: pick(doctor.name, locale),
      designation: pick(doctor.designation, locale),
      specialtySlug: doctor.specialtySlug,
      specialtyName: specialty?.name ?? doctor.specialtySlug,
      qualifications: pick(doctor.qualifications, locale),
      bio: pick(doctor.bio, locale),
      photo: doctor.photo,
      bmdcRegNo: doctor.bmdcRegNo,
      experienceYears: doctor.experienceYears,
      languages: doctor.languages,
      isFeatured: doctor.isFeatured,
      availability,
    };
  });

  const search = filters.search?.trim().toLowerCase();
  return views.filter((doctor) => {
    const matchesSearch =
      !search ||
      [doctor.name, doctor.designation, doctor.specialtyName, doctor.qualifications ?? '']
        .join(' ')
        .toLowerCase()
        .includes(search);
    const matchesSpecialty = !filters.specialty || doctor.specialtySlug === filters.specialty;
    const matchesBranch =
      !filters.branch || doctor.availability.some((slot) => slot.branchSlug === filters.branch);
    return matchesSearch && matchesSpecialty && matchesBranch;
  });
}

function demoTestViews(locale: Locale): TestView[] {
  const branches = demoBranchViews(locale);
  return demoTests.map((test) => ({
    id: `demo-test-${test.slug}`,
    slug: test.slug,
    name: pick(test.name, locale),
    category: test.category,
    summary: pick(test.summary, locale),
    preparation: test.preparation ? pick(test.preparation, locale) : null,
    price: test.price,
    discountedPrice: test.discountedPrice,
    reportHours: test.reportHours,
    homeCollection: test.homeCollection,
    branchName: test.branchSlug
      ? branches.find((branch) => branch.slug === test.branchSlug)?.name ?? null
      : null,
  }));
}

function demoArticleViews(locale: Locale): ArticleView[] {
  return demoArticles.map((article) => ({
    id: `demo-article-${article.slug}`,
    slug: article.slug,
    title: pick(article.title, locale),
    excerpt: pick(article.excerpt, locale),
    body: locale === 'bn' ? article.body.bn : article.body.en,
    cover: article.cover,
    category: article.category,
    tags: article.tags,
    author: article.author,
    reviewedBy: article.reviewedBy,
    publishedAt: article.publishedAt,
    reviewDate: article.reviewDate,
    readingMinutes: article.readingMinutes,
  }));
}

// ---------------------------------------------------------------------------
// Public read API
// ---------------------------------------------------------------------------

/** Specialties with a count of active doctors, used for directory filters. */
export async function getSpecialties(locale: Locale): Promise<SpecialtyView[]> {
  const fallback = demoSpecialtyViews(locale);

  const { data } = await safeQuery(
    async () => {
      const rows = await prisma.specialty.findMany({
        where: { isActive: true },
        orderBy: [{ order: 'asc' }, { nameEn: 'asc' }],
        include: { _count: { select: { doctors: { where: { isActive: true } } } } },
      });

      return rows.map<SpecialtyView>((row) => ({
        id: row.id,
        slug: row.slug,
        name: pick({ en: row.nameEn, bn: row.nameBn }, locale),
        description: row.descriptionEn || row.descriptionBn
          ? pick({ en: row.descriptionEn ?? '', bn: row.descriptionBn ?? '' }, locale)
          : null,
        icon: row.icon,
        doctorCount: row._count.doctors,
      }));
    },
    fallback,
    'getSpecialties',
  );

  return data.length > 0 ? data : fallback;
}

/** All active branches with doctor and test counts. */
export async function getBranches(locale: Locale): Promise<BranchView[]> {
  const fallback = demoBranchViews(locale);

  const { data } = await safeQuery(
    async () => {
      const rows = await prisma.branch.findMany({
        where: { isActive: true },
        orderBy: [{ order: 'asc' }, { nameEn: 'asc' }],
        include: {
          _count: { select: { doctors: true, tests: { where: { isActive: true } } } },
        },
      });

      return rows.map<BranchView>((row) => ({
        id: row.id,
        slug: row.slug,
        name: pick({ en: row.nameEn, bn: row.nameBn }, locale),
        address: pick({ en: row.addressEn, bn: row.addressBn }, locale),
        city: pick({ en: row.cityEn, bn: row.cityBn }, locale),
        phone: row.phone,
        altPhone: row.altPhone,
        email: row.email,
        hours: row.hoursEn || row.hoursBn
          ? pick({ en: row.hoursEn ?? '', bn: row.hoursBn ?? '' }, locale)
          : null,
        mapUrl: row.mapUrl,
        image: row.imagePublicId,
        latitude: row.latitude,
        longitude: row.longitude,
        offersHomeCollection: row.offersHomeCollection,
        doctorCount: row._count.doctors,
        testCount: row._count.tests,
      }));
    },
    fallback,
    'getBranches',
  );

  return data.length > 0 ? data : fallback;
}

export async function getBranch(locale: Locale, slug: string): Promise<BranchView | null> {
  const branches = await getBranches(locale);
  return branches.find((branch) => branch.slug === slug) ?? null;
}

/** Doctors filtered by free-text search, specialty slug and branch slug. */
export async function getDoctors(
  locale: Locale,
  filters: DoctorFilters = {},
): Promise<DoctorView[]> {
  const fallback = demoDoctorViews(locale, filters);
  const search = filters.search?.trim();

  const { data } = await safeQuery(
    async () => {
      const rows = await prisma.doctor.findMany({
        where: {
          isActive: true,
          ...(filters.specialty ? { specialty: { slug: filters.specialty } } : {}),
          ...(filters.branch
            ? { branches: { some: { branch: { slug: filters.branch } } } }
            : {}),
          ...(search
            ? {
                OR: [
                  { nameEn: { contains: search, mode: 'insensitive' } },
                  { nameBn: { contains: search, mode: 'insensitive' } },
                  { designationEn: { contains: search, mode: 'insensitive' } },
                  { qualificationsEn: { contains: search, mode: 'insensitive' } },
                  { specialty: { nameEn: { contains: search, mode: 'insensitive' } } },
                ],
              }
            : {}),
        },
        orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { nameEn: 'asc' }],
        include: {
          specialty: true,
          branches: { include: { branch: true }, orderBy: { isPrimary: 'desc' } },
        },
      });

      return rows.map<DoctorView>((row) => ({
        id: row.id,
        slug: row.slug,
        name: pick({ en: row.nameEn, bn: row.nameBn }, locale),
        designation: pick({ en: row.designationEn, bn: row.designationBn }, locale),
        specialtySlug: row.specialty.slug,
        specialtyName: pick({ en: row.specialty.nameEn, bn: row.specialty.nameBn }, locale),
        qualifications: row.qualificationsEn || row.qualificationsBn
          ? pick({ en: row.qualificationsEn ?? '', bn: row.qualificationsBn ?? '' }, locale)
          : null,
        bio: row.bioEn || row.bioBn
          ? pick({ en: row.bioEn ?? '', bn: row.bioBn ?? '' }, locale)
          : null,
        photo: row.photoPublicId,
        bmdcRegNo: row.bmdcRegNo,
        experienceYears: row.experienceYears,
        languages: row.languages,
        isFeatured: row.isFeatured,
        availability: row.branches.map((link) => ({
          branchSlug: link.branch.slug,
          branchName: pick({ en: link.branch.nameEn, bn: link.branch.nameBn }, locale),
          branchCity: pick({ en: link.branch.cityEn, bn: link.branch.cityBn }, locale),
          schedule: link.scheduleEn || link.scheduleBn
            ? pick({ en: link.scheduleEn ?? '', bn: link.scheduleBn ?? '' }, locale)
            : '',
          fee: link.consultationFee ? Number(link.consultationFee) : null,
          isPrimary: link.isPrimary,
        })),
      }));
    },
    fallback,
    'getDoctors',
  );

  return data.length > 0 ? data : fallback;
}

export async function getDoctor(locale: Locale, slug: string): Promise<DoctorView | null> {
  const doctors = await getDoctors(locale);
  const match = doctors.find((doctor) => doctor.slug === slug);
  if (match) return match;
  return demoDoctorViews(locale).find((doctor) => doctor.slug === slug) ?? null;
}

/** Featured doctors for the homepage carousel, with a graceful fallback. */
export async function getFeaturedDoctors(locale: Locale, limit = 4): Promise<DoctorView[]> {
  const doctors = await getDoctors(locale);
  const featured = doctors.filter((doctor) => doctor.isFeatured);
  return (featured.length > 0 ? featured : doctors).slice(0, limit);
}

function demoNoticeViews(locale: Locale): NoticeView[] {
  return demoNotices.map((notice) => ({
    id: `demo-notice-${notice.slug}`,
    title: pick(notice.title, locale),
    body: pick(notice.body, locale),
    category: notice.category,
    isPinned: notice.isPinned,
    publishedAt: notice.publishedAt,
    expiresAt: notice.expiresAt,
  }));
}

/** Diagnostic tests and packages, optionally narrowed to one category. */
export async function getTests(locale: Locale, category?: TestCategory): Promise<TestView[]> {
  const fallback = demoTestViews(locale).filter((test) => !category || test.category === category);

  const { data } = await safeQuery(
    async () => {
      const rows = await prisma.diagnosticTest.findMany({
        where: { isActive: true, ...(category ? { category } : {}) },
        orderBy: [{ category: 'asc' }, { order: 'asc' }, { nameEn: 'asc' }],
        include: { branch: true },
      });

      return rows.map<TestView>((row) => ({
        id: row.id,
        slug: row.slug,
        name: pick({ en: row.nameEn, bn: row.nameBn }, locale),
        category: row.category,
        summary: row.summaryEn || row.summaryBn
          ? pick({ en: row.summaryEn ?? '', bn: row.summaryBn ?? '' }, locale)
          : null,
        preparation: row.preparationEn || row.preparationBn
          ? pick({ en: row.preparationEn ?? '', bn: row.preparationBn ?? '' }, locale)
          : null,
        price: row.price ? Number(row.price) : null,
        discountedPrice: row.discountedPrice ? Number(row.discountedPrice) : null,
        reportHours: row.reportHours,
        homeCollection: row.homeCollection,
        branchName: row.branch
          ? pick({ en: row.branch.nameEn, bn: row.branch.nameBn }, locale)
          : null,
      }));
    },
    fallback,
    'getTests',
  );

  return data.length > 0 ? data : fallback;
}

/**
 * Converts stored article bodies into display paragraphs.
 * Sanity portable text is flattened to text; simple string arrays pass through.
 */
function bodyToParagraphs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((block) => {
      if (typeof block === 'string') return block.trim();
      if (!block || typeof block !== 'object') return '';
      const children = (block as { children?: unknown }).children;
      if (!Array.isArray(children)) return '';
      return children
        .map((child) =>
          child && typeof child === 'object'
            ? String((child as { text?: unknown }).text ?? '')
            : '',
        )
        .join('')
        .trim();
    })
    .filter((paragraph) => paragraph.length > 0);
}

export async function getArticles(locale: Locale): Promise<ArticleView[]> {
  const fallback = demoArticleViews(locale);

  const { data } = await safeQuery(
    async () => {
      const rows = await prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
      });

      return rows.map<ArticleView>((row) => ({
        id: row.id,
        slug: row.slug,
        title: pick({ en: row.titleEn, bn: row.titleBn }, locale),
        excerpt: row.excerptEn || row.excerptBn
          ? pick({ en: row.excerptEn ?? '', bn: row.excerptBn ?? '' }, locale)
          : '',
        body: bodyToParagraphs(locale === 'bn' ? row.bodyBn : row.bodyEn),
        cover: row.coverPublicId,
        category: row.category,
        tags: row.tags,
        author: row.authorName ?? 'CarePilot editorial team',
        reviewedBy: row.reviewedBy,
        publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
        reviewDate: row.reviewDate ? row.reviewDate.toISOString() : null,
        readingMinutes: row.readingMinutes,
      }));
    },
    fallback,
    'getArticles',
  );

  return data.length > 0 ? data : fallback;
}

export async function getArticle(locale: Locale, slug: string): Promise<ArticleView | null> {
  const articles = await getArticles(locale);
  const match = articles.find((article) => article.slug === slug);
  if (match) return match;
  return demoArticleViews(locale).find((article) => article.slug === slug) ?? null;
}

/** Notices, pinned first, then newest first. Expired notices are excluded. */
export async function getNotices(locale: Locale): Promise<NoticeView[]> {
  const now = new Date();
  const fallback = demoNoticeViews(locale)
    .filter((notice) => !notice.expiresAt || new Date(notice.expiresAt) >= now)
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  const { data } = await safeQuery(
    async () => {
      const rows = await prisma.notice.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
        },
        orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
      });

      return rows.map<NoticeView>((row) => ({
        id: row.id,
        title: pick({ en: row.titleEn, bn: row.titleBn }, locale),
        body: row.bodyEn || row.bodyBn
          ? pick({ en: row.bodyEn ?? '', bn: row.bodyBn ?? '' }, locale)
          : '',
        category: 'general',
        isPinned: row.isPinned,
        publishedAt: row.publishedAt.toISOString(),
        expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
      }));
    },
    fallback,
    'getNotices',
  );

  return data.length > 0 ? data : fallback;
}

/** Headline numbers for the homepage statistics strip. */
export async function getNetworkStats(): Promise<NetworkStats> {
  const [specialties, doctors, branches, tests] = await Promise.all([
    getSpecialties('en'),
    getDoctors('en'),
    getBranches('en'),
    getTests('en'),
  ]);

  return {
    specialties: specialties.length,
    doctors: doctors.length,
    branches: branches.length,
    tests: tests.length,
  };
}
