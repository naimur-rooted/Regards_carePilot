import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { cldImage, initialsAvatar } from '@/lib/cloudinary';
import type { ArticleView, BranchView, DoctorView, NoticeView, TestView } from '@/lib/types';

const avatarTints = [
  'bg-mint-deep',
  'bg-coral-soft',
  'bg-[#f3e7a4]',
  'bg-[#ddd6ef]',
  'bg-[#c9e1ee]',
];

export async function SectionHeading({
  eyebrow,
  title,
  lede,
  actionHref,
  actionLabel,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h2 className="text-display-sm font-semibold">{title}</h2>
        {lede ? <p className="mt-3 text-soft">{lede}</p> : null}
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="shrink-0 text-sm font-bold text-teal hover:underline">
          {actionLabel} <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </div>
  );
}

export async function DoctorCard({ doctor, index = 0 }: { doctor: DoctorView; index?: number }) {
  const t = await getTranslations('doctors');
  const photo = cldImage(doctor.photo, { width: 240, height: 240, crop: 'fill' });
  const branches = doctor.availability.map((slot) => slot.branchName).join(' · ');

  return (
    <article className="card flex flex-col justify-between border-line bg-paper p-5 hover:border-teal transition shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={`grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl text-lg font-extrabold ${
            avatarTints[index % avatarTints.length]
          }`}
        >
          {photo ? (
            <Image
              src={photo}
              alt={doctor.name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <span aria-hidden="true">{initialsAvatar(doctor.name)}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.09em] text-teal">
            {doctor.specialtyName}
          </p>
          <h3 className="mt-1 text-base font-extrabold leading-snug text-ink">
            <Link href={`/doctors/${doctor.slug}`} className="hover:text-teal">
              {doctor.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-muted font-medium">{doctor.designation}</p>
          {doctor.qualifications ? (
            <p className="mt-1 text-xs text-soft line-clamp-1">{doctor.qualifications}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-line flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="text-soft">
          <span className="font-bold text-ink">Chambers:</span> {branches || 'Popular Diagnostic Network'}
        </div>
        <Link
          href={`/doctors/${doctor.slug}`}
          className="font-extrabold text-teal hover:underline shrink-0"
        >
          View Profile & Book →
        </Link>
      </div>
    </article>
  );
}

export async function SpecialtyCard({ name, slug, description, doctorCount }: {
  name: string;
  slug: string;
  description: string | null;
  doctorCount: number;
}) {
  const t = await getTranslations('doctors');

  return (
    <Link
      href={`/doctors?specialty=${slug}`}
      className="card flex flex-col gap-2 border-line bg-paper p-5 hover:border-teal"
    >
      <h3 className="text-base font-bold">{name}</h3>
      {description ? <p className="text-sm text-soft">{description}</p> : null}
      <span className="mt-auto pt-3 text-xs font-bold text-teal">
        {t('resultsCount', { count: doctorCount })} <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

export async function TestCard({ test }: { test: TestView }) {
  const t = await getTranslations('services');

  return (
    <article className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.09em] text-teal">
            {t(`categories.${test.category}`)}
          </p>
          <h3 className="mt-1 text-base font-bold">{test.name}</h3>
        </div>
        <div className="shrink-0 text-right">
          {test.discountedPrice ? (
            <>
              <span className="block text-xs text-muted line-through">৳{test.price}</span>
              <span className="block text-lg font-extrabold text-teal">৳{test.discountedPrice}</span>
            </>
          ) : (
            <span className="block text-lg font-extrabold text-ink">
              {test.price ? `৳${test.price}` : t('askForPrice')}
            </span>
          )}
        </div>
      </div>

      {test.summary ? <p className="text-sm text-soft">{test.summary}</p> : null}

      <dl className="mt-auto space-y-2 border-t border-line pt-3 text-xs text-muted">
        <div>
          <dt className="font-bold text-soft">{t('preparation')}</dt>
          <dd>{test.preparation ?? t('noPreparation')}</dd>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {test.reportHours ? <span>{t('reportTime', { hours: test.reportHours })}</span> : null}
          {test.homeCollection ? <span className="font-semibold text-teal">{t('homeCollection')}</span> : null}
          <span>
            {t('availableAt')}: {test.branchName ?? t('allBranches')}
          </span>
        </div>
      </dl>
    </article>
  );
}

export async function ArticleCard({ article }: { article: ArticleView }) {
  const t = await getTranslations('health');
  const cover = cldImage(article.cover, { width: 800, height: 450, crop: 'fill' });

  return (
    <article className="card flex flex-col overflow-hidden p-0">
      <div className="relative h-44 bg-teal-soft">
        {cover ? (
          <Image src={cover} alt={article.title} fill className="object-cover" sizes="(max-width: 800px) 100vw, 33vw" />
        ) : (
          <span className="grid h-full place-items-center text-3xl" aria-hidden="true">
            ✦
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {article.category ? (
          <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.09em] text-teal">
            {t(`categories.${article.category}`)}
          </p>
        ) : null}
        <h3 className="mt-2 text-lg font-bold leading-snug">
          <Link href={`/health/${article.slug}`} className="hover:text-teal">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-soft">{article.excerpt}</p>
        <div className="mt-auto pt-4 text-xs text-muted">
          {article.readingMinutes ? <span>{t('minRead', { minutes: article.readingMinutes })}</span> : null}
          {article.reviewedBy ? <span className="block mt-1">{article.reviewedBy}</span> : null}
        </div>
      </div>
    </article>
  );
}

export async function NoticeFeed({ notices }: { notices: NoticeView[] }) {
  const t = await getTranslations('notices');
  const dateFormat = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (notices.length === 0) {
    return <p className="text-sm text-soft">{t('empty')}</p>;
  }

  return (
    <ul className="space-y-3">
      {notices.map((notice) => (
        <li key={notice.id} className="rounded-card border border-line bg-paper p-4">
          <div className="flex flex-wrap items-center gap-2">
            {notice.isPinned ? <span className="pill">{t('pinned')}</span> : null}
            <time dateTime={notice.publishedAt} className="text-xs text-muted">
              {dateFormat.format(new Date(notice.publishedAt))}
            </time>
          </div>
          <h3 className="mt-2 font-bold">{notice.title}</h3>
          {notice.body ? <p className="mt-1 text-sm text-soft">{notice.body}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export async function BranchCard({ branch }: { branch: BranchView }) {
  const t = await getTranslations('branches');
  const image = cldImage(branch.image, { width: 640, height: 360, crop: 'fill' });

  return (
    <article className="card overflow-hidden p-0">
      <div className="relative h-40 w-full bg-mint">
        {image ? (
          <Image src={image} alt={branch.name} fill className="object-cover" sizes="(max-width: 800px) 100vw, 33vw" />
        ) : (
          <div className="grid h-full place-items-center text-3xl" aria-hidden="true">
            ⌖
          </div>
        )}
        {branch.offersHomeCollection ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[0.62rem] font-bold uppercase text-teal">
            {t('homeCollection')}
          </span>
        ) : null}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold">
          <Link href={`/branches/${branch.slug}`} className="hover:text-teal">
            {branch.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-soft">{branch.address}</p>
        <dl className="mt-4 space-y-1 text-xs text-muted">
          <div className="flex gap-2">
            <dt className="font-bold text-soft">{t('hours')}:</dt>
            <dd>{branch.hours ?? '—'}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-bold text-soft">{t('phone')}:</dt>
            <dd>
              <a href={`tel:${branch.phone.replace(/\s/g, '')}`} className="hover:text-teal">
                {branch.phone}
              </a>
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex gap-3">
          <Link href={`/branches/${branch.slug}`} className="text-sm font-bold text-teal hover:underline">
            {t('viewBranch')} <span aria-hidden="true">→</span>
          </Link>
          {branch.mapUrl ? (
            <a
              href={branch.mapUrl.replace('/maps?q=', '/maps/search/?api=1&query=')}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-soft hover:text-teal"
            >
              {t('openMaps')} <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
