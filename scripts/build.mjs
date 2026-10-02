import { execSync } from 'child_process';

function isValidPostgresUrl(url) {
  return (
    typeof url === 'string' &&
    (url.startsWith('postgres://') || url.startsWith('postgresql://'))
  );
}

function resolvePostgresUrl(...candidates) {
  for (const candidate of candidates) {
    if (isValidPostgresUrl(candidate)) {
      return candidate;
    }
  }
  return null;
}

const realDbUrl = resolvePostgresUrl(
  process.env.DATABASE_URL,
  process.env.POSTGRES_PRISMA_URL,
  process.env.POSTGRES_URL,
  process.env.POSTGRES_URL_NON_POOLING
);

const realDirectUrl = resolvePostgresUrl(
  process.env.DIRECT_URL,
  process.env.POSTGRES_URL_NON_POOLING,
  realDbUrl
);

if (realDbUrl) {
  process.env.DATABASE_URL = realDbUrl;
} else {
  // Use build-time placeholder when no valid connection string is found
  process.env.DATABASE_URL = 'postgresql://placeholder:placeholder@localhost:5432/placeholder';
}

if (realDirectUrl) {
  process.env.DIRECT_URL = realDirectUrl;
} else {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

console.log('--- CarePilot Build Environment ---');
console.log('DATABASE_URL:', realDbUrl ? '✓ Valid Postgres URL detected' : '⚠️ No valid Postgres URL detected (Using placeholder)');
console.log('DIRECT_URL:  ', realDirectUrl ? '✓ Valid Direct URL detected' : '⚠️ No valid Direct URL detected (Using placeholder)');
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
    console.log('⚠️ Skipping DB migrations and seed step because a valid database connection string was not provided.');
  }

  console.log('> Step 4: Building Next.js Application');
  execSync('npx next build', { stdio: 'inherit', env: process.env });
} catch (error) {
  console.error('Build step failed:', error);
  process.exit(1);
}
