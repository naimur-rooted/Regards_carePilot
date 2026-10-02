/**
 * Locale-resolved view models.
 *
 * Database and CMS rows store bilingual column pairs (name_en / name_bn).
 * Every page works with these flattened shapes instead, so a component never
 * has to know which locale it is rendering.
 */
export type Locale = 'en' | 'bn';

/** Bilingual source text, as authored in Sanity or stored in Postgres. */
export type LocalizedText = { en: string; bn: string };

export function pick(value: LocalizedText | null | undefined, locale: Locale): string {
  if (!value) return '';
  return locale === 'bn' ? value.bn || value.en : value.en || value.bn;
}

export type SpecialtyView = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  doctorCount: number;
};

export type BranchView = {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  altPhone: string | null;
  email: string | null;
  hours: string | null;
  mapUrl: string | null;
  image: string | null;
  /** Coordinates for the map views (website iframe fallback, mobile Google Maps). */
  latitude: number | null;
  longitude: number | null;
  offersHomeCollection: boolean;
  doctorCount: number;
  testCount: number;
};

export type DoctorAvailability = {
  branchSlug: string;
  branchName: string;
  branchCity: string;
  schedule: string;
  fee: number | null;
  isPrimary: boolean;
};

export type DoctorView = {
  id: string;
  slug: string;
  name: string;
  designation: string;
  specialtySlug: string;
  specialtyName: string;
  qualifications: string | null;
  bio: string | null;
  photo: string | null;
  bmdcRegNo: string | null;
  experienceYears: number | null;
  languages: string[];
  isFeatured: boolean;
  availability: DoctorAvailability[];
};

export type TestCategory = 'PATHOLOGY' | 'RADIOLOGY' | 'CARDIOLOGY' | 'IMAGING' | 'PACKAGE' | 'OTHER';

export type TestView = {
  id: string;
  slug: string;
  name: string;
  category: TestCategory;
  summary: string | null;
  preparation: string | null;
  price: number | null;
  discountedPrice: number | null;
  reportHours: number | null;
  homeCollection: boolean;
  branchName: string | null;
};

export type ArticleView = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  cover: string | null;
  category: string | null;
  tags: string[];
  author: string;
  reviewedBy: string | null;
  publishedAt: string | null;
  reviewDate: string | null;
  readingMinutes: number | null;
};

export type NoticeView = {
  id: string;
  title: string;
  body: string;
  category: string;
  isPinned: boolean;
  publishedAt: string;
  expiresAt: string | null;
};

export type DoctorFilters = {
  search?: string;
  specialty?: string;
  branch?: string;
};

export type NetworkStats = {
  specialties: number;
  doctors: number;
  branches: number;
  tests: number;
};
