import { execSync } from 'child_process';

// 1. Automatically map Vercel Postgres / Neon variables if DATABASE_URL is not set directly
const realDbUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

const realDirectUrl =
  process.env.DIRECT_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  realDbUrl;

if (realDbUrl) {
  process.env.DATABASE_URL = realDbUrl;
} else {
  // Provide dummy URL for prisma generate if no DB URL is configured yet
  process.env.DATABASE_URL = 'postgresql://placeholder:placeholder@localhost:5432/placeholder';
}

if (realDirectUrl) {
  process.env.DIRECT_URL = realDirectUrl;
} else {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

console.log('--- CarePilot Build Environment ---');
console.log('DATABASE_URL:', realDbUrl ? '✓ Connected' : '⚠️ Missing (Using build placeholder)');
console.log('DIRECT_URL:  ', realDirectUrl ? '✓ Connected' : '⚠️ Missing (Using build placeholder)');
console.log('-----------------------------------');

try {
  console.log('> Step 1: Generating Prisma Client');
  execSync('npx prisma generate', { stdio: 'inherit', env: process.env });

  if (realDbUrl) {
    console.log('> Step 2: Running Database Migrations');
    execSync('npx prisma migrate deploy', { stdio: 'inherit', env: process.env });

    console.log('> Step 3: Seeding Database Records');
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', env: process.env });
  } else {
    console.log('⚠️ Skipping DB migrations and seed because database connection URL was not provided.');
  }

  console.log('> Step 4: Building Next.js Application');
  execSync('npx next build', { stdio: 'inherit', env: process.env });
} catch (error) {
  console.error('Build step failed:', error);
  process.exit(1);
}
