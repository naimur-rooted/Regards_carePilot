import { defineField, defineType } from 'sanity';

export const branch = defineType({
  name: 'branch',
  title: 'Branch',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Branch name',
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
      name: 'address',
      title: 'Address',
      type: 'localeText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Primary phone',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'altPhone', title: 'Alternate phone', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'hours', title: 'Opening hours', type: 'localeString' }),
    defineField({
      name: 'mapUrl',
      title: 'Google Maps embed URL',
      type: 'url',
      description: 'Paste the src value from a Google Maps embed snippet.',
    }),
    defineField({ name: 'latitude', title: 'Latitude', type: 'number' }),
    defineField({ name: 'longitude', title: 'Longitude', type: 'number' }),
    defineField({
      name: 'imagePublicId',
      title: 'Cloudinary public ID',
      type: 'string',
      description: 'Cloudinary asset id, for example carepilot/branches/dhanmondi.',
    }),
    defineField({
      name: 'offersHomeCollection',
      title: 'Offers home sample collection',
      type: 'boolean',
      initialValue: false,
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
    select: { title: 'name.en', subtitle: 'city.en' },
  },
});
