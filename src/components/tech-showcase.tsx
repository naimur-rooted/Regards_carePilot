'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const TECH_ITEMS = [
  {
    id: 'mri',
    nameEn: '3.0 Tesla Silent MRI Scan',
    nameBn: '৩.০ টেসলা সাইলেন্ট এমআরআই স্ক্যান',
    tagEn: 'Neuro & Whole-Body Imaging',
    tagBn: 'নিউরো ও হোল-বডি ইমেজিং',
    descEn: 'Ultra-high resolution non-invasive scan offering silent acoustic technology and maximum patient comfort for precise neurological, vascular, and musculoskeletal diagnosis.',
    descBn: 'অতি-উচ্চ রেজোলিউশনযুক্ত সাইলেন্ট প্রযুক্তির এমআরআই যা ব্রেইন, স্পাইন, ভ্যাসকুলার ও হাড়ের নিখুঁত রোগ নির্ণয়ে সহায়ক।',
    specs: ['3.0T High Field Strength', 'Silent Scan Acoustic Reduction', 'Whole Body Angiography'],
    icon: '⚡',
  },
  {
    id: 'ct',
    nameEn: '128-Slice Ultra-Fast CT Scan',
    nameBn: '১২৮-স্লাইস আল্ট্রা-ফাস্ট সিটি স্ক্যান',
    tagEn: 'Cardiac Angiography & Chest',
    tagBn: 'কার্ডিয়াক এনজিওগ্রাফি ও চেস্ট',
    descEn: 'Sub-millimeter spatial resolution providing high-speed 3D cardiac coronary angiography and low-dose lung screening within seconds.',
    descBn: 'কয়েক সেকেন্ডের মধ্যে হৃদযন্ত্রের করোনানি এনজিওগ্রাফি ও কম রেডিয়েশনের ফুসফুস পরীক্ষার সর্বাধুনিক ব্যবস্থা।',
    specs: ['128-Slice Multi-Detector', 'Coronary Calcium Scoring', 'Low Radiation Dose Control'],
    icon: '🩻',
  },
  {
    id: 'echo',
    nameEn: '4D Colour Doppler Echocardiography',
    nameBn: 'ফোরডি কালার ডপলার ইকোকার্ডিওগ্রাফি',
    tagEn: 'Advanced Cardiac Diagnostics',
    tagBn: 'উন্নত কার্ডিয়াক ডায়াগনস্টিকস',
    descEn: 'Real-time 4D structural heart imaging for precise valvular assessment, congenital defect screening, and myocardial strain analysis.',
    descBn: 'হৃদযন্ত্রের কপাটিকা, প্রকোষ্ঠ ও ব্লকেজের রিয়েল-টাইম থ্রিডি/ফোরডি ইমেজিং প্রযুক্তি।',
    specs: ['Real-time 4D Volumetric Echo', 'Tissue Doppler Imaging', 'Stress Echocardiography'],
    icon: '❤️',
  },
  {
    id: 'pathology',
    nameEn: 'Fully Automated Pathology Laboratory',
    nameBn: 'সম্পূর্ণ স্বয়ংক্রিয় প্যাথলজি ল্যাবরেটরি',
    tagEn: 'Robotic Analyzer & Barcode Tracking',
    tagBn: 'রোবোটিক অ্যানালাইজার ও বারকোড ট্র্যাকিং',
    descEn: 'Zero-human error clinical chemistry, haematology, and hormone immunoassay systems backed by ISO 9001:2015 quality standards.',
    descBn: 'বারকোড ট্র্যাকিং ও রোবোটিক প্রক্রিয়ার মাধ্যমে শূন্য-ভুল নির্ভুল প্যাথলজি ও হরমোন পরীক্ষা।',
    specs: ['Robotic Sample Processing', 'Daily Quality Control Verification', 'Same-Day Digital Report'],
    icon: '🔬',
  },
];

export function TechShowcase({ locale }: { locale: string }) {
  const [activeTab, setActiveTab] = useState(0);
  const isBn = locale === 'bn';
  const item = TECH_ITEMS[activeTab];

  return (
    <div className="rounded-panel border border-line bg-paper p-6 sm:p-8 shadow-lifted">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="eyebrow mb-2">Advanced Medical Technology</p>
          <h2 className="text-display-sm font-semibold text-ink">
            {isBn ? 'সর্বাধুনিক ডায়াগনস্টিক প্রযুক্তি' : 'State-of-the-Art Diagnostic Equipment'}
          </h2>
        </div>
        <span className="pill bg-teal text-white font-bold text-xs shrink-0">
          {isBn ? 'আন্তর্জাতিক মানের চিকিৎসা' : 'International Quality Standards'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-line pb-4 mb-6">
        {TECH_ITEMS.map((t, idx) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(idx)}
            className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all ${
              idx === activeTab
                ? 'bg-teal text-white shadow-md'
                : 'bg-cream text-soft hover:bg-teal-soft hover:text-teal'
            }`}
          >
            <span className="mr-2">{t.icon}</span>
            {isBn ? t.nameBn : t.nameEn}
          </button>
        ))}
      </div>

      {/* Display Card */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-center rounded-card bg-cream p-6 border border-line">
        <div>
          <span className="text-[0.65rem] font-extrabold uppercase tracking-widest text-teal">
            {isBn ? item.tagBn : item.tagEn}
          </span>
          <h3 className="mt-2 text-xl font-extrabold text-ink">
            {isBn ? item.nameBn : item.nameEn}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-soft font-medium">
            {isBn ? item.descBn : item.descEn}
          </p>

          <ul className="mt-6 space-y-2">
            {item.specs.map((spec) => (
              <li key={spec} className="flex items-center gap-2 text-xs font-bold text-ink">
                <span className="text-teal font-extrabold">✓</span> {spec}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-card bg-teal-soft/80 border border-teal/20 p-6 text-center space-y-3">
          <span className="text-5xl block">{item.icon}</span>
          <h4 className="font-extrabold text-teal-deep text-sm">
            {isBn ? 'পপুলার সেন্টারসমূহে উপলব্ধ' : 'Available at Popular Centers'}
          </h4>
          <p className="text-xs text-soft">
            {isBn ? 'ধানমন্ডি, উত্তরা, মিরপুর ও চট্টগ্রাম শাখায় সার্বক্ষণিক সেবা' : 'Dhanmondi, Uttara, Mirpur & Chattogram Branches'}
          </p>
          <a
            href="/services"
            className="btn-primary btn-small text-xs w-full justify-center mt-2 inline-flex"
          >
            {isBn ? 'টেস্টের তালিকা ও মূল্য দেখুন →' : 'View Test Catalogue & Pricing →'}
          </a>
        </div>
      </div>
    </div>
  );
}
