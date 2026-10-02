import { getDoctors } from '@/lib/content';
import { cldImage } from '@/lib/cloudinary';
import { handle, ok, paginate, parseLocale, parsePagination } from '@/lib/api/http';
import type { DoctorDto } from '@/lib/api/dto.types';

export const revalidate = 300;

/**
 * Doctor directory for the app's search screen.
 *
 * `?search=`, `?specialty=` and `?branch=` are passed straight into
 * `getDoctors()`, so the app and the website return the same people for the
 * same filters. `?language=` and `?featured=` are mobile-only refinements.
 */
export async function GET(request: Request) {
  return handle(async () => {
    const locale = parseLocale(request);
    const params = new URL(request.url).searchParams;
    const { page, pageSize } = parsePagination(request, { pageSize: 20 });

    const search = params.get('search') ?? undefined;
    const specialty = params.get('specialty') ?? undefined;
    const branch = params.get('branch') ?? undefined;
    const language = params.get('language')?.trim().toLowerCase();
    const featuredOnly = params.get('featured') === 'true';

    const doctors = await getDoctors(locale, { search, specialty, branch });

    const data: DoctorDto[] = doctors
      .filter((doctor) => !featuredOnly || doctor.isFeatured)
      .filter(
        (doctor) =>
          !language ||
          doctor.languages.some((entry) => entry.toLowerCase() === language),
      )
      .map((doctor) => ({
        id: doctor.id,
        slug: doctor.slug,
        name: doctor.name,
        designation: doctor.designation,
        specialtySlug: doctor.specialtySlug,
        specialtyName: doctor.specialtyName,
        qualifications: doctor.qualifications,
        bio: doctor.bio,
        photo: cldImage(doctor.photo, { width: 400, height: 400, crop: 'fill' }),
        bmdcRegNo: doctor.bmdcRegNo,
        experienceYears: doctor.experienceYears,
        languages: doctor.languages,
        isFeatured: doctor.isFeatured,
        availability: doctor.availability,
      }));

    const { slice, total, hasMore } = paginate(data, page, pageSize);

    return ok(
      slice,
      { locale, count: slice.length, page, pageSize, total, hasMore, source: 'database' },
      { cacheable: true },
    );
  });
}
