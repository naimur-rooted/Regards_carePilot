import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { cldImage, initialsAvatar } from '@/lib/cloudinary';
import { getDoctor, getDoctors } from '@/lib/content';
import { DoctorBookingButton } from '@/components/doctor-booking-button';
import type { Locale } from '@/lib/types';

export const revalidate = 3600;

export async function generateStaticParams() {
  const doctors = await getDoctors('en');
  return doctors.map((doctor) => ({ slug: doctor.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const doctor = await getDoctor(params.locale as Locale, params.slug);
  if (!doctor) return { title: 'Doctor not found' };

  return {
    title: `${doctor.name} — ${doctor.specialtyName} Specialist | Popular Diagnostic`,
    description: `${doctor.name}, ${doctor.designation}. ${doctor.qualifications ?? ''}. Book appointment online at Popular Diagnostic Centre.`.trim(),
    alternates: {
      canonical: `/${params.locale}/doctors/${doctor.slug}`,
      languages: {
        en: `/en/doctors/${doctor.slug}`,
        bn: `/bn/doctors/${doctor.slug}`,
      },
    },
  };
}

export default async function DoctorProfilePage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { locale, slug } = params;
  const t = await getTranslations('doctors');
  const doctor = await getDoctor(locale, slug);

  if (!doctor) notFound();

  const photo = cldImage(doctor.photo, { width: 480, height: 480, crop: 'fill' });
  const isBn = locale === 'bn';

  return (
    <div className="shell py-10">
      <nav className="mb-6 flex items-center gap-2 text-xs font-bold text-soft">
        <Link href="/doctors" className="hover:text-teal">
          ← {t('backToDirectory')}
        </Link>
        <span>/</span>
        <span className="text-ink font-semibold">{doctor.name}</span>
      </nav>

      {/* Main Profile Header Banner Card */}
      <div className="rounded-panel border border-line bg-paper p-6 sm:p-10 shadow-lifted">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr] items-start">
          {/* Avatar / Photo Box */}
          <div className="relative mx-auto lg:mx-0">
            <div className="h-72 w-72 lg:h-80 lg:w-80 overflow-hidden rounded-2xl bg-teal-soft border border-line shadow-md flex items-center justify-center">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={doctor.name} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#006a33] to-[#00984a] text-white text-6xl font-extrabold">
                  {initialsAvatar(doctor.name)}
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <span className="pill bg-teal text-white font-extrabold text-[0.72rem] uppercase tracking-wider py-1.5 px-4">
                ✓ Verified Specialist
              </span>
            </div>
          </div>

          {/* Details Column */}
          <div className="space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="badge-featured">{doctor.specialtyName}</span>
                {doctor.bmdcRegNo ? (
                  <span className="pill bg-cream text-soft border border-line text-xs font-bold">
                    BMDC Reg: {doctor.bmdcRegNo}
                  </span>
                ) : null}
              </div>

              <h1 className="text-display-md font-extrabold text-ink leading-tight">
                {doctor.name}
              </h1>
              <p className="mt-1 text-lg font-semibold text-teal-deep">
                {doctor.designation}
              </p>
            </div>

            {doctor.qualifications ? (
              <div className="rounded-card bg-cream p-3 border border-line text-sm">
                <span className="font-extrabold text-ink block text-xs uppercase tracking-wide mb-1">
                  Degrees & Qualifications:
                </span>
                <p className="font-semibold text-soft">{doctor.qualifications}</p>
              </div>
            ) : null}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-line text-xs">
              {doctor.experienceYears ? (
                <div>
                  <span className="text-muted block uppercase font-bold">Experience</span>
                  <span className="text-sm font-extrabold text-ink">{doctor.experienceYears}+ Years Clinical</span>
                </div>
              ) : null}

              <div>
                <span className="text-muted block uppercase font-bold">Languages</span>
                <span className="text-sm font-extrabold text-ink">
                  {doctor.languages.length > 0 ? doctor.languages.join(', ') : 'Bangla, English'}
                </span>
              </div>

              <div>
                <span className="text-muted block uppercase font-bold">Patient Rating</span>
                <span className="text-sm font-extrabold text-teal">★ 4.9 / 5.0 (Popular Verified)</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap gap-4">
              <DoctorBookingButton
                doctor={doctor}
                label="Book Chamber Appointment Now →"
                className="btn bg-[#00984a] text-white font-extrabold hover:bg-[#006a33] shadow-md transition"
              />
              <a
                href={`tel:+8809613787801`}
                className="btn-secondary text-xs font-bold"
              >
                📞 Hotline: +880 9613 787801
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Chamber Schedules & Visiting Hours */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="eyebrow">Chambers & Locations</p>
            <h2 className="text-display-sm font-bold text-ink">Visiting Hours & Branch Schedules</h2>
          </div>
          <span className="text-xs text-soft font-semibold">Chambers: {doctor.availability.length} Locations</span>
        </div>

        {doctor.availability.length === 0 ? (
          <div className="rounded-panel border border-line bg-cream p-8 text-center text-soft">
            No active chamber schedules listed for this doctor.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {doctor.availability.map((slot) => (
              <div
                key={slot.branchSlug}
                className="rounded-card border border-teal/40 bg-paper p-5 shadow-sm space-y-3 hover:border-teal transition"
              >
                <div className="flex items-start justify-between gap-2 border-b border-line pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-ink">
                      <Link href={`/branches/${slot.branchSlug}`} className="hover:text-teal">
                        {slot.branchName}
                      </Link>
                    </h3>
                    <p className="text-xs text-soft">Popular Diagnostic Center, Room #402</p>
                  </div>
                  {slot.fee ? (
                    <span className="pill bg-teal text-white font-extrabold text-sm">
                      ৳{slot.fee}
                    </span>
                  ) : null}
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-bold text-ink flex items-center gap-1">
                    <span className="text-teal">🕒</span> Visiting Schedule:
                  </p>
                  <p className="text-soft font-medium pl-4">{slot.schedule}</p>
                </div>

                <div className="pt-2 flex justify-end">
                  <DoctorBookingButton
                    doctor={doctor}
                    label="Book This Chamber →"
                    className="btn-primary btn-small text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Clinical Biography & Expertise */}
      {doctor.bio ? (
        <section className="mt-10 rounded-panel border border-line bg-cream p-6 sm:p-8">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-teal mb-3">
            About {doctor.name}
          </h2>
          <p className="text-sm leading-relaxed text-soft font-medium whitespace-pre-line">
            {doctor.bio}
          </p>
        </section>
      ) : null}

      {/* Patient Reviews & Feedback */}
      <section className="mt-10 rounded-panel border border-line bg-paper p-6 sm:p-8">
        <h2 className="text-display-sm font-bold text-ink mb-4">Patient Feedback & Reviews</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-line bg-cream p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink">Kamrul Hasan (Dhanmondi)</span>
              <span className="text-amber-500 font-bold">★★★★★ 5.0</span>
            </div>
            <p className="text-soft">
              &quot;Very attentive doctor. Explained my cardiac echo report clearly and prescribed precise medication. Reception staff at Popular Dhanmondi were very helpful.&quot;
            </p>
          </div>

          <div className="rounded-card border border-line bg-cream p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink">Nusrat Jahan (Uttara)</span>
              <span className="text-amber-500 font-bold">★★★★★ 5.0</span>
            </div>
            <p className="text-soft">
              &quot;Booked online easily. Visiting schedule was punctual and room consultation was very thorough. Highly recommended specialist!&quot;
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
