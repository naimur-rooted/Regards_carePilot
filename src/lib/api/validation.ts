import { z } from 'zod';
import { ApiError } from './http';

/**
 * Request-body schemas for `/api/v1`.
 *
 * These mirror the Prisma column constraints one-for-one (nullability, max
 * lengths, enums) so a payload that passes here cannot fail at the database
 * layer with an opaque Prisma error.
 */

const localeSchema = z.enum(['en', 'bn']);
const phoneSchema = z
  .string()
  .trim()
  .min(6, 'A contact number is required.')
  .max(32)
  .regex(/^[+0-9()\-\s]+$/, 'Phone numbers may only contain digits, spaces and + ( ) -');

const nonEmpty = (max: number) => z.string().trim().min(1).max(max);

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    phone: phoneSchema.optional(),
    locale: localeSchema.optional(),
    image: z.string().url().max(500).nullish(),
  })
  .strict();

export const addressSchema = z
  .object({
    label: z.string().trim().min(1).max(40).default('Home'),
    fullName: nonEmpty(120),
    phone: phoneSchema,
    address: nonEmpty(1000),
    area: z.string().trim().max(120).nullish(),
    city: z.string().trim().max(120).nullish(),
    isDefault: z.boolean().default(false),
  })
  .strict();

export const addressUpdateSchema = addressSchema.partial();

export const createAppointmentSchema = z
  .object({
    doctorSlug: z.string().trim().max(160).optional(),
    branchSlug: z.string().trim().max(160).optional(),
    patientName: z.string().trim().min(1).max(120).optional(),
    phone: phoneSchema.optional(),
    email: z.string().email().max(200).optional(),
    preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD.'),
    timeSlot: z.string().trim().min(1).max(40),
    reason: z.string().trim().max(2000).nullish(),
    locale: localeSchema.optional(),
  })
  .strict();

export const cancelAppointmentSchema = z
  .object({ reason: z.string().trim().max(500).optional() })
  .strict()
  .default({});

export const createSampleCollectionSchema = z
  .object({
    fullName: z.string().trim().min(1).max(120).optional(),
    phone: phoneSchema.optional(),
    email: z.string().email().max(200).optional(),
    address: nonEmpty(1000),
    area: z.string().trim().max(120).nullish(),
    city: z.string().trim().max(120).nullish(),
    testsRequested: z.array(z.string().trim().min(1).max(160)).min(1, 'Select at least one test.').max(60),
    preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD.'),
    preferredSlot: z.string().trim().min(1).max(40),
    collectionType: z.enum(['HOME', 'BRANCH']).default('HOME'),
    branchSlug: z.string().trim().max(160).optional(),
    notes: z.string().trim().max(2000).nullish(),
    locale: localeSchema.optional(),
  })
  .strict();

export const deviceTokenSchema = z
  .object({
    token: z.string().trim().min(10).max(4096),
    platform: z.enum(['android', 'ios']),
    locale: localeSchema.default('en'),
    appVersion: z.string().trim().max(40).optional(),
  })
  .strict();

export const deleteDeviceTokenSchema = z.object({ token: z.string().trim().min(10).max(4096) }).strict();

/** Parses `payload` or throws a 422 carrying per-field messages. */
export function validate<T extends z.ZodTypeAny>(schema: T, payload: unknown): z.infer<T> {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new ApiError(
      'VALIDATION_FAILED',
      'The submitted details are not valid.',
      result.error.flatten(),
    );
  }

  return result.data;
}
