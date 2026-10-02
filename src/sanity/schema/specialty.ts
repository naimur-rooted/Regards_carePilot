import { defineField, defineType } from 'sanity';

export const specialty = defineType({
  name: 'specialty',
  title: 'Specialty',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Specialty name',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'name.en', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'description', title: 'Description', type: 'localeText' }),
    defineField({
      name: 'icon',
      title: 'Icon key',
      type: 'string',
      description: 'Short key used by the frontend, for example: heart, scan, lungs.',
    }),
    defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 0 }),
    defineField({ name: 'isActive', title: 'Show on site', type: 'boolean', initialValue: true }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name.en', subtitle: 'name.bn' },
  },
});
