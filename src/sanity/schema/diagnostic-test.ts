import { defineField, defineType } from 'sanity';

export const diagnosticTest = defineType({
  name: 'diagnosticTest',
  title: 'Diagnostic test / package',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Test or package name',
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
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Pathology', value: 'PATHOLOGY' },
          { title: 'Radiology', value: 'RADIOLOGY' },
          { title: 'Cardiology', value: 'CARDIOLOGY' },
          { title: 'Imaging', value: 'IMAGING' },
          { title: 'Health package', value: 'PACKAGE' },
          { title: 'Other', value: 'OTHER' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'PATHOLOGY',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'summary', title: 'Short summary', type: 'localeText' }),
    defineField({
      name: 'preparation',
      title: 'Preparation instructions',
      type: 'localeText',
      description: 'Patient-facing instructions such as fasting requirements.',
    }),
    defineField({ name: 'price', title: 'Price', type: 'number' }),
    defineField({ name: 'discountedPrice', title: 'Discounted price', type: 'number' }),
    defineField({
      name: 'reportHours',
      title: 'Report turnaround (hours)',
      type: 'number',
      description: 'Typical time until the report is ready, in hours.',
    }),
    defineField({
      name: 'homeCollection',
      title: 'Available for home collection',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'branch',
      title: 'Available at branch',
      type: 'reference',
      to: [{ type: 'branch' }],
      description: 'Leave empty if the test is available at all branches.',
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
    select: { title: 'name.en', subtitle: 'category' },
  },
});
