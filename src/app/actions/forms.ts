'use server';

import { prisma } from '@/lib/prisma';
import { referenceCode } from '@/lib/notifications';

/**
 * Website form submissions.
 *
 * These are plain server actions rather than API calls: the forms are public,
 * unauthenticated and only need to write one row each. Writes are best-effort —
 * if the database is not configured (as in the demonstration build) the action
 * still returns a reference so the UI can confirm the request was received.
 */

export type FormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  reference?: string;
  fieldErrors?: Record<string, string>;
};

export const idleState: FormState = { status: 'idle' };

const clean = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');

export async function submitContactForm(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const fullName = clean(formData.get('fullName'));
  const email = clean(formData.get('email'));
  const phone = clean(formData.get('phone'));
  const department = clean(formData.get('department')) || null;
  const subject = clean(formData.get('subject')) || null;
  const message = clean(formData.get('message'));
  const locale = clean(formData.get('locale')) === 'bn' ? 'bn' : 'en';

  const fieldErrors: Record<string, string> = {};
  if (!fullName) fieldErrors.fullName = 'Required';
  if (!email) fieldErrors.email = 'Required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = 'Invalid email';
  if (!message) fieldErrors.message = 'Required';

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Please correct the highlighted fields.', fieldErrors };
  }

  try {
    await prisma.contactSubmission.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        department,
        subject,
        message,
        locale,
      },
    });
  } catch (error) {
    console.warn('[carepilot] contact submission not persisted:', (error as Error).message);
    return {
      status: 'error',
      message: 'We could not send your message right now. Please call the hotline instead.',
    };
  }

  return { status: 'success' };
}

export async function submitSampleCollection(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const fullName = clean(formData.get('fullName'));
  const phone = clean(formData.get('phone'));
  const email = clean(formData.get('email'));
  const address = clean(formData.get('address'));
  const area = clean(formData.get('area')) || null;
  const city = clean(formData.get('city')) || null;
  const tests = formData.getAll('tests').map((value) => String(value).trim()).filter(Boolean);
  const preferredDate = clean(formData.get('preferredDate'));
  const preferredSlot = clean(formData.get('preferredSlot'));
  const notes = clean(formData.get('notes')) || null;
  const locale = clean(formData.get('locale')) === 'bn' ? 'bn' : 'en';

  const fieldErrors: Record<string, string> = {};
  if (!fullName) fieldErrors.fullName = 'Required';
  if (!phone) fieldErrors.phone = 'Required';
  if (!address) fieldErrors.address = 'Required';
  if (tests.length === 0) fieldErrors.tests = 'Select at least one test';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) fieldErrors.preferredDate = 'Required';
  if (!preferredSlot) fieldErrors.preferredSlot = 'Required';

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Please correct the highlighted fields.', fieldErrors };
  }

  const reference = referenceCode('SC');

  try {
    await prisma.sampleCollectionRequest.create({
      data: {
        referenceCode: reference,
        fullName,
        phone,
        email: email || null,
        address,
        area,
        city,
        testsRequested: tests,
        preferredDate: new Date(`${preferredDate}T00:00:00.000Z`),
        preferredSlot,
        notes,
        locale,
      },
    });
  } catch (error) {
    console.warn('[carepilot] sample collection request not persisted:', (error as Error).message);
    return {
      status: 'error',
      message: 'We could not record your request right now. Please call the hotline instead.',
    };
  }

  return { status: 'success', reference };
}
