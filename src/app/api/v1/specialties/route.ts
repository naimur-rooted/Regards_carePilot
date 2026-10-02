import { getSpecialties } from '@/lib/content';
import { handle, ok, parseLocale } from '@/lib/api/http';

export const revalidate = 300;

/** Specialties with doctor counts — drives the directory filter chips. */
export async function GET(request: Request) {
  return handle(async () => {
    const locale = parseLocale(request);
    const specialties = await getSpecialties(locale);

    return ok(specialties, { locale, count: specialties.length }, { cacheable: true });
  });
}
