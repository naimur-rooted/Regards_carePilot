'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';

const SLIDES = [
  {
    id: 1,
    titleEn: 'Popular Diagnostic Centre Ltd.',
    subtitleEn: 'Leading Diagnostic & Clinical Consultation Network in Bangladesh',
    titleBn: 'পপুলার ডায়াগনস্টিক সেন্টার লিঃ',
    subtitleBn: 'বাংলাদেশের শীর্ষস্থানীয় ডায়াগনস্টিক ও বিশেষজ্ঞ চিকিৎসা পরামর্শ কেন্দ্র',
    bgGradient: 'from-[#004d25]/90 via-[#006a33]/65 to-transparent',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80',
    badgeEn: 'Founded 1983 · 40+ Years of Excellence',
    badgeBn: 'প্রতিষ্ঠিত ১৯৮৩ · ৪০+ বছরের সুনাম',
    ctaPrimaryEn: 'Find a Specialist Doctor',
    ctaSecondaryEn: 'Book Diagnostic Test',
    ctaPrimaryBn: 'বিশেষজ্ঞ ডাক্তার খুঁজুন',
    ctaSecondaryBn: 'ডায়াগনস্টিক টেস্ট বুক করুন',
    linkPrimary: '/doctors',
    linkSecondary: '/services',
  },
  {
    id: 2,
    titleEn: '3.0 Tesla Silent MRI & 128-Slice CT Scan',
    subtitleEn: 'State-of-the-Art Imaging & Pathology Lab Technology',
    titleBn: '৩.০ টেসলা সাইলেন্ট এমআরআই এবং ১২৮-স্লাইস সিটি স্ক্যান',
    subtitleBn: 'সর্বাধুনিক ইমেজিং ও প্যাথলজি ল্যাব প্রযুক্তি',
    bgGradient: 'from-[#0f172a]/95 via-[#0f172a]/70 to-transparent',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80',
    badgeEn: 'ISO 9001:2015 Accredited Laboratory',
    badgeBn: 'আইএসও ৯০০১:২০১৫ সার্টিফাইড ল্যাবরেটরি',
    ctaPrimaryEn: 'View Diagnostics & Tech',
    ctaSecondaryEn: 'Home Sample Collection',
    ctaPrimaryBn: 'প্রযুক্তি ও সেবাসমূহ দেখুন',
    ctaSecondaryBn: 'বাসায় নমুনা সংগ্রহ',
    linkPrimary: '/services',
    linkSecondary: '/sample-collection',
  },
  {
    id: 3,
    titleEn: 'Executive Health Checkup Packages',
    subtitleEn: 'Comprehensive Health Screening for You and Your Family',
    titleBn: 'এক্সিকিউটিভ হেলথ চেকআপ প্যাকেজ',
    subtitleBn: 'আপনার ও আপনার পরিবারের জন্য সার্বিক স্বাস্থ্য পরীক্ষা',
    bgGradient: 'from-[#0284c7]/90 via-[#004d25]/70 to-transparent',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1600&q=80',
    badgeEn: 'Special Discount Packages Available',
    badgeBn: 'বিশেষ ছাড়ের প্যাকেজসমূহ সুবিধাজনক মূল্যে',
    ctaPrimaryEn: 'Explore Packages',
    ctaSecondaryEn: 'Online Patient Report',
    ctaPrimaryBn: 'প্যাকেজসমূহ দেখুন',
    ctaSecondaryBn: 'অনলাইন রিপোর্ট দেখুন',
    linkPrimary: '/services?category=PACKAGE',
    linkSecondary: '/portal',
  },
];

export function PopularHeroSlider({ locale }: { locale: string }) {
  const [current, setCurrent] = useState(0);
  const isBn = locale === 'bn';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="relative overflow-hidden rounded-panel border border-line shadow-2xl transition-all duration-700">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.image}
          alt={isBn ? slide.titleBn : slide.titleEn}
          className="h-full w-full object-cover transition-all duration-1000 transform scale-105 brightness-110 contrast-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`} />
      </div>

      <div className="relative z-10 min-h-[380px] sm:min-h-[440px] p-8 sm:p-12 text-white flex flex-col justify-between transition-all duration-700">
        {/* Decorative Background Accents */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 h-64 w-64 rounded-full bg-sun/10 blur-2xl pointer-events-none" />

        {/* Top Badge */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm border border-white/20">
            <span className="h-2 w-2 rounded-full bg-sun animate-pulse" />
            {isBn ? slide.badgeBn : slide.badgeEn}
          </span>
        </div>

        {/* Main Content */}
        <div className="my-6 max-w-2xl">
          <h1 className="text-display-md sm:text-display-lg font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
            {isBn ? slide.titleBn : slide.titleEn}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed font-medium">
            {isBn ? slide.subtitleBn : slide.subtitleEn}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={slide.linkPrimary}
              className="btn bg-sun text-ink font-extrabold hover:bg-white transition-all transform hover:-translate-y-0.5 shadow-lg"
            >
              {isBn ? slide.ctaPrimaryBn : slide.ctaPrimaryEn} →
            </Link>
            <Link
              href={slide.linkSecondary}
              className="btn bg-white/15 backdrop-blur-md text-white border border-white/30 font-bold hover:bg-white hover:text-ink transition-all"
            >
              {isBn ? slide.ctaSecondaryBn : slide.ctaSecondaryEn}
            </Link>
          </div>
        </div>

        {/* Bottom Carousel Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/15">
          <div className="flex gap-2">
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrent(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === current ? 'w-8 bg-sun' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/30 backdrop-blur-sm transition"
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/30 backdrop-blur-sm transition"
              aria-label="Next slide"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
