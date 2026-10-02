import { getDoctor } from '@/lib/content';
import { cldImage } from '@/lib/cloudinary';
import { ApiError, handle, ok, parseLocale, requireSlug } from '@/lib/api/http';
import type { DoctorDto } from '@/lib/api/dto.types';

export const revalidate = 300;

/** Full doctor profile: credentials, bio and every branch schedule. */
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  return handle(async () => {
    const locale = parseLocale(request);
    const slug = requireSlug(params.slug);

    const doctor = await getDoctor(locale, slug);
    if (!doctor) {
      throw new ApiError('NOT_FOUND', `No doctor matches "${slug}".`);
    }

    const data: DoctorDto = {
      id: doctor.id,
      slug: doctor.slug,
      name: doctor.name,
      designation: doctor.designation,
      specialtySlug: doctor.specialtySlug,
      specialtyName: doctor.specialtyName,
      qualifications: doctor.qualifications,
      bio: doctor.bio,
      photo: cldImage(doctor.photo, { width: 800, height: 800, crop: 'fill' }),
      bmdcRegNo: doctor.bmdcRegNo,
      experienceYears: doctor.experienceYears,
      languages: doctor.languages,
      isFeatured: doctor.isFeatured,
      availability: doctor.availability,
    };

    return ok(data, { locale, source: 'database' }, { cacheable: true });
  });
}
