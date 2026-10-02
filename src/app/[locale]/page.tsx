import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  ArticleCard,
  BranchCard,
  DoctorCard,
  NoticeFeed,
  SectionHeading,
  SpecialtyCard,
  TestCard,
} from '@/components/cards';
import { QuickReportWidget } from '@/components/quick-report-widget';
import { HomeSearchWidget } from '@/components/home-search-widget';
import { PopularHeroSlider } from '@/components/popular-hero-slider';
import { TechShowcase } from '@/components/tech-showcase';
import {
  getArticles,
  getBranches,
  getFeaturedDoctors,
  getNetworkStats,
  getNotices,
  getSpecialties,
  getTests,
} from '@/lib/content';
import type { Locale } from '@/lib/types';

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const t = await getTranslations('home');

  const [featuredDoctors, specialties, branches, notices, tests, articles, stats] =
    await Promise.all([
      getFeaturedDoctors(locale, 4),
      getSpecialties(locale),
      getBranches(locale),
      getNotices(locale),
      getTests(locale),
      getArticles(locale),
      getNetworkStats(),
    ]);

  return (
    <>
      {/* Hero Carousel & Search */}
      <section className="relative overflow-hidden pt-8 pb-12">
        <div className="shell space-y-8">
          <PopularHeroSlider locale={locale} />

          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <HomeSearchWidget
              specialties={specialties.map((s) => ({ slug: s.slug, name: s.name }))}
              branches={branches.map((b) => ({ slug: b.slug, name: b.name, city: b.city }))}
            />

            <QuickReportWidget />
          </div>

          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-panel bg-cream p-6 border border-line">
            {[
              { key: 'specialties', value: stats.specialties },
              { key: 'doctors', value: stats.doctors },
              { key: 'branches', value: stats.branches },
              { key: 'tests', value: stats.tests },
            ].map((item) => (
              <div key={item.key} className="text-center">
                <dd className="text-3xl font-extrabold text-teal">{item.value}</dd>
                <dt className="mt-1 text-xs font-bold uppercase tracking-wider text-muted">
                  {t(`stats.${item.key}`)}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Technology & Medical Equipment Showcase */}
      <section className="py-10">
        <div className="shell">
          <TechShowcase locale={locale} />
        </div>
      </section>

      {/* Quick links */}
      <section className="border-y border-line bg-cream py-14">
        <div className="shell">
          <SectionHeading eyebrow={t('quick.eyebrow')} title={t('quick.title')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { key: 'doctor', href: '/doctors' },
              { key: 'branch', href: '/branches' },
              { key: 'sample', href: '/sample-collection' },
              { key: 'article', href: '/health' },
            ].map((item) => (
              <Link key={item.key} href={item.href} className="card flex flex-col gap-2 hover:border-teal">
                <h3 className="text-base font-bold">{t(`quick.${item.key}.title`)}</h3>
                <p className="text-sm text-soft">{t(`quick.${item.key}.body`)}</p>
                <span className="mt-auto pt-3 text-sm font-bold text-teal" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured doctors */}
      <section className="py-16">
        <div className="shell">
          <SectionHeading
            eyebrow={t('featured.eyebrow')}
            title={t('featured.title')}
            lede={t('featured.lede')}
            actionHref="/doctors"
            actionLabel={t('quick.doctor.title')}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredDoctors.map((doctor, index) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="border-y border-line bg-cream py-16">
        <div className="shell">
          <SectionHeading
            title={t('specialties.title')}
            lede={t('specialties.lede')}
            actionHref="/doctors"
            actionLabel={t('quick.doctor.title')}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specialties.map((specialty) => (
              <SpecialtyCard
                key={specialty.id}
                name={specialty.name}
                slug={specialty.slug}
                description={specialty.description}
                doctorCount={specialty.doctorCount}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Branches + notices */}
      <section className="py-16">
        <div className="shell grid gap-12 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <SectionHeading
              eyebrow={t('branches.eyebrow')}
              title={t('branches.title')}
              lede={t('branches.lede')}
              actionHref="/branches"
              actionLabel={t('branches.title')}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {branches.slice(0, 2).map((branch) => (
                <BranchCard key={branch.id} branch={branch} />
              ))}
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow={t('notices.eyebrow')}
              title={t('notices.title')}
              actionHref="/notices"
              actionLabel={t('notices.title')}
            />
            <NoticeFeed notices={notices.slice(0, 3)} />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-line bg-cream py-16">
        <div className="shell">
          <SectionHeading
            eyebrow={t('services.eyebrow')}
            title={t('services.title')}
            lede={t('services.lede')}
            actionHref="/services"
            actionLabel={t('services.title')}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tests.slice(0, 3).map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>
      </section>

      {/* Health content */}
      <section className="py-16">
        <div className="shell">
          <SectionHeading
            eyebrow={t('health.eyebrow')}
            title={t('health.title')}
            lede={t('health.lede')}
            actionHref="/health"
            actionLabel={t('health.title')}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="pb-4">
        <div className="shell">
          <div className="rounded-panel bg-ink px-8 py-12 text-white sm:px-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2 className="text-display-sm font-semibold">{t('cta.title')}</h2>
                <p className="mt-3 text-white/75">{t('cta.body')}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn bg-sun text-ink hover:bg-white">
                  {t('cta.button')}
                </Link>
                <Link href="/hotlines" className="btn border border-white/30 text-white hover:bg-white/10">
                  {t('quick.branch.title')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
