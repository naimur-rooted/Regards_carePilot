import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { cldImage } from '@/lib/cloudinary';
import { getBranch, getBranches, getDoctors, getTests } from '@/lib/content';
import type { Locale } from '@/lib/types';

export const revalidate = 3600;

export async function generateStaticParams() {
  const branches = await getBranches('en');
  return branches.map((branch) => ({ slug: branch.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const branch = await getBranch(params.locale as Locale, params.slug);
  if (!branch) return { title: 'Branch not found' };

  return {
    title: `${branch.name}, ${branch.city}`,
    description: `${branch.address}. ${branch.hours ?? ''}`.trim(),
    alternates: {
      canonical: `/${params.locale}/branches/${branch.slug}`,
      languages: {
        en: `/en/branches/${branch.slug}`,
        bn: `/bn/branches/${branch.slug}`,
      },
    },
  };
}

export default async function BranchProfilePage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { locale, slug } = params;
  const t = await getTranslations('branches');
  const tDoctors = await getTranslations('doctors');

  const branch = await getBranch(locale, slug);
  if (!branch) notFound();

  const [doctors, tests] = await Promise.all([
    getDoctors(locale, { branch: slug }),
    getTests(locale),
  ]);

  const image = cldImage(branch.image, { width: 1200, height: 500, crop: 'fill' });
  const availableTests = tests.filter(
    (test) => !test.branchName || test.branchName === branch.name,
  );

  return (
    <article className="shell py-14">
      <Link href="/branches" className="text-sm font-semibold text-teal hover:underline">
        <span aria-hidden="true">←</span> {t('backToBranches')}
      </Link>

      <header className="mt-6">
        <p className="eyebrow mb-3">{branch.city}</p>
        <h1 className="text-display-sm font-semibold">{branch.name}</h1>
        {branch.offersHomeCollection ? (
          <span className="pill mt-3">{t('homeCollection')}</span>
        ) : null}
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={branch.name}
              className="mb-6 h-64 w-full rounded-panel object-cover"
            />
          ) : null}

          {branch.mapUrl ? (
            <div className="overflow-hidden rounded-panel border border-line">
              <iframe
                title={`${t('openMaps')}: ${branch.name}`}
                src={branch.mapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[320px] w-full border-0"
              />
            </div>
          ) : null}

          <section className="mt-10">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-teal">
              {t('servicesHere')}
            </h2>
            {availableTests.length === 0 ? (
              <p className="mt-2 text-sm text-soft">{t('noServices')}</p>
            ) : (
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {availableTests.map((test) => (
                  <li key={test.id} className="rounded-card border border-line bg-paper p-4">
                    <p className="font-semibold">{test.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {test.price ? `৳${test.discountedPrice ?? test.price}` : ''}
                      {test.reportHours ? ` · ${test.reportHours}h` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-teal">
              {t('doctorsHere')}
            </h2>
            {doctors.length === 0 ? (
              <p className="mt-2 text-sm text-soft">{t('noDoctors')}</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {doctors.map((doctor) => (
                  <li key={doctor.id} className="rounded-card border border-line bg-paper p-4">
                    <p className="font-bold">
                      <Link href={`/doctors/${doctor.slug}`} className="hover:text-teal">
                        {doctor.name}
                      </Link>
                    </p>
                    <p className="text-sm text-soft">{doctor.designation}</p>
                    {doctor.availability[0]?.schedule ? (
                      <p className="mt-1 text-xs text-muted">
                        {tDoctors('schedule')}: {doctor.availability[0].schedule}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-panel border border-line bg-cream p-5">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="field-label">{t('address')}</dt>
                <dd className="text-soft">{branch.address}</dd>
              </div>
              <div>
                <dt className="field-label">{t('hours')}</dt>
                <dd className="text-soft">{branch.hours ?? '—'}</dd>
              </div>
              <div>
                <dt className="field-label">{t('phone')}</dt>
                <dd>
                  <a
                    href={`tel:${branch.phone.replace(/\s/g, '')}`}
                    className="font-semibold text-teal"
                  >
                    {branch.phone}
                  </a>
                  {branch.altPhone ? <span className="block text-muted">{branch.altPhone}</span> : null}
                </dd>
              </div>
              {branch.email ? (
                <div>
                  <dt className="field-label">{t('email')}</dt>
                  <dd>
                    <a href={`mailto:${branch.email}`} className="text-teal">
                      {branch.email}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary mt-5 w-full"
            >
              {t('openMaps')}
            </a>
            <Link href="/sample-collection" className="btn-primary mt-2 w-full">
              {t('homeCollection')}
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
