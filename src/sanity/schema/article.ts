import { defineField, defineType } from 'sanity';

export const article = defineType({
  name: 'article',
  title: 'Health article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title.en', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'excerpt', title: 'Summary', type: 'localeText' }),
    defineField({
      name: 'body',
      title: 'Article body',
      type: 'object',
      fields: [
        defineField({
          name: 'en',
          title: 'English body',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }],
        }),
        defineField({
          name: 'bn',
          title: 'বাংলা body',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }],
        }),
      ],
    }),
    defineField({
      name: 'coverPublicId',
      title: 'Cloudinary cover public ID',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Wellness', value: 'wellness' },
          { title: 'Preventive care', value: 'preventive' },
          { title: 'Symptoms', value: 'symptoms' },
          { title: 'Nutrition', value: 'nutrition' },
          { title: 'Diagnostics', value: 'diagnostics' },
          { title: 'Family health', value: 'family' },
        ],
      },
    }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'authorName',
      title: 'Author',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Medically reviewed by',
      type: 'string',
      description: 'Named clinician who reviewed this content.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'reviewDate',
      title: 'Next review date',
      type: 'datetime',
      description: 'Clinical content should carry a review date.',
    }),
    defineField({ name: 'readingMinutes', title: 'Reading time (minutes)', type: 'number' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'DRAFT' },
          { title: 'Published', value: 'PUBLISHED' },
          { title: 'Archived', value: 'ARCHIVED' },
        ],
        layout: 'radio',
      },
      initialValue: 'DRAFT',
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'status' },
  },
});
