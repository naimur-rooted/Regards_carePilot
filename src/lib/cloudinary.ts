/**
 * Cloudinary helpers.
 *
 * Media is stored in Cloudinary and referenced everywhere by public ID (never
 * by full URL) so that transformations, caching and future migration stay under
 * our control. `cldImage` produces a URL that Next.js Image can optimise.
 */
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export const cloudinaryConfigured = Boolean(cloudName);

export type CldTransform = {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'thumb';
  quality?: 'auto' | number;
};

export function cldImage(publicId: string | null | undefined, transform: CldTransform = {}): string | null {
  if (!publicId) return null;
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) return publicId;
  if (!cloudinaryConfigured) return null;

  const parts = ['f_auto', `q_${transform.quality ?? 'auto'}`];
  if (transform.width) parts.push(`w_${transform.width}`);
  if (transform.height) parts.push(`h_${transform.height}`);
  if (transform.crop) parts.push(`c_${transform.crop}`);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${parts.join(',')}/${publicId}`;
}

/** Placeholder used when an editor has not uploaded a photo yet. */
export function initialsAvatar(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
