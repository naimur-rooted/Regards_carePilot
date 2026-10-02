import { defineField, defineType } from 'sanity';

/**
 * Reusable bilingual field objects.
 * Every editor-facing text field uses this { en, bn } shape so the frontend can
 * always resolve a value for the active locale.
 */
export const localeString = defineType({
  name: 'localeString',
  title: 'Localized string',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bn',
      title: 'বাংলা (Bengali)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
});

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized text',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'bn',
      title: 'বাংলা (Bengali)',
      type: 'text',
      rows: 4,
    }),
  ],
});
