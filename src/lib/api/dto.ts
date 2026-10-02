import type {
  Appointment,
  Branch,
  Doctor,
  Report,
  SampleCollectionRequest,
  SavedAddress,
  User,
} from '@prisma/client';
import { pick } from '@/lib/types';
import type { BranchDto, NotificationDto } from './dto.types';
import type { Locale } from './http';

/**
 * Row → DTO mappers for `/api/v1`.
 *
 * Every mapper is a pure projection of a Prisma row plus `pick()`, which is the
 * same helper the website pages use. That is what guarantees the mobile app and
 * the website render identical content: there is one translation rule and one
 * shaping rule, not two.
 */

type DoctorRef = Pick<Doctor, 'slug' | 'nameEn' | 'nameBn' | 'designationEn' | 'designationBn'>;
type BranchRef = Pick<Branch, 'slug' | 'nameEn' | 'nameBn' | 'cityEn' | 'cityBn'>;

export function userDto(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image,
    locale: user.locale,
    role: user.role,
    supabaseId: user.supabaseId,
    createdAt: user.createdAt.toISOString(),
  };
}

export function addressDto(address: SavedAddress) {
  return {
    id: address.id,
    label: address.label,
    fullName: address.fullName,
    phone: address.phone,
    address: address.address,
    area: address.area,
    city: address.city,
    isDefault: address.isDefault,
  };
}

export function branchDto(
  branch: Branch & { _count?: { doctors?: number; tests?: number } },
  locale: Locale,
  imageUrl: string | null = null,
): BranchDto {
  return {
    id: branch.id,
    slug: branch.slug,
    name: pick({ en: branch.nameEn, bn: branch.nameBn }, locale),
    address: pick({ en: branch.addressEn, bn: branch.addressBn }, locale),
    city: pick({ en: branch.cityEn, bn: branch.cityBn }, locale),
    phone: branch.phone,
    altPhone: branch.altPhone,
    email: branch.email,
    hours:
      branch.hoursEn || branch.hoursBn
        ? pick({ en: branch.hoursEn ?? '', bn: branch.hoursBn ?? '' }, locale)
        : null,
    mapUrl: branch.mapUrl,
    image: imageUrl ?? branch.imagePublicId,
    latitude: branch.latitude,
    longitude: branch.longitude,
    offersHomeCollection: branch.offersHomeCollection,
    doctorCount: branch._count?.doctors ?? 0,
    testCount: branch._count?.tests ?? 0,
  };
}

export function appointmentDto(
  appointment: Appointment & { doctor?: DoctorRef | null; branch?: BranchRef | null },
  locale: Locale,
) {
  return {
    id: appointment.id,
    referenceCode: appointment.referenceCode,
    patientName: appointment.patientName,
    phone: appointment.phone,
    email: appointment.email,
    preferredDate: appointment.preferredDate.toISOString(),
    timeSlot: appointment.timeSlot,
    reason: appointment.reason,
    status: appointment.status,
    locale: appointment.locale,
    createdAt: appointment.createdAt.toISOString(),
    doctor: appointment.doctor
      ? {
          slug: appointment.doctor.slug,
          name: pick({ en: appointment.doctor.nameEn, bn: appointment.doctor.nameBn }, locale),
          designation: pick(
            { en: appointment.doctor.designationEn, bn: appointment.doctor.designationBn },
            locale,
          ),
        }
      : null,
    branch: appointment.branch
      ? {
          slug: appointment.branch.slug,
          name: pick({ en: appointment.branch.nameEn, bn: appointment.branch.nameBn }, locale),
          city: pick({ en: appointment.branch.cityEn, bn: appointment.branch.cityBn }, locale),
        }
      : null,
  };
}

/**
 * The app records home-collection vs in-branch visits as a structured note so
 * that no extra column (and therefore no schema break) is required on the
 * `sample_collection_requests` table the website already owns.
 */
export const COLLECTION_TYPE_PREFIX = 'collection-type:';

export function extractCollectionType(notes: string | null): 'HOME' | 'BRANCH' {
  if (notes && notes.includes(`${COLLECTION_TYPE_PREFIX}BRANCH`)) return 'BRANCH';
  return 'HOME';
}

export function withCollectionType(notes: string | null, type: 'HOME' | 'BRANCH'): string | null {
  const prefix = `${COLLECTION_TYPE_PREFIX}${type}`;
  const stripped = stripCollectionType(notes);
  return stripped ? `${prefix}\n${stripped}` : prefix;
}

export function stripCollectionType(notes: string | null): string | null {
  if (!notes) return null;
  const stripped = notes
    .split('\n')
    .filter((line) => !line.startsWith(COLLECTION_TYPE_PREFIX))
    .join('\n')
    .trim();
  return stripped || null;
}

export function reportDto(report: Report) {
  return {
    id: report.id,
    title: report.title,
    testName: report.testName,
    reportDate: report.reportDate.toISOString(),
    isReleased: report.isReleased,
    // A report that has not cleared clinical review must not leak its file URL,
    // even to its owner.
    fileUrl: report.isReleased ? report.fileUrl : null,
    createdAt: report.createdAt.toISOString(),
  };
}

export function sampleCollectionDto(
  request: SampleCollectionRequest & { branch?: BranchRef | null },
  locale: Locale,
) {
  return {
    id: request.id,
    referenceCode: request.referenceCode,
    fullName: request.fullName,
    phone: request.phone,
    email: request.email,
    address: request.address,
    area: request.area,
    city: request.city,
    testsRequested: request.testsRequested,
    preferredDate: request.preferredDate.toISOString(),
    preferredSlot: request.preferredSlot,
    notes: stripCollectionType(request.notes),
    status: request.status,
    collectionType: extractCollectionType(request.notes),
    locale: request.locale,
    createdAt: request.createdAt.toISOString(),
    branch: request.branch
      ? {
          slug: request.branch.slug,
          name: pick({ en: request.branch.nameEn, bn: request.branch.nameBn }, locale),
        }
      : null,
  };
}

/**
 * The notifications feed is derived rather than stored: current notices, active
 * appointments and released reports. Read state is device-local (the app keeps
 * it in its Hive cache) because it is presentation state, not clinical data.
 */
export function buildNotificationFeed(input: {
  notices: { id: string; title: string; body: string; publishedAt: string }[];
  appointments: {
    id: string;
    referenceCode: string;
    preferredDate: string;
    timeSlot: string;
    patientName: string;
    status: string;
  }[];
  reports: Report[];
  limit: number;
}): NotificationDto[] {
  const items: NotificationDto[] = [];

  for (const notice of input.notices) {
    items.push({
      id: `notice:${notice.id}`,
      kind: 'notice',
      title: notice.title,
      body: notice.body,
      createdAt: notice.publishedAt,
      isRead: false,
      refType: 'notice',
      refId: notice.id,
    });
  }

  for (const appointment of input.appointments) {
    if (appointment.status === 'CANCELLED') continue;
    items.push({
      id: `appointment:${appointment.id}`,
      kind: 'appointment',
      title: `Appointment ${appointment.referenceCode}`,
      body: `${new Date(appointment.preferredDate).toDateString()} · ${appointment.timeSlot}`,
      createdAt: new Date(appointment.preferredDate).toISOString(),
      isRead: false,
      refType: 'appointment',
      refId: appointment.id,
    });
  }

  for (const report of input.reports) {
    if (!report.isReleased) continue;
    items.push({
      id: `report:${report.id}`,
      kind: 'report',
      title: report.title,
      body: report.testName ? `${report.testName} is ready to view.` : 'Your report is ready.',
      createdAt: report.reportDate.toISOString(),
      isRead: false,
      refType: 'report',
      refId: report.id,
    });
  }

  return items
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, input.limit);
}
