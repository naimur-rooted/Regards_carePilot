import { getBranches } from '@/lib/content';
import { cldImage } from '@/lib/cloudinary';
import { handle, ok, paginate, parseLocale, parsePagination } from '@/lib/api/http';
import type { BranchDto } from '@/lib/api/dto.types';

export const revalidate = 300;

/**
 * Branch locator feed for the mobile map and list views.
 *
 * Filtering happens here rather than in `content.ts` because the website pages
 * fetch the whole (small) branch list anyway; `?city=`, `?homeCollection=` and
 * `?search=` are mobile conveniences layered on the same read path.
 */
export async function GET(request: Request) {
  return handle(async () => {
    const locale = parseLocale(request);
    const params = new URL(request.url).searchParams;
    const { page, pageSize } = parsePagination(request, { pageSize: 50 });

    const city = params.get('city')?.trim().toLowerCase();
    const search = params.get('search')?.trim().toLowerCase();
    const homeCollectionOnly = params.get('homeCollection') === 'true';

    const branches = await getBranches(locale);

    const data: BranchDto[] = branches
      .filter((branch) => (!city || branch.city.toLowerCase() === city))
      .filter((branch) => (!homeCollectionOnly || branch.offersHomeCollection))
      .filter(
        (branch) =>
          !search ||
          branch.name.toLowerCase().includes(search) ||
          branch.address.toLowerCase().includes(search) ||
          branch.city.toLowerCase().includes(search),
      )
      .map((branch) => ({
        id: branch.id,
        slug: branch.slug,
        name: branch.name,
        address: branch.address,
        city: branch.city,
        phone: branch.phone,
        altPhone: branch.altPhone,
        email: branch.email,
        hours: branch.hours,
        mapUrl: branch.mapUrl,
        // `image` holds a Cloudinary public ID; the app needs a servable URL.
        image: cldImage(branch.image, { width: 800, crop: 'fill' }),
        latitude: branch.latitude,
        longitude: branch.longitude,
        offersHomeCollection: branch.offersHomeCollection,
        doctorCount: branch.doctorCount,
        testCount: branch.testCount,
      }));

    const { slice, total, hasMore } = paginate(data, page, pageSize);

    return ok(
      slice,
      { locale, count: slice.length, page, pageSize, total, hasMore, source: 'database' },
      { cacheable: true },
    );
  });
}
