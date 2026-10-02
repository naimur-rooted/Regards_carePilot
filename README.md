# CarePilot

A bilingual (English / বাংলা) diagnostic and clinical centre platform: doctor
directory, branch locator, home sample collection requests, diagnostic test
catalogue, health content and a gated patient portal.

The information architecture follows the reference analysis in
[`docs/popular-diagnostic-website-analysis.md`](docs/popular-diagnostic-website-analysis.md):
find care, understand services, get in touch, learn about the organisation,
review service conditions — with a private patient area excluded from crawling.

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Next.js API routes (Express-compatible handlers) |
| Database | PostgreSQL (Supabase) via Prisma |
| Auth | NextAuth.js with Supabase Auth as the identity provider |
| CMS | Sanity.io (doctors, branches, specialties, tests, articles, notices) |
| Media | Cloudinary (doctor photos, branch images, gallery) |
| i18n | next-intl, `en` + `bn`, `/en/...` and `/bn/...` routes |
| Hosting | Vercel (Next.js App Router), Supabase Postgres (Database). See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) |

## Requirements

- Node.js 18.17 or newer (developed on Node 24)
- npm 9+
- A PostgreSQL database (Supabase recommended)
- Optional: Sanity project, Cloudinary account, Supabase Auth keys

## Quick start

```bash
npm install                 # also runs prisma generate
cp .env.example .env        # then fill in your credentials
npx prisma migrate dev      # create the schema
npm run db:seed             # load the demonstration dataset
npm run dev                 # http://localhost:3000 redirects to /en
```

The site runs **without** a database, Sanity project or Cloudinary account.
Every content read goes through `src/lib/content.ts`, which falls back to the
bundled demonstration dataset in `src/lib/demo-data.ts` and logs a warning in
development. Configure the real services when you are ready — no code changes
are required.

## Environment variables

All secrets live in `.env` (gitignored). `.env.example` documents every key.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Pooled Supabase Postgres connection used at runtime |
| `DIRECT_URL` | Direct connection used by `prisma migrate` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (browser auth) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key; never expose to the client |
| `NEXTAUTH_SECRET` | Session signing secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Canonical app URL for auth callbacks |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project id |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (default `production`) |
| `SANITY_API_READ_TOKEN` | Token for draft/preview reads |
| `SANITY_API_WRITE_TOKEN` | Token used only by content sync tooling |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Server-side signing and uploads |
| `SMTP_*`, `SMS_PROVIDER_API_KEY` | Notification placeholders (not yet wired) |
| `NEXT_PUBLIC_SITE_URL` | Used for canonical URLs, sitemap and OG tags |

## Project structure

```
src/
  app/
    [locale]/            # all public routes, locale-prefixed
      layout.tsx         # root layout: html/body, fonts, header, footer
      page.tsx           # homepage
      doctors/           # directory + [slug] profile (ISR, 1h)
      branches/          # locator + [slug] profile (ISR, 1h)
    robots.ts            # disallows /portal and /admin in every locale
    sitemap.ts           # hreflang alternates for both locales
    globals.css          # Tailwind layers + CarePilot design tokens
  components/            # header, footer, cards, filters, branch map
  i18n/                  # routing, navigation helpers, request config
  lib/
    content.ts           # single read path for clinical content
    demo-data.ts         # demonstration dataset (also used by the seed)
    prisma.ts            # PrismaClient + safeQuery fallback
    sanity.ts            # Sanity client + query fallback
    cloudinary.ts        # media URL builders
    notifications.ts     # email/SMS placeholders + reference codes
    site.ts              # navigation, hotlines, private routes
  sanity/schema/         # CMS content models
prisma/
  schema.prisma          # full data model
  seed.ts                # idempotent demonstration seed
messages/
  en.json, bn.json       # every UI string, both languages
```

## Bilingual routing

- Every page exists at `/en/...` and `/bn/...`; `localePrefix: 'always'` keeps
  URLs explicit and hreflang unambiguous.
- The language switcher rewrites only the locale segment, so doctor and branch
  slugs and query strings survive the switch.
- `messages/en.json` and `messages/bn.json` must stay key-for-key identical.
- Bengali uses a Bangla-capable font stack (`Noto Sans Bengali`) selected by
  `html[lang='bn']` in `globals.css`.

## Content management

Editors work in the Sanity Studio; the public site reads from Postgres, which is
kept in step with Sanity by the sync tooling.

```bash
npm run sanity:dev      # local studio at http://localhost:3333/studio
npm run sanity:deploy   # hosted studio
```

Content models in `src/sanity/schema/`:

| Type | Bilingual fields | Notes |
| --- | --- | --- |
| `specialty` | name, description | Sorted by display order |
| `branch` | name, address, city, hours | Map embed, coordinates, home-collection flag |
| `doctor` | name, designation, qualifications, bio | Specialty reference, branch schedule array, BMDC number, featured flag |
| `diagnosticTest` | name, summary, preparation | Category, price, report turnaround, home collection |
| `article` | title, excerpt, body | Author, medical reviewer, publish and review dates |
| `notice` | title, body | Pin flag, publish and expiry dates |

Localized text uses the shared `localeString` / `localeText` object types, so an
editor cannot save one language and silently forget the other.

## Data flow and fallbacks

1. Pages call helper functions in `src/lib/content.ts` — never Prisma directly.
2. Each helper queries Postgres through `safeQuery`, which catches failures and
   returns the bundled demonstration dataset instead.
3. Sanity reads go through `sanityFetch`, which behaves the same way.
4. The result: a clone of this repository renders every page immediately, and
   starts showing real data as soon as credentials are configured.

The fallback is logged in development (`[carepilot] Database query ... serving
demo data`) so it is never mistaken for live content.

## Seeding

```bash
npm run db:seed
```

The seed is idempotent (`upsert` on slug) and creates specialties, branches,
doctors with branch schedules, diagnostic tests, health articles, notices and an
administrator account. It uses the same data as the runtime fallback so both
paths agree.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | `prisma generate` + production build |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm run type-check` | `tsc --noEmit` |
| `npm run db:seed` | Seed the database |
| `npm run prisma:migrate` | Create/apply a dev migration |
| `npm run prisma:deploy` | Apply migrations in production |
| `npm run prisma:studio` | Browse the database |
| `npm run sanity:dev` | Local CMS studio |

## SEO and privacy

- `sitemap.xml` is generated with hreflang alternates for both locales.
- `robots.txt` disallows `/portal`, `/admin` and `/api/` for **every** locale,
  and `next.config.mjs` sends `X-Robots-Tag: noindex, nofollow` on those paths.
- Doctor and branch pages are statically generated with
  `revalidate = 3600`, so CMS updates appear without a redeploy.
- Every page sets canonical URLs and Open Graph locale metadata.

## Accessibility

Semantic landmarks, a skip link, visible focus rings, labelled form controls,
`aria-current` on active navigation, an `aria-live` result count in the doctor
directory, and `prefers-reduced-motion` support in `globals.css`.

## Deployment

1. **Supabase** — create the project, copy the pooled and direct connection
   strings into `DATABASE_URL` and `DIRECT_URL`.
2. **Vercel** — import the repository, set all environment variables, deploy.
3. **Migrations** — run automatically by the CI `migrate` job on `main`.
4. **Cloudinary** — set the cloud name plus API key/secret; upload an image and
   reference it by public ID in Sanity.
5. **Railway** — only needed if the API is later split into a separate service.

### Required GitHub secrets

`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `DATABASE_URL`,
`DIRECT_URL`, `NEXTAUTH_SECRET`.

## API

A REST layer for the companion app lives under `/api/v1`. Public endpoints serve
the same content the website renders (they reuse `src/lib/content.ts`), and
patient endpoints require a Supabase bearer token.

| Group | Endpoints |
| --- | --- |
| Catalogue (public) | `doctors`, `doctors/[slug]`, `specialties`, `branches`, `branches/[slug]`, `tests`, `articles`, `health`, `notices`, `availability`, `network-stats` |
| Patient (bearer token) | `me`, `me/addresses`, `me/addresses/[id]`, `appointments`, `sample-collection`, `sample-collection/[id]` |
| Device | `device-tokens` (register/unregister push) |

Request bodies are validated with Zod schemas in `src/lib/api/validation.ts` that
mirror the Prisma column constraints, and every response is shaped by the
projection helpers in `src/lib/api/dto.ts`.

## Demonstration data notice

Addresses, phone numbers, BMDC registration numbers, prices, clinician names and
clinical wording in `src/lib/demo-data.ts` are illustrative placeholders.
Confirm appointment processes, test catalogue and fees, home collection
eligibility, report delivery, branch hours, clinician credentials, accreditations
and legal policies before treating any of this as a functional specification.

## Status

Implemented: project scaffold, Prisma schema (including saved addresses and
device tokens for the companion app), Sanity schemas, bilingual routing,
homepage, doctor directory with URL-driven filters, doctor profiles, branch
locator with map, branch profiles, SEO routes, CI/CD, seed data, and the
`/api/v1` REST layer.

Next: sample collection request form UI, services catalogue page, health article
pages, notices feed with date filtering, about/leadership/contact and legal
pages, NextAuth patient portal screens, and the role-gated admin dashboard.
