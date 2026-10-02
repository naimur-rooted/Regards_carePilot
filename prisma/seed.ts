import { PrismaClient } from '@prisma/client';
import {
  demoArticles,
  demoBranches,
  demoDoctors,
  demoNotices,
  demoSpecialties,
  demoTests,
} from '../src/lib/demo-data';

const prisma = new PrismaClient();

/**
 * Idempotent demonstration seed.
 *
 * Run with: npm run db:seed
 *
 * Every record is upserted on its unique slug, so running the seed repeatedly
 * never duplicates data. Replace this data with verified clinic information
 * before any public launch.
 */
async function seedSpecialties() {
  for (const specialty of demoSpecialties) {
    await prisma.specialty.upsert({
      where: { slug: specialty.slug },
      update: {
        nameEn: specialty.name.en,
        nameBn: specialty.name.bn,
        descriptionEn: specialty.description.en,
        descriptionBn: specialty.description.bn,
        icon: specialty.icon,
        order: specialty.order,
        isActive: true,
      },
      create: {
        slug: specialty.slug,
        nameEn: specialty.name.en,
        nameBn: specialty.name.bn,
        descriptionEn: specialty.description.en,
        descriptionBn: specialty.description.bn,
        icon: specialty.icon,
        order: specialty.order,
        isActive: true,
      },
    });
  }
  console.log(`✔ specialties: ${demoSpecialties.length}`);
}

async function seedBranches() {
  for (const branch of demoBranches) {
    const data = {
      nameEn: branch.name.en,
      nameBn: branch.name.bn,
      addressEn: branch.address.en,
      addressBn: branch.address.bn,
      cityEn: branch.city.en,
      cityBn: branch.city.bn,
      phone: branch.phone,
      altPhone: branch.altPhone,
      email: branch.email,
      hoursEn: branch.hours.en,
      hoursBn: branch.hours.bn,
      mapUrl: branch.mapUrl,
      latitude: branch.latitude,
      longitude: branch.longitude,
      imagePublicId: branch.image,
      offersHomeCollection: branch.offersHomeCollection,
      order: branch.order,
      isActive: true,
    };

    await prisma.branch.upsert({
      where: { slug: branch.slug },
      update: data,
      create: { slug: branch.slug, ...data },
    });
  }
  console.log(`✔ branches: ${demoBranches.length}`);
}

async function seedDoctors() {
  for (const doctor of demoDoctors) {
    const specialty = await prisma.specialty.findUnique({
      where: { slug: doctor.specialtySlug },
      select: { id: true },
    });

    if (!specialty) {
      console.warn(`! skipping ${doctor.slug}: specialty ${doctor.specialtySlug} missing`);
      continue;
    }

    const doctorData = {
      nameEn: doctor.name.en,
      nameBn: doctor.name.bn,
      designationEn: doctor.designation.en,
      designationBn: doctor.designation.bn,
      qualificationsEn: doctor.qualifications.en,
      qualificationsBn: doctor.qualifications.bn,
      bioEn: doctor.bio.en,
      bioBn: doctor.bio.bn,
      photoPublicId: doctor.photo,
      bmdcRegNo: doctor.bmdcRegNo,
      experienceYears: doctor.experienceYears,
      languages: doctor.languages,
      isFeatured: doctor.isFeatured,
      order: doctor.order,
      isActive: true,
      specialtyId: specialty.id,
    };

    const savedDoctor = await prisma.doctor.upsert({
      where: { slug: doctor.slug },
      update: doctorData,
      create: { slug: doctor.slug, ...doctorData },
    });

    for (const slot of doctor.availability) {
      const branch = await prisma.branch.findUnique({
        where: { slug: slot.branchSlug },
        select: { id: true },
      });
      if (!branch) continue;

      await prisma.doctorBranch.upsert({
        where: {
          doctorId_branchId: { doctorId: savedDoctor.id, branchId: branch.id },
        },
        update: {
          scheduleEn: slot.schedule.en,
          scheduleBn: slot.schedule.bn,
          consultationFee: slot.fee,
          isPrimary: slot.isPrimary,
        },
        create: {
          doctorId: savedDoctor.id,
          branchId: branch.id,
          scheduleEn: slot.schedule.en,
          scheduleBn: slot.schedule.bn,
          consultationFee: slot.fee,
          isPrimary: slot.isPrimary,
        },
      });
    }
  }
  console.log(`✔ doctors: ${demoDoctors.length}`);
}

async function seedTests() {
  for (const test of demoTests) {
    const branch = test.branchSlug
      ? await prisma.branch.findUnique({ where: { slug: test.branchSlug }, select: { id: true } })
      : null;

    const data = {
      nameEn: test.name.en,
      nameBn: test.name.bn,
      category: test.category,
      summaryEn: test.summary.en,
      summaryBn: test.summary.bn,
      preparationEn: test.preparation?.en ?? null,
      preparationBn: test.preparation?.bn ?? null,
      price: test.price,
      discountedPrice: test.discountedPrice,
      reportHours: test.reportHours,
      homeCollection: test.homeCollection,
      branchId: branch?.id ?? null,
      order: test.order,
      isActive: true,
    };

    await prisma.diagnosticTest.upsert({
      where: { slug: test.slug },
      update: data,
      create: { slug: test.slug, ...data },
    });
  }
  console.log(`✔ diagnostic tests: ${demoTests.length}`);
}

async function seedArticles() {
  for (const article of demoArticles) {
    const data = {
      titleEn: article.title.en,
      titleBn: article.title.bn,
      excerptEn: article.excerpt.en,
      excerptBn: article.excerpt.bn,
      // Bodies are stored as JSON so the same shape can hold Sanity portable text.
      bodyEn: article.body.en,
      bodyBn: article.body.bn,
      coverPublicId: article.cover,
      category: article.category,
      tags: article.tags,
      authorName: article.author,
      reviewedBy: article.reviewedBy,
      publishedAt: new Date(article.publishedAt),
      reviewDate: new Date(article.reviewDate),
      readingMinutes: article.readingMinutes,
      status: 'PUBLISHED' as const,
    };

    await prisma.article.upsert({
      where: { slug: article.slug },
      update: data,
      create: { slug: article.slug, ...data },
    });
  }
  console.log(`✔ articles: ${demoArticles.length}`);
}

async function seedNotices() {
  for (const notice of demoNotices) {
    const data = {
      titleEn: notice.title.en,
      titleBn: notice.title.bn,
      bodyEn: notice.body.en,
      bodyBn: notice.body.bn,
      isPinned: notice.isPinned,
      publishedAt: new Date(notice.publishedAt),
      expiresAt: notice.expiresAt ? new Date(notice.expiresAt) : null,
      status: 'PUBLISHED' as const,
    };

    await prisma.notice.upsert({
      where: { slug: notice.slug },
      update: data,
      create: { slug: notice.slug, ...data },
    });
  }
  console.log(`✔ notices: ${demoNotices.length}`);
}

async function seedUsers() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@carepilot.example' },
    update: { role: 'ADMIN', locale: 'en' },
    create: {
      email: 'admin@carepilot.example',
      name: 'CarePilot Administrator',
      role: 'ADMIN',
      locale: 'en',
    },
  });

  const patient = await prisma.user.upsert({
    where: { email: 'patient@carepilot.example' },
    update: { role: 'PATIENT' },
    create: {
      email: 'patient@carepilot.example',
      name: 'Demo Patient',
      phone: '+880 1700 000099',
      role: 'PATIENT',
      locale: 'en',
    },
  });

  // A released report so the portal has something to render in a demo.
  const existingReport = await prisma.report.findFirst({
    where: { userId: patient.id, title: 'Complete blood count (CBC)' },
  });

  if (!existingReport) {
    await prisma.report.create({
      data: {
        userId: patient.id,
        title: 'Complete blood count (CBC)',
        testName: 'CBC',
        reportDate: new Date('2026-09-10'),
        isReleased: true,
        fileUrl: 'https://res.cloudinary.com/demo/raw/upload/sample-report.pdf',
      },
    });
  }

  console.log(`✔ users: ${admin.email}, ${patient.email}`);
}

async function main() {
  console.log('Seeding CarePilot demonstration data…');
  await seedSpecialties();
  await seedBranches();
  await seedDoctors();
  await seedTests();
  await seedArticles();
  await seedNotices();
  await seedUsers();
  console.log('Seed complete. All records are idempotent upserts.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
