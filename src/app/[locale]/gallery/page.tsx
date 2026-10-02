import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { cldImage } from '@/lib/cloudinary';
import { getBranches } from '@/lib/content';
import type { Locale } from '@/lib/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'gallery' });

  return {
    title: t('title'),
    description: t('lede'),
    alternates: {
      canonical: `/${params.locale}/gallery`,
      languages: { en: '/en/gallery', bn: '/bn/gallery', 'x-default': '/en/gallery' },
    },
  };
}

export default async function GalleryPage({ params }: { params: { locale: Locale } }) {
  const t = await getTranslations('gallery');
  const branches = await getBranches(params.locale);

  const images = branches
    .map((branch) => ({ branch, image: cldImage(branch.image, { width: 800, height: 600, crop: 'fill' }) }))
    .filter((item): item is { branch: (typeof branches)[number]; image: string } => Boolean(item.image));

  return (
    <div className="shell py-14">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow mb-4">{t('title')}</p>
        <h1 className="text-display-sm font-semibold">{t('title')}</h1>
        <p className="mt-3 text-soft">{t('lede')}</p>
      </header>

      {images.length === 0 ? (
        <p className="rounded-panel border border-line bg-cream p-8 text-center text-sm text-soft">
          {t('empty')}
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map(({ branch, image }) => (
            <li key={branch.id} className="card overflow-hidden p-0">
              <div className="relative h-52 w-full bg-mint">
                <Image
                  src={image}
                  alt={branch.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <p className="p-4 text-sm font-bold">{branch.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
