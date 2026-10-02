import { defineField, defineType } from 'sanity';

export const notice = defineType({
  name: 'notice',
  title: 'Notice / announcement',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Notice title',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title.en', maxLength: 96 },
    }),
    defineField({ name: 'body', title: 'Notice details', type: 'localeText' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Service change', value: 'service' },
          { title: 'Holiday hours', value: 'hours' },
          { title: 'Recruitment', value: 'careers' },
          { title: 'Health advisory', value: 'advisory' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'general',
    }),
    defineField({ name: 'isPinned', title: 'Pin to top', type: 'boolean', initialValue: false }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires at',
      type: 'datetime',
      description: 'Leave empty for a permanent notice.',
    }),
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
      initialValue: 'PUBLISHED',
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
    select: { title: 'title.en', subtitle: 'category' },
  },
});
