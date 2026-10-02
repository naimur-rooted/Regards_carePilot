import type { TestCategory } from './types';

/**
 * Demonstration dataset.
 *
 * These fixtures let the platform render every page before Supabase, Sanity and
 * Cloudinary credentials exist. The same data is used to seed Postgres
 * (see prisma/seed.ts), so seeded rows and fallback rows stay aligned.
 *
 * Everything here is illustrative. Organisation names, addresses, phone
 * numbers, registration numbers, prices and clinical wording must be replaced
 * and clinically verified before this is shown to the public.
 */
export type DemoSpecialty = {
  slug: string;
  name: { en: string; bn: string };
  description: { en: string; bn: string };
  icon: string;
  order: number;
};

export const demoSpecialties: DemoSpecialty[] = [
  {
    slug: 'cardiology',
    name: { en: 'Cardiology', bn: 'কার্ডিওলজি' },
    description: {
      en: 'Heart health, blood pressure and cardiac risk assessment.',
      bn: 'হৃদযন্ত্রের স্বাস্থ্য, রক্তচাপ ও হৃদঝুঁকি মূল্যায়ন।',
    },
    icon: 'heart',
    order: 1,
  },
  {
    slug: 'gynaecology',
    name: { en: 'Gynaecology & obstetrics', bn: 'গাইনোকোলজি ও প্রসূতি' },
    description: {
      en: 'Women’s health, pregnancy care and fertility guidance.',
      bn: 'নারীস্বাস্থ্য, গর্ভকালীন সেবা ও প্রজনন পরামর্শ।',
    },
    icon: 'bloom',
    order: 2,
  },
  {
    slug: 'haematology',
    name: { en: 'Haematology', bn: 'হেমাটোলজি' },
    description: {
      en: 'Blood disorders, anaemia and transfusion medicine.',
      bn: 'রক্তজনিত রোগ, রক্তশূন্যতা ও ট্রান্সফিউশন চিকিৎসা।',
    },
    icon: 'drop',
    order: 3,
  },
  {
    slug: 'medicine',
    name: { en: 'Internal medicine', bn: 'ইন্টারনাল মেডিসিন' },
    description: {
      en: 'General adult medicine, diabetes and long-term conditions.',
      bn: 'সাধারণ প্রাপ্তবয়স্ক চিকিৎসা, ডায়াবেটিস ও দীর্ঘমেয়াদি রোগ।',
    },
    icon: 'stethoscope',
    order: 4,
  },
  {
    slug: 'orthopaedic-surgery',
    name: { en: 'Orthopaedic surgery', bn: 'অর্থোপেডিক সার্জারি' },
    description: {
      en: 'Bones, joints, fracture care and rehabilitation.',
      bn: 'হাড়, জোড়া, ফ্র্যাকচার চিকিৎসা ও পুনর্বাসন।',
    },
    icon: 'bone',
    order: 5,
  },
  {
    slug: 'paediatrics',
    name: { en: 'Paediatrics', bn: 'শিশু চিকিৎসা' },
    description: {
      en: 'Newborn, child and adolescent health.',
      bn: 'নবজাতক, শিশু ও কিশোর স্বাস্থ্য।',
    },
    icon: 'child',
    order: 6,
  },
];

export type DemoBranch = {
  slug: string;
  name: { en: string; bn: string };
  address: { en: string; bn: string };
  city: { en: string; bn: string };
  phone: string;
  altPhone: string | null;
  email: string;
  hours: { en: string; bn: string };
  mapUrl: string;
  latitude: number;
  longitude: number;
  image: string | null;
  offersHomeCollection: boolean;
  order: number;
};

export const demoBranches: DemoBranch[] = [
  {
    slug: 'dhanmondi-main',
    name: { en: 'Dhanmondi main centre', bn: 'ধানমন্ডি মূল কেন্দ্র' },
    address: {
      en: 'House 16, Road 2, Dhanmondi R/A, Dhaka 1205',
      bn: 'বাড়ি ১৬, রোড ২, ধানমন্ডি আ/এ, ঢাকা ১২০৫',
    },
    city: { en: 'Dhaka', bn: 'ঢাকা' },
    phone: '+880 9613 787801',
    altPhone: '+880 2 9669480',
    email: 'dhanmondi@populardiagnostic.example',
    hours: { en: 'Sat–Thu, 7:00 am – 10:00 pm', bn: 'শনি–বৃহস্পতি, সকাল ৭টা – রাত ১০টা' },
    mapUrl: 'https://www.google.com/maps?q=Dhanmondi,Dhaka&output=embed',
    latitude: 23.7465,
    longitude: 90.376,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    offersHomeCollection: true,
    order: 1,
  },
  {
    slug: 'uttara-sector-7',
    name: { en: 'Uttara Sector 7 branch', bn: 'উত্তরা সেক্টর ৭ শাখা' },
    address: {
      en: 'House 25, Road 7, Sector 7, Uttara, Dhaka 1230',
      bn: 'বাড়ি ২৫, রোড ৭, সেক্টর ৭, উত্তরা, ঢাকা ১২৩০',
    },
    city: { en: 'Dhaka', bn: 'ঢাকা' },
    phone: '+880 9613 787802',
    altPhone: null,
    email: 'uttara@populardiagnostic.example',
    hours: { en: 'Sat–Thu, 7:30 am – 9:30 pm', bn: 'শনি–বৃহস্পতি, সকাল ৭:৩০ – রাত ৯:৩০' },
    mapUrl: 'https://www.google.com/maps?q=Uttara+Sector+7,Dhaka&output=embed',
    latitude: 23.8687,
    longitude: 90.3961,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    offersHomeCollection: true,
    order: 2,
  },
  {
    slug: 'mirpur',
    name: { en: 'Mirpur branch', bn: 'মিরপুর শাখা' },
    address: {
      en: 'House 2, Block A, Section 10, Mirpur, Dhaka 1216',
      bn: 'বাড়ি ২, ব্লক এ, সেকশন ১০, মিরপুর, ঢাকা ১২১৬',
    },
    city: { en: 'Dhaka', bn: 'ঢাকা' },
    phone: '+880 9613 787803',
    altPhone: null,
    email: 'mirpur@populardiagnostic.example',
    hours: { en: 'Sat–Thu, 8:00 am – 9:00 pm', bn: 'শনি–বৃহস্পতি, সকাল ৮টা – রাত ৯টা' },
    mapUrl: 'https://www.google.com/maps?q=Mirpur+10,Dhaka&output=embed',
    latitude: 23.8069,
    longitude: 90.3687,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    offersHomeCollection: false,
    order: 3,
  },
  {
    slug: 'chattogram-agrabad',
    name: { en: 'Chattogram Agrabad branch', bn: 'চট্টগ্রাম আগ্রাবাদ শাখা' },
    address: {
      en: '20/B, Agrabad C/A, Chattogram 4100',
      bn: '২০/বি, আগ্রাবাদ বাণিজ্যিক এলাকা, চট্টগ্রাম ৪১০০',
    },
    city: { en: 'Chattogram', bn: 'চট্টগ্রাম' },
    phone: '+880 9613 787804',
    altPhone: '+880 31 713200',
    email: 'chattogram@populardiagnostic.example',
    hours: { en: 'Sat–Thu, 7:00 am – 9:00 pm', bn: 'শনি–বৃহস্পতি, সকাল ৭টা – রাত ৯টা' },
    mapUrl: 'https://www.google.com/maps?q=Agrabad,Chattogram&output=embed',
    latitude: 22.3271,
    longitude: 91.8096,
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
    offersHomeCollection: true,
    order: 4,
  },
  {
    slug: 'sylhet-zindabazar',
    name: { en: 'Sylhet Zindabazar branch', bn: 'সিলেট জিন্দাবাজার শাখা' },
    address: {
      en: 'New Medical Road, Zindabazar, Sylhet 3100',
      bn: 'নিউ মেডিকেল রোড, জিন্দাবাজার, সিলেট ৩১০০',
    },
    city: { en: 'Sylhet', bn: 'সিলেট' },
    phone: '+880 9613 787805',
    altPhone: null,
    email: 'sylhet@populardiagnostic.example',
    hours: { en: 'Sat–Thu, 8:00 am – 8:00 pm', bn: 'শনি–বৃহস্পতি, সকাল ৮টা – রাত ৮টা' },
    mapUrl: 'https://www.google.com/maps?q=Zindabazar,Sylhet&output=embed',
    latitude: 24.8949,
    longitude: 91.8687,
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    offersHomeCollection: false,
    order: 5,
  },
];

export type DemoDoctor = {
  slug: string;
  name: { en: string; bn: string };
  designation: { en: string; bn: string };
  specialtySlug: string;
  qualifications: { en: string; bn: string };
  bio: { en: string; bn: string };
  photo: string | null;
  bmdcRegNo: string;
  experienceYears: number;
  languages: string[];
  isFeatured: boolean;
  order: number;
  availability: {
    branchSlug: string;
    schedule: { en: string; bn: string };
    fee: number | null;
    isPrimary: boolean;
  }[];
};

export const demoDoctors: DemoDoctor[] = [
  {
    slug: 'dr-sarah-ahmed',
    name: { en: 'Dr. Sarah Ahmed', bn: 'ডা. সারা আহমেদ' },
    designation: { en: 'Senior Consultant, Cardiology', bn: 'সিনিয়র কনসালট্যান্ট, কার্ডিওলজি' },
    specialtySlug: 'cardiology',
    qualifications: { en: 'MBBS, FCPS (Cardiology), MD (Cardiology)', bn: 'এমবিবিএস, এফসিপিএস (কার্ডিওলজি), এমডি (কার্ডিওলজি)' },
    bio: {
      en: 'Focuses on preventive cardiology, hypertension, echocardiography and heart failure follow-up.',
      bn: 'প্রতিরোধমূলক কার্ডিওলজি, উচ্চ রক্তচাপ, ইকোকার্ডিওগ্রাফি ও হৃদযন্ত্রের ব্যর্থতা ফলোআপে বিশেষ অভিজ্ঞ।',
    },
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    bmdcRegNo: 'A-12345',
    experienceYears: 14,
    languages: ['Bangla', 'English'],
    isFeatured: true,
    order: 1,
    availability: [
      {
        branchSlug: 'dhanmondi-main',
        schedule: { en: 'Sun–Wed, 5:00 pm – 9:00 pm', bn: 'রবি–বুধ, বিকাল ৫টা – রাত ৯টা' },
        fee: 1200,
        isPrimary: true,
      },
      {
        branchSlug: 'uttara-sector-7',
        schedule: { en: 'Thu, 4:00 pm – 8:00 pm', bn: 'বৃহস্পতি, বিকাল ৪টা – রাত ৮টা' },
        fee: 1200,
        isPrimary: false,
      },
    ],
  },
  {
    slug: 'dr-rahul-barua',
    name: { en: 'Dr. Rahul Barua', bn: 'ডা. রাহুল বড়ুয়া' },
    designation: { en: 'Consultant, Haematology', bn: 'কনসালট্যান্ট, হেমাটোলজি' },
    specialtySlug: 'haematology',
    qualifications: { en: 'MBBS, MD (Haematology), FCPS', bn: 'এমবিবিএস, এমডি (হেমাটোলজি), এফসিপিএস' },
    bio: {
      en: 'Expert in anaemia, clotting disorders, blood cancers and transfusion medicine.',
      bn: 'রক্তশূন্যতা, রক্ত জমাট বাঁধার সমস্যা, ব্লাড ক্যানসার ও ট্রান্সফিউশন চিকিৎসায় পারদর্শী।',
    },
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    bmdcRegNo: 'A-23456',
    experienceYears: 11,
    languages: ['Bangla', 'English'],
    isFeatured: true,
    order: 2,
    availability: [
      {
        branchSlug: 'dhanmondi-main',
        schedule: { en: 'Sat, Mon, Wed, 10:00 am – 1:00 pm', bn: 'শনি, সোম, বুধ, সকাল ১০টা – দুপুর ১টা' },
        fee: 1000,
        isPrimary: true,
      },
    ],
  },
  {
    slug: 'dr-nusrat-jahan',
    name: { en: 'Dr. Nusrat Jahan', bn: 'ডা. নুসরাত জাহান' },
    designation: { en: 'Consultant, Obstetrics & Gynaecology', bn: 'কনসালট্যান্ট, প্রসূতি ও স্ত্রীরোগ' },
    specialtySlug: 'gynaecology',
    qualifications: { en: 'MBBS, FCPS (Gynae & Obs), MS', bn: 'এমবিবিএস, এফসিপিএস (গাইনি ও অবস), এমএস' },
    bio: {
      en: 'High-risk pregnancy management, antenatal care, laparoscopic surgery and fertility counselling.',
      bn: 'উচ্চঝুঁকিপূর্ণ গর্ভাবস্থা, প্রসবপূর্ব সেবা, ল্যাপারোস্কোপিক সার্জারি ও প্রজনন পরামর্শ।',
    },
    photo: 'https://images.unsplash.com/photo-1594824813571-28a778555b08?auto=format&fit=crop&w=600&q=80',
    bmdcRegNo: 'A-34567',
    experienceYears: 12,
    languages: ['Bangla', 'English', 'Hindi'],
    isFeatured: true,
    order: 3,
    availability: [
      {
        branchSlug: 'uttara-sector-7',
        schedule: { en: 'Sun–Tue, 4:00 pm – 8:00 pm', bn: 'রবি–মঙ্গল, বিকাল ৪টা – রাত ৮টা' },
        fee: 1100,
        isPrimary: true,
      },
      {
        branchSlug: 'mirpur',
        schedule: { en: 'Fri, 9:00 am – 1:00 pm', bn: 'শুক্র, সকাল ৯টা – দুপুর ১টা' },
        fee: 1100,
        isPrimary: false,
      },
    ],
  },
  {
    slug: 'dr-imran-hossain',
    name: { en: 'Dr. Imran Hossain', bn: 'ডা. ইমরান হোসেন' },
    designation: { en: 'Associate Consultant, Internal Medicine', bn: 'অ্যাসোসিয়েট কনসালট্যান্ট, ইন্টারনাল মেডিসিন' },
    specialtySlug: 'medicine',
    qualifications: { en: 'MBBS, MD (Internal Medicine), MACP (USA)', bn: 'এমবিবিএস, এমডি (ইন্টারনাল মেডিসিন), এমএসিপি (যুক্তরাষ্ট্র)' },
    bio: {
      en: 'Diabetes management, thyroid disorders, fever of unknown origin and hypertension.',
      bn: 'ডায়াবেটিস ব্যবস্থাপনা, থাইরয়েড সমস্যা, অনিরূপিত জ্বর ও উচ্চ রক্তচাপ।',
    },
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    bmdcRegNo: 'A-45678',
    experienceYears: 9,
    languages: ['Bangla', 'English'],
    isFeatured: false,
    order: 4,
    availability: [
      {
        branchSlug: 'dhanmondi-main',
        schedule: { en: 'Daily except Friday, 6:00 pm – 9:00 pm', bn: 'শুক্রবার ছাড়া প্রতিদিন, সন্ধ্যা ৬টা – রাত ৯টা' },
        fee: 900,
        isPrimary: true,
      },
      {
        branchSlug: 'mirpur',
        schedule: { en: 'Sat & Tue, 3:00 pm – 6:00 pm', bn: 'শনি ও মঙ্গল, বিকাল ৩টা – সন্ধ্যা ৬টা' },
        fee: 900,
        isPrimary: false,
      },
    ],
  },
  {
    slug: 'dr-tanvir-islam',
    name: { en: 'Dr. Tanvir Islam', bn: 'ডা. তানভীর ইসলাম' },
    designation: { en: 'Consultant, Orthopaedic Surgery', bn: 'কনসালট্যান্ট, অর্থোপেডিক সার্জারি' },
    specialtySlug: 'orthopaedic-surgery',
    qualifications: { en: 'MBBS, MS (Orthopaedic Surgery)', bn: 'এমবিবিএস, এমএস (অর্থোপেডিক সার্জারি)' },
    bio: {
      en: 'Fracture fixation, joint replacement, spine care and trauma management.',
      bn: 'হাড় ভাঙা চিকিৎসা, জয়েন্ট রিপ্লেসমেন্ট, মেরুদণ্ড সেবা ও ট্রমা চিকিৎসা।',
    },
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    bmdcRegNo: 'A-56789',
    experienceYears: 16,
    languages: ['Bangla', 'English'],
    isFeatured: false,
    order: 5,
    availability: [
      {
        branchSlug: 'chattogram-agrabad',
        schedule: { en: 'Sun–Wed, 10:00 am – 1:00 pm', bn: 'রবি–বুধ, সকাল ১০টা – দুপুর ১টা' },
        fee: 1300,
        isPrimary: true,
      },
      {
        branchSlug: 'sylhet-zindabazar',
        schedule: { en: 'Fri, 3:00 pm – 7:00 pm', bn: 'শুক্র, বিকাল ৩টা – সন্ধ্যা ৭টা' },
        fee: 1300,
        isPrimary: false,
      },
    ],
  },
  {
    slug: 'dr-farhana-akter',
    name: { en: 'Dr. Farhana Akter', bn: 'ডা. ফারহানা আক্তার' },
    designation: { en: 'Consultant Paediatrician', bn: 'কনসালট্যান্ট শিশু বিশেষজ্ঞ' },
    specialtySlug: 'paediatrics',
    qualifications: { en: 'MBBS, FCPS (Paediatrics), DCH', bn: 'এমবিবিএস, এফসিপিএস (শিশু চিকিৎসা), ডিসিএইচ' },
    bio: {
      en: 'Newborn care, childhood vaccination, growth monitoring and pediatric asthma.',
      bn: 'নবজাতক যত্ন, শিশু টিকাদান, বৃদ্ধি পর্যবেক্ষণ ও চাইল্ড অ্যাজমা।',
    },
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
    bmdcRegNo: 'A-67890',
    experienceYears: 10,
    languages: ['Bangla', 'English'],
    isFeatured: false,
    order: 6,
    availability: [
      {
        branchSlug: 'uttara-sector-7',
        schedule: { en: 'Sat–Thu, 9:00 am – 12:00 pm', bn: 'শনি–বৃহস্পতি, সকাল ৯টা – দুপুর ১২টা' },
        fee: 800,
        isPrimary: true,
      },
      {
        branchSlug: 'chattogram-agrabad',
        schedule: { en: 'Sat, 4:00 pm – 7:00 pm', bn: 'শনি, বিকাল ৪টা – সন্ধ্যা ৭টা' },
        fee: 800,
        isPrimary: false,
      },
    ],
  },
  {
    slug: 'dr-arif-mahmud',
    name: { en: 'Dr. Arif Mahmud', bn: 'ডা. আরিফ মাহমুদ' },
    designation: { en: 'Consultant Cardiologist', bn: 'কনসালট্যান্ট কার্ডিওলজিস্ট' },
    specialtySlug: 'cardiology',
    qualifications: { en: 'MBBS, MD (Cardiology)', bn: 'এমবিবিএস, এমডি (কার্ডিওলজি)' },
    bio: {
      en: 'Echocardiography, ETT, chest pain assessment and coronary angioplasty follow-up.',
      bn: 'ইকোকার্ডিওগ্রাফি, ইটিটি, বুকে ব্যথার মূল্যয়ন ও এনজিওপ্লাস্টি ফলোআপ।',
    },
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    bmdcRegNo: 'A-78901',
    experienceYears: 8,
    languages: ['Bangla', 'English'],
    isFeatured: false,
    order: 7,
    availability: [
      {
        branchSlug: 'chattogram-agrabad',
        schedule: { en: 'Mon & Thu, 5:00 pm – 9:00 pm', bn: 'সোম ও বৃহস্পতি, বিকাল ৫টা – রাত ৯টা' },
        fee: 1100,
        isPrimary: true,
      },
    ],
  },
  {
    slug: 'dr-shirin-sultana',
    name: { en: 'Dr. Shirin Sultana', bn: 'ডা. শিরিন সুলতানা' },
    designation: { en: 'Senior Consultant, Gynaecology', bn: 'সিনিয়র কনসালট্যান্ট, স্ত্রীরোগ' },
    specialtySlug: 'gynaecology',
    qualifications: { en: 'MBBS, FCPS, MRCOG (UK)', bn: 'এমবিবিএস, এফসিপিএস, এমআরসিওজি (যুক্তরাজ্য)' },
    bio: {
      en: 'High-risk pregnancy, laparoscopy, infertility care and women’s preventive screening.',
      bn: 'উচ্চঝুঁকিপূর্ণ গর্ভধারণ, ল্যাপারোস্কোপি, বন্ধ্যাত্ব সেবা ও নারীদের হেলথ স্ক্রিনিং।',
    },
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    bmdcRegNo: 'A-89012',
    experienceYears: 18,
    languages: ['Bangla', 'English'],
    isFeatured: true,
    order: 8,
    availability: [
      {
        branchSlug: 'dhanmondi-main',
        schedule: { en: 'Tue & Thu, 10:00 am – 2:00 pm', bn: 'মঙ্গল ও বৃহস্পতি, সকাল ১০টা – দুপুর ২টা' },
        fee: 1500,
        isPrimary: true,
      },
      {
        branchSlug: 'sylhet-zindabazar',
        schedule: { en: 'Sat, 10:00 am – 1:00 pm', bn: 'শনি, সকাল ১০টা – দুপুর ১টা' },
        fee: 1500,
        isPrimary: false,
      },
    ],
  },
  {
    slug: 'dr-mahbub-ur-rahman',
    name: { en: 'Dr. Mahbub-ur Rahman', bn: 'ডা. মাহবুবুর রহমান' },
    designation: { en: 'Senior Consultant & Head of Neurology', bn: 'সিনিয়র কনসালট্যান্ট ও বিভাগীয় প্রধান, নিউরোলজি' },
    specialtySlug: 'medicine',
    qualifications: { en: 'MBBS, FCPS (Neurology), MD (Neurology)', bn: 'এমবিবিএস, এফসিপিএস (নিউরোলজি), এমডি (নিউরোলজি)' },
    bio: {
      en: 'Stroke care, epilepsy, Parkinson’s disease, headache and nerve conduction studies.',
      bn: 'স্ট্রোক চিকিৎসা, মৃগীরোগ, পারকিনসন্স, মাথাব্যথা ও নার্ভ কন্ডাকশন স্টাডি।',
    },
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    bmdcRegNo: 'A-90123',
    experienceYears: 20,
    languages: ['Bangla', 'English'],
    isFeatured: true,
    order: 9,
    availability: [
      {
        branchSlug: 'dhanmondi-main',
        schedule: { en: 'Sat–Wed, 6:00 pm – 9:00 pm', bn: 'শনি–বুধ, সন্ধ্যা ৬টা – রাত ৯টা' },
        fee: 1500,
        isPrimary: true,
      },
    ],
  },
  {
    slug: 'dr-tanjina-chowdhury',
    name: { en: 'Dr. Tanjina Chowdhury', bn: 'ডা. তানজিনা চৌধুরী' },
    designation: { en: 'Consultant Endocrinologist', bn: 'কনসালট্যান্ট এন্ডোক্রাইনোলজিস্ট' },
    specialtySlug: 'medicine',
    qualifications: { en: 'MBBS, DEM (BIRDEM), MD (Endocrinology)', bn: 'এমবিবিএস, ডিইএম (বারডেম), এমডি (এন্ডোক্রাইনোলজি)' },
    bio: {
      en: 'Specialized in adult & juvenile diabetes, thyroid disorders, PCOS and hormone imbalance.',
      bn: 'ডায়াবেটিস, থাইরয়েড সমস্যা, পিসিওএস ও হরমোনজনিত রোগের বিশেষজ্ঞ।',
    },
    photo: 'https://images.unsplash.com/photo-1594824813571-28a778555b08?auto=format&fit=crop&w=600&q=80',
    bmdcRegNo: 'A-91234',
    experienceYears: 13,
    languages: ['Bangla', 'English'],
    isFeatured: false,
    order: 10,
    availability: [
      {
        branchSlug: 'uttara-sector-7',
        schedule: { en: 'Sun, Tue, Thu, 5:00 pm – 8:00 pm', bn: 'রবি, মঙ্গল, বৃহস্পতি, বিকাল ৫টা – রাত ৮টা' },
        fee: 1200,
        isPrimary: true,
      },
    ],
  },
];

export type DemoTest = {
  slug: string;
  name: { en: string; bn: string };
  category: TestCategory;
  summary: { en: string; bn: string };
  preparation: { en: string; bn: string } | null;
  price: number;
  discountedPrice: number | null;
  reportHours: number;
  homeCollection: boolean;
  branchSlug: string | null;
  order: number;
};

export const demoTests: DemoTest[] = [
  {
    slug: 'complete-blood-count',
    name: { en: 'Complete blood count (CBC)', bn: 'সম্পূর্ণ রক্ত গণনা (সিবিসি)' },
    category: 'PATHOLOGY',
    summary: {
      en: 'Screens red cells, white cells and platelets to investigate anaemia, infection or bleeding.',
      bn: 'রক্তশূন্যতা, সংক্রমণ বা রক্তক্ষরণ অনুসন্ধানে লোহিত, শ্বেতকণিকা ও অণুচক্রিকা পরীক্ষা।',
    },
    preparation: {
      en: 'No fasting required. Continue your usual medication unless advised otherwise.',
      bn: 'উপবাস লাগবে না। পরামর্শ না থাকলে স্বাভাবিক ওষুধ চালিয়ে যান।',
    },
    price: 600,
    discountedPrice: null,
    reportHours: 6,
    homeCollection: true,
    branchSlug: null,
    order: 1,
  },
  {
    slug: 'fasting-blood-sugar',
    name: { en: 'Fasting blood sugar', bn: 'ফাস্টিং ব্লাড সুগার' },
    category: 'PATHOLOGY',
    summary: {
      en: 'Measures blood glucose after an overnight fast to screen for diabetes.',
      bn: 'রাতের উপবাসের পর রক্তে গ্লুকোজ মেপে ডায়াবেটিস শনাক্তকরণ।',
    },
    preparation: {
      en: 'Fast for 8–10 hours. Water is allowed. Do not eat before the sample is taken.',
      bn: '৮–১০ ঘণ্টা উপবাস রাখুন। পানি পান করা যাবে। নমুনা নেওয়ার আগে খাবেন না।',
    },
    price: 250,
    discountedPrice: 200,
    reportHours: 4,
    homeCollection: true,
    branchSlug: null,
    order: 2,
  },
  {
    slug: 'lipid-profile',
    name: { en: 'Lipid profile', bn: 'লিপিড প্রোফাইল' },
    category: 'PATHOLOGY',
    summary: {
      en: 'Cholesterol and triglyceride levels used in cardiac risk assessment.',
      bn: 'হৃদঝুঁকি মূল্যায়নে কোলেস্টেরল ও ট্রাইগ্লিসারাইডের মাত্রা।',
    },
    preparation: {
      en: 'Fast for 9–12 hours. Avoid fatty food on the evening before the test.',
      bn: '৯–১২ ঘণ্টা উপবাস রাখুন। পরীক্ষার আগের রাতে চর্বিযুক্ত খাবার এড়িয়ে চলুন।',
    },
    price: 1200,
    discountedPrice: 950,
    reportHours: 8,
    homeCollection: true,
    branchSlug: null,
    order: 3,
  },
  {
    slug: 'chest-x-ray',
    name: { en: 'Chest X-ray (PA view)', bn: 'বুকের এক্স-রে (পিএ ভিউ)' },
    category: 'IMAGING',
    summary: {
      en: 'Imaging of the lungs and heart silhouette for cough, fever or breathlessness.',
      bn: 'কাশি, জ্বর বা শ্বাসকষ্টে ফুসফুস ও হৃদযন্ত্রের ছবি।',
    },
    preparation: {
      en: 'Remove metal objects and jewellery from the chest area. Inform staff if you may be pregnant.',
      bn: 'বুকের এলাকা থেকে ধাতব বস্তু ও গহনা খুলে ফেলুন। গর্ভবতী হওয়ার সম্ভাবনা থাকলে জানান।',
    },
    price: 800,
    discountedPrice: null,
    reportHours: 3,
    homeCollection: false,
    branchSlug: 'dhanmondi-main',
    order: 4,
  },
  {
    slug: 'echocardiography',
    name: { en: 'Echocardiography', bn: 'ইকোকার্ডিওগ্রাফি' },
    category: 'CARDIOLOGY',
    summary: {
      en: 'Ultrasound assessment of heart valves, chambers and pumping function.',
      bn: 'হৃদকপাট, প্রকোষ্ঠ ও পাম্পিং কার্যকারিতার আল্ট্রাসাউন্ড মূল্যায়ন।',
    },
    preparation: {
      en: 'No fasting needed. Bring previous cardiac reports if you have them.',
      bn: 'উপবাস লাগবে না। আগের কার্ডিয়াক রিপোর্ট থাকলে সঙ্গে আনুন।',
    },
    price: 2500,
    discountedPrice: 2200,
    reportHours: 4,
    homeCollection: false,
    branchSlug: 'dhanmondi-main',
    order: 5,
  },
  {
    slug: 'thyroid-function-test',
    name: { en: 'Thyroid function test (TSH, FT4)', bn: 'থাইরয়েড ফাংশন টেস্ট (টিএসএইচ, এফটি৪)' },
    category: 'PATHOLOGY',
    summary: {
      en: 'Assesses thyroid activity in fatigue, weight change or hair loss.',
      bn: 'ক্লান্তি, ওজন পরিবর্তন বা চুল পড়ায় থাইরয়েডের কার্যকারিতা মূল্যায়ন।',
    },
    preparation: {
      en: 'Sample is best taken in the morning. Take thyroid medication after collection unless advised otherwise.',
      bn: 'সকালে নমুনা নেওয়া ভালো। ভিন্ন পরামর্শ না থাকলে নমুনা দেওয়ার পর থাইরয়েডের ওষুধ নিন।',
    },
    price: 1400,
    discountedPrice: null,
    reportHours: 12,
    homeCollection: true,
    branchSlug: null,
    order: 6,
  },
  {
    slug: 'basic-health-package',
    name: { en: 'Basic Health Checkup Package', bn: 'বেসিক হেলথ চেকআপ প্যাকেজ' },
    category: 'PACKAGE',
    summary: {
      en: '8 essential screening tests: CBC, Fasting Blood Sugar, Lipid Profile, Creatinine, SGPT, Urine R/E, ECG & Chest X-Ray.',
      bn: '৮টি মৌলিক পরীক্ষা: সিবিসি, ফাস্টিং সুগার, লিপিড প্রোফাইল, ক্রিয়েটিনিন, এসজিপিটি, ইউরিন আর/ই, ইসিজি ও এক্স-রে।',
    },
    preparation: {
      en: 'Fast 8–10 hours overnight before sample collection. Water is allowed.',
      bn: 'নমুনা সংগ্রহের আগে রাতে ৮-১০ ঘণ্টা উপবাস থাকুন। পানি পান করা যাবে।',
    },
    price: 3500,
    discountedPrice: 2800,
    reportHours: 12,
    homeCollection: true,
    branchSlug: null,
    order: 7,
  },
  {
    slug: 'executive-health-package',
    name: { en: 'Executive Health Package (40+)', bn: 'এক্সিকিউটিভ হেলথ প্যাকেজ (৪০+)' },
    category: 'PACKAGE',
    summary: {
      en: 'Complete 15-test executive screening: Cardiac, Liver, Kidney, Diabetes, Thyroid, Lipid Profile, Echocardiography & USG.',
      bn: '১৫টি পরীক্ষার পূর্ণাঙ্গ স্ক্রিনিং: কার্ডিয়াক, লিভার, কিডনি, ডায়াবেটিস, থাইরয়েড, ইকোকার্ডিওগ্রাফি ও ইউএসজি।',
    },
    preparation: {
      en: 'Fast 10–12 hours overnight. Drink 1 litre water for USG bladder fullness.',
      bn: 'রাতে ১০-১২ ঘণ্টা উপবাস থাকুন। আল্ট্রাসাউন্ডের জন্য পর্যাপ্ত পানি পান করুন।',
    },
    price: 12500,
    discountedPrice: 9900,
    reportHours: 24,
    homeCollection: true,
    branchSlug: null,
    order: 8,
  },
  {
    slug: 'womens-wellness-package',
    name: { en: 'Women’s Health & Wellness Package', bn: 'নারীস্বাস্থ্য ও ওয়েলনেস প্যাকেজ' },
    category: 'PACKAGE',
    summary: {
      en: 'Dedicated health evaluation: Hormone profile (TSH, Prolactin), Pap Smear, Breast USG, Bone Health, Blood Sugar & CBC.',
      bn: 'নারীদের বিশেষ পরীক্ষা: হরমোন প্রোফাইল (টিএসএইচ, প্রোল্যাকটিন), প্যাপ স্মিয়ার, ব্রেস্ট ইউএসজি, হাড়ের স্বাস্থ্য ও সিবিসি।',
    },
    preparation: {
      en: 'Morning sample collection recommended. Fast 8 hours for blood glucose test.',
      bn: 'সকালে নমুনা সংগ্রহ সবচেয়ে ভালো। রক্তে চিনির পরীক্ষার জন্য ৮ ঘণ্টা উপবাস থাকুন।',
    },
    price: 8900,
    discountedPrice: 7200,
    reportHours: 24,
    homeCollection: true,
    branchSlug: null,
    order: 9,
  },
  {
    slug: 'diabetes-cardiac-package',
    name: { en: 'Diabetes & Cardiac Screening Package', bn: 'ডায়াবেটিস ও হৃদরোগ স্ক্রিনিং প্যাকেজ' },
    category: 'PACKAGE',
    summary: {
      en: 'HbA1c, Fasting Blood Sugar, Lipid Profile, ECG, Echocardiography, Microalbuminuria & Serum Creatinine.',
      bn: 'এইচবিএ১সি, ফাস্টিং সুগার, লিপিড প্রোফাইল, ইসিজি, ইকোকার্ডিওগ্রাফি, মাইক্রোঅ্যালবুমিনুরিয়া ও ক্রিয়েটিনিন।',
    },
    preparation: {
      en: 'Fast for 8–10 hours. Bring your previous prescriptions and ECG reports.',
      bn: '৮–১০ ঘণ্টা উপবাস থাকুন। আগের ব্যবস্থাপত্র ও ইসিজি রিপোর্ট সঙ্গে আনুন।',
    },
    price: 5500,
    discountedPrice: 4500,
    reportHours: 12,
    homeCollection: true,
    branchSlug: null,
    order: 10,
  },
];

export type DemoArticle = {
  slug: string;
  title: { en: string; bn: string };
  excerpt: { en: string; bn: string };
  body: { en: string[]; bn: string[] };
  category: string;
  tags: string[];
  author: string;
  reviewedBy: string;
  publishedAt: string;
  reviewDate: string;
  readingMinutes: number;
  cover: string | null;
};

export const demoArticles: DemoArticle[] = [
  {
    slug: 'understanding-your-blood-test',
    title: {
      en: 'Understanding your blood test results',
      bn: 'আপনার রক্ত পরীক্ষার ফলাফল বুঝে নিন',
    },
    excerpt: {
      en: 'A short guide to the numbers on a routine blood report and what they usually mean.',
      bn: 'সাধারণ রক্ত পরীক্ষার রিপোর্টে থাকা সংখ্যাগুলো ও তাদের অর্থ সম্পর্কে সংক্ষিপ্ত নির্দেশিকা।',
    },
    body: {
      en: [
        'A blood report usually lists a measurement, a reference range and a unit. The reference range describes values seen in most healthy people; it is a guide, not a verdict.',
        'A single value outside the range may be caused by dehydration, a recent illness, medication or the time of day the sample was taken. Trends over time are usually more informative than one result.',
        'Bring previous reports to your consultation so your doctor can compare values and decide whether further testing is needed.',
      ],
      bn: [
        'রক্তের রিপোর্টে সাধারণত একটি মাপ, একটি স্বাভাবিক সীমা এবং একটি একক থাকে। এই সীমা বেশিরভাগ সুস্থ মানুষের মান নির্দেশ করে; এটি নির্দেশিকা, চূড়ান্ত রায় নয়।',
        'সীমার বাইরে একটি মান পানিশূন্যতা, সাম্প্রতিক অসুস্থতা, ওষুধ বা নমুনা নেওয়ার সময়ের কারণে হতে পারে। একটি ফলাফলের চেয়ে সময়ের সঙ্গে পরিবর্তনের ধারা বেশি গুরুত্বপূর্ণ।',
        'পরামর্শের সময় আগের রিপোর্ট সঙ্গে আনুন, যাতে ডাক্তার মান তুলনা করে বোঝাতে পারেন আরও পরীক্ষা প্রয়োজন কি না।',
      ],
    },
    category: 'diagnostics',
    tags: ['blood test', 'reports'],
    author: 'CarePilot editorial team',
    reviewedBy: 'Dr. Rahul Barua, Haematology',
    publishedAt: '2026-08-18',
    reviewDate: '2027-02-18',
    readingMinutes: 4,
    cover: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'preparing-for-a-fasting-test',
    title: {
      en: 'How to prepare for a fasting test',
      bn: 'উপবাসের পরীক্ষার প্রস্তুতি কীভাবে নেবেন',
    },
    excerpt: {
      en: 'What fasting means in practice, how long it lasts and when you should ask first.',
      bn: 'উপবাস বলতে বাস্তবে কী বোঝায়, কত সময় লাগে এবং কখন আগে জিজ্ঞেস করা উচিত।',
    },
    body: {
      en: [
        'Fasting means no food and no drinks other than plain water for the period your test requires. Tea, coffee, juice and milk all break a fast.',
        'Most fasting tests need 8 to 12 hours. An overnight fast that ends with a morning appointment is usually easiest to manage.',
        'If you take medication for diabetes, blood pressure or thyroid disease, ask your doctor whether to take it before or after the sample is collected.',
      ],
      bn: [
        'উপবাস বলতে নির্দিষ্ট সময় পর্যন্ত খাবার এবং পানি ছাড়া অন্য কোনো পানীয় বন্ধ রাখা বোঝায়। চা, কফি, জুস ও দুধ উপবাস ভেঙে দেয়।',
        'বেশিরভাগ উপবাসের পরীক্ষায় ৮ থেকে ১২ ঘণ্টা প্রয়োজন। রাতে উপবাস করে সকালে পরীক্ষা করানো সবচেয়ে সহজ।',
        'ডায়াবেটিস, রক্তচাপ বা থাইরয়েডের ওষুধ থাকলে ডাক্তারকে জিজ্ঞেস করুন নমুনা দেওয়ার আগে না পরে ওষুধ নেবেন।',
      ],
    },
    category: 'preventive',
    tags: ['fasting', 'preparation'],
    author: 'CarePilot editorial team',
    reviewedBy: 'Dr. Imran Hossain, Internal Medicine',
    publishedAt: '2026-09-02',
    reviewDate: '2027-03-02',
    readingMinutes: 3,
    cover: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'when-to-see-a-cardiologist',
    title: {
      en: 'When should you see a cardiologist?',
      bn: 'কখন কার্ডিওলজিস্টের কাছে যাওয়া উচিত?',
    },
    excerpt: {
      en: 'Symptoms and risk factors that make a specialist opinion useful, and what to bring.',
      bn: 'যেসব উপসর্গ ও ঝুঁকির কারণ থাকলে বিশেষজ্ঞের পরামর্শ দরকার এবং কী সঙ্গে আনবেন।',
    },
    body: {
      en: [
        'Chest discomfort, breathlessness on mild exertion, palpitations or unexplained fatigue deserve assessment. Severe or sudden chest pain is an emergency: seek emergency care immediately.',
        'Risk factors that lower the threshold for a specialist review include diabetes, high blood pressure, smoking, a strong family history of early heart disease and raised cholesterol.',
        'Bring a list of your current medicines, previous reports and any imaging you have had. This helps avoid repeat testing.',
      ],
      bn: [
        'বুকে অস্বস্তি, সামান্য পরিশ্রমেই শ্বাসকষ্ট, বুক ধড়ফড় বা অস্বাভাবিক ক্লান্তি মূল্যায়ন করা দরকার। তীব্র বা হঠাৎ বুকে ব্যথা জরুরি অবস্থা—সঙ্গে সঙ্গে জরুরি চিকিৎসা নিন।',
        'ডায়াবেটিস, উচ্চ রক্তচাপ, ধূমপান, পরিবারে অল্প বয়সে হৃদরোগের ইতিহাস এবং বেড়ে যাওয়া কোলেস্টেরল থাকলে বিশেষজ্ঞের পরামর্শ আগে নেওয়া উচিত।',
        'বর্তমান ওষুধের তালিকা, আগের রিপোর্ট ও ইমেজিং সঙ্গে আনুন। এতে অপ্রয়োজনীয় পরীক্ষা এড়ানো যায়।',
      ],
    },
    category: 'symptoms',
    tags: ['cardiology', 'heart'],
    author: 'CarePilot editorial team',
    reviewedBy: 'Dr. Sarah Ahmed, Cardiology',
    publishedAt: '2026-09-14',
    reviewDate: '2027-03-14',
    readingMinutes: 5,
    cover: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80',
  },
];

export type DemoNotice = {
  slug: string;
  title: { en: string; bn: string };
  body: { en: string; bn: string };
  category: string;
  isPinned: boolean;
  publishedAt: string;
  expiresAt: string | null;
};

export const demoNotices: DemoNotice[] = [
  {
    slug: 'extended-hours-dhanmondi',
    title: {
      en: 'Extended evening hours at Dhanmondi main centre',
      bn: 'ধানমন্ডি মূল কেন্দ্রে রাতের সেবা সময় বাড়ানো হয়েছে',
    },
    body: {
      en: 'From this month the Dhanmondi main centre accepts pathology samples until 10:00 pm, Saturday to Thursday. Radiology services keep their existing hours.',
      bn: 'এই মাস থেকে ধানমন্ডি মূল কেন্দ্রে শনি থেকে বৃহস্পতিবার রাত ১০টা পর্যন্ত প্যাথলজি নমুনা গ্রহণ করা হবে। রেডিওলজি সেবার সময় অপরিবর্তিত থাকবে।',
    },
    category: 'service',
    isPinned: true,
    publishedAt: '2026-09-20',
    expiresAt: null,
  },
  {
    slug: 'home-collection-chattogram',
    title: {
      en: 'Home sample collection now covers Agrabad and Halishahar',
      bn: 'বাসায় নমুনা সংগ্রহ এখন আগ্রাবাদ ও হালিশহর পর্যন্ত',
    },
    body: {
      en: 'Home collection has been extended to Agrabad and Halishahar. Requests placed before 4:00 pm are usually served the next morning.',
      bn: 'বাসায় নমুনা সংগ্রহ আগ্রাবাদ ও হালিশহর পর্যন্ত বাড়ানো হয়েছে। বিকাল ৪টার আগে করা অনুরোধ সাধারণত পরদিন সকালে সেবা করা হয়।',
    },
    category: 'service',
    isPinned: false,
    publishedAt: '2026-09-12',
    expiresAt: null,
  },
  {
    slug: 'holiday-hours-notice',
    title: {
      en: 'Public holiday schedule for all branches',
      bn: 'সব শাখার সরকারি ছুটির সময়সূচি',
    },
    body: {
      en: 'All branches operate a reduced schedule during the upcoming public holiday. Emergency contact numbers remain active throughout.',
      bn: 'আসন্ন সরকারি ছুটিতে সব শাখায় সীমিত সময়সূচি চালু থাকবে। জরুরি যোগাযোগ নম্বর সার্বক্ষণিক চালু থাকবে।',
    },
    category: 'hours',
    isPinned: false,
    publishedAt: '2026-08-30',
    expiresAt: '2026-12-31',
  },
];
