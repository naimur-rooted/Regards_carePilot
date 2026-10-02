import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schema';

/**
 * Sanity Studio configuration for CarePilot.
 * Run locally with: npm run sanity:dev
 * Deploy the hosted studio with: npm run sanity:deploy
 *
 * Editors manage doctors, branches, specialties, diagnostic tests, health
 * articles and notices here, with no code changes required.
 */
export default defineConfig({
  name: 'carepilot',
  title: 'CarePilot Content Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
