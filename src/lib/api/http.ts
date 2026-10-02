import { NextResponse } from 'next/server';

/**
 * Shared HTTP plumbing for `/api/v1`.
 *
 * Every handler answers with the same two envelopes so that the Flutter client
 * has exactly one success shape and one error shape to decode:
 *
 *   { "data": …, "meta": { … } }
 *   { "error": { "code": …, "message": …, "details": … } }
 *
 * The contract is documented in the mobile repository at
 * `docs/carepilot-api-contract.md`; keep the two in step.
 */

export type Locale = 'en' | 'bn';

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_FAILED'
  | 'RATE_LIMITED'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL';

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_FAILED: 422,
  RATE_LIMITED: 429,
  SERVICE_UNAVAILABLE: 503,
  INTERNAL: 500,
};

/** Thrown by handlers and translated into an error envelope by `handle()`. */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly details: unknown;

  constructor(code: ApiErrorCode, message: string, details: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

export type ApiMeta = {
  locale?: Locale;
  /** `database` when Postgres answered, `demo` when the bundled dataset was used. */
  source?: 'database' | 'demo';
  count?: number;
  page?: number;
  pageSize?: number;
  total?: number;
  hasMore?: boolean;
  [key: string]: unknown;
};

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
};

export function ok<T>(data: T, meta: ApiMeta = {}, init?: { cacheable?: boolean }) {
  return NextResponse.json(
    { data, meta },
    {
      status: 200,
      headers: init?.cacheable ? CACHE_HEADERS : { 'Cache-Control': 'no-store' },
    },
  );
}

export function created<T>(data: T, meta: ApiMeta = {}) {
  return NextResponse.json({ data, meta }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
}

export function noContent() {
  return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}

export function fail(code: ApiErrorCode, message: string, details: unknown = null) {
  return NextResponse.json(
    { error: { code, message, details } },
    { status: STATUS_BY_CODE[code], headers: { 'Cache-Control': 'no-store' } },
  );
}

/**
 * Wraps a handler so that a thrown `ApiError` becomes the documented envelope
 * and anything unexpected becomes a 500 without leaking a stack trace.
 */
export async function handle(fn: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiError) {
      return fail(error.code, error.message, error.details);
    }

    // Prisma "cannot reach database" and similar infrastructure failures are
    // reported as 503 so the app knows to serve its offline cache rather than
    // treating it as a client error.
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (/connect|ECONNREFUSED|ENOTFOUND|pool|timed out|P1001|P1017/i.test(message)) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[carepilot:api] datastore unavailable:', message);
      }
      return fail('SERVICE_UNAVAILABLE', 'The datastore is temporarily unavailable.');
    }

    if (process.env.NODE_ENV !== 'production') {
      console.error('[carepilot:api] unhandled error:', error);
    }
    return fail('INTERNAL', 'Something went wrong.');
  }
}

/** Resolves the response locale from `?locale=` then `Accept-Language`. */
export function parseLocale(request: Request): Locale {
  const fromQuery = new URL(request.url).searchParams.get('locale');
  if (fromQuery === 'bn' || fromQuery === 'en') return fromQuery;

  const header = request.headers.get('accept-language') ?? '';
  return /\bbn\b/i.test(header) ? 'bn' : 'en';
}

export function parsePagination(request: Request, defaults: { pageSize?: number } = {}) {
  const params = new URL(request.url).searchParams;
  const rawPage = Number(params.get('page') ?? '1');
  const rawSize = Number(params.get('pageSize') ?? String(defaults.pageSize ?? 20));

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const pageSize = Number.isFinite(rawSize) && rawSize > 0 ? Math.min(Math.floor(rawSize), 100) : 20;

  return { page, pageSize, skip: (page - 1) * pageSize };
}

/** Paginates an in-memory collection (used by the demo-data fallback path). */
export function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return {
    slice: items.slice(start, start + pageSize),
    total: items.length,
    hasMore: start + pageSize < items.length,
  };
}

export function requireSlug(value: string | undefined | null, field = 'slug'): string {
  if (!value || !/^[a-z0-9-]+$/i.test(value)) {
    throw new ApiError('BAD_REQUEST', `A valid ${field} is required.`);
  }
  return value;
}

/** Reads and JSON-parses a body, converting malformed input into a 400. */
export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new ApiError('BAD_REQUEST', 'The request body must be valid JSON.');
  }
}
