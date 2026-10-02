import { getBranch, getDoctors, getTests } from '@/lib/content';
import { cldImage } from '@/lib/cloudinary';
import { ApiError, handle, ok, parseLocale, requireSlug } from '@/lib/api/http';
import type { DoctorDto, TestDto } from '@/lib/api/dto.types';

export const revalidate = 300;

/** A single branch plus the doctors and tests available there. */
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  return handle(async () => {
    const locale = parseLocale(request);
    const slug = requireSlug(params.slug);

    const branch = await getBranch(locale, slug);
    if (!branch) {
      throw new ApiError('NOT_FOUND', `No branch matches "${slug}".`);
    }

    const [doctors, tests] = await Promise.all([
      getDoctors(locale, { branch: slug }),
      getTests(locale),
    ]);

    const doctorDtos: DoctorDto[] = doctors.map((doctor) => ({
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

    const testDtos: TestDto[] = tests
      .filter((test) => test.branchName === null || test.branchName === branch.name)
      .map((test) => ({
        id: test.id,
        slug: test.slug,
        name: test.name,
        category: test.category,
        summary: test.summary,
        preparation: test.preparation,
        price: test.price,
        discountedPrice: test.discountedPrice,
        reportHours: test.reportHours,
        homeCollection: test.homeCollection,
        branchName: test.branchName,
      }));

    return ok(
      {
        branch: {
          ...branch,
          image: cldImage(branch.image, { width: 1200, crop: 'fill' }),
        },
        doctors: doctorDtos,
        tests: testDtos,
      },
      { locale, source: 'database' },
      { cacheable: true },
    );
  });
}
