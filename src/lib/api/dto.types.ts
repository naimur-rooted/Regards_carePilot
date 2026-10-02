import type { Locale } from './http';

/**
 * DTO TypeScript shapes, hand-kept in step with
 * `docs/carepilot-api-contract.md` in the mobile repository and with the Dart
 * models in `lib/core/api/models`.
 *
 * These are the *wire* shapes — flat, locale-resolved, decimal-as-number. They
 * intentionally differ from the Prisma row types so that the bilingual column
 * pairs never reach a client.
 */

export type TestCategoryDto =
  | 'PATHOLOGY'
  | 'RADIOLOGY'
  | 'CARDIOLOGY'
  | 'IMAGING'
  | 'PACKAGE'
  | 'OTHER';

export type RequestStatusDto =
  | 'NEW'
  | 'CONTACTED'
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED';

export type SpecialtyDto = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  doctorCount: number;
};

export type BranchDto = {
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
  latitude: number | null;
  longitude: number | null;
  offersHomeCollection: boolean;
  doctorCount: number;
  testCount: number;
};

export type DoctorAvailabilityDto = {
  branchSlug: string;
  branchName: string;
  branchCity: string;
  schedule: string;
  fee: number | null;
  isPrimary: boolean;
};

export type DoctorDto = {
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
  availability: DoctorAvailabilityDto[];
};

export type TestDto = {
  id: string;
  slug: string;
  name: string;
  category: TestCategoryDto;
  summary: string | null;
  preparation: string | null;
  price: number | null;
  discountedPrice: number | null;
  reportHours: number | null;
  homeCollection: boolean;
  branchName: string | null;
};

export type NoticeDto = {
  id: string;
  title: string;
  body: string;
  category: string;
  isPinned: boolean;
  publishedAt: string;
  expiresAt: string | null;
};

export type ArticleDto = {
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

export type NetworkStatsDto = {
  specialties: number;
  doctors: number;
  branches: number;
  tests: number;
};

export type SlotDto = {
  start: string;
  end: string;
  label: string;
  available: boolean;
};

export type NotificationDto = {
  id: string;
  kind: 'notice' | 'appointment' | 'report' | 'system';
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  refType: string | null;
  refId: string | null;
};

export type UserDto = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  locale: Locale;
  role: 'PATIENT' | 'STAFF' | 'EDITOR' | 'ADMIN';
  supabaseId: string | null;
  createdAt: string;
};

export type AddressDto = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  area: string | null;
  city: string | null;
  isDefault: boolean;
};

export type AppointmentDto = {
  id: string;
  referenceCode: string;
  patientName: string;
  phone: string;
  email: string | null;
  preferredDate: string;
  timeSlot: string;
  reason: string | null;
  status: RequestStatusDto;
  locale: Locale;
  createdAt: string;
  doctor: { slug: string; name: string; designation: string } | null;
  branch: { slug: string; name: string; city: string } | null;
};

export type SampleCollectionDto = {
  id: string;
  referenceCode: string;
  fullName: string;
  phone: string;
  email: string | null;
  address: string;
  area: string | null;
  city: string | null;
  testsRequested: string[];
  preferredDate: string;
  preferredSlot: string;
  notes: string | null;
  status: RequestStatusDto;
  collectionType: 'HOME' | 'BRANCH';
  locale: Locale;
  createdAt: string;
  branch: { slug: string; name: string } | null;
};

export type ReportDto = {
  id: string;
  title: string;
  testName: string | null;
  reportDate: string;
  isReleased: boolean;
  fileUrl: string | null;
  createdAt: string;
};
