import { getTests } from '@/lib/content';
import { ApiError, handle, ok, paginate, parseLocale, parsePagination } from '@/lib/api/http';
import type { TestCategoryDto, TestDto } from '@/lib/api/dto.types';

export const revalidate = 300;

const CATEGORIES: TestCategoryDto[] = [
  'PATHOLOGY',
  'RADIOLOGY',
  'CARDIOLOGY',
  'IMAGING',
  'PACKAGE',
  'OTHER',
];

/** Diagnostic tests and packages for the services catalogue and test picker. */
export async function GET(request: Request) {
  return handle(async () => {
    const locale = parseLocale(request);
    const params = new URL(request.url).searchParams;
    const { page, pageSize } = parsePagination(request, { pageSize: 50 });

    const categoryParam = params.get('category')?.toUpperCase();
    if (categoryParam && !CATEGORIES.includes(categoryParam as TestCategoryDto)) {
      throw new ApiError('BAD_REQUEST', `Unknown test category "${categoryParam}".`, {
        allowed: CATEGORIES,
      });
    }

    const search = params.get('search')?.trim().toLowerCase();
    const homeCollectionOnly = params.get('homeCollection') === 'true';

    const tests = await getTests(locale, categoryParam as TestCategoryDto | undefined);

    const data: TestDto[] = tests
      .filter((test) => (!homeCollectionOnly || test.homeCollection))
      .filter(
        (test) =>
          !search ||
          test.name.toLowerCase().includes(search) ||
          (test.summary ?? '').toLowerCase().includes(search),
      )
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

    const { slice, total, hasMore } = paginate(data, page, pageSize);

    return ok(
      slice,
      { locale, count: slice.length, page, pageSize, total, hasMore, source: 'database' },
      { cacheable: true },
    );
  });
}
