import { defineField, defineType } from 'sanity';

export const doctor = defineType({
  name: 'doctor',
  title: 'Doctor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Doctor name',
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
      name: 'designation',
      title: 'Designation',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'specialty',
      title: 'Specialty',
      type: 'reference',
      to: [{ type: 'specialty' }],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'qualifications', title: 'Qualifications', type: 'localeText' }),
    defineField({ name: 'bio', title: 'Biography', type: 'localeText' }),
    defineField({
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          { title: 'Male', value: 'MALE' },
          { title: 'Female', value: 'FEMALE' },
          { title: 'Other', value: 'OTHER' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'photoPublicId',
      title: 'Cloudinary photo public ID',
      type: 'string',
      description: 'Cloudinary asset id for the doctor portrait.',
    }),
    defineField({ name: 'bmdcRegNo', title: 'BMDC registration number', type: 'string' }),
    defineField({ name: 'experienceYears', title: 'Years of experience', type: 'number' }),
    defineField({
      name: 'languages',
      title: 'Languages spoken',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Bangla', value: 'Bangla' },
          { title: 'English', value: 'English' },
          { title: 'Hindi', value: 'Hindi' },
          { title: 'Arabic', value: 'Arabic' },
        ],
      },
    }),
    defineField({
      name: 'availability',
      title: 'Branch availability and schedule',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'availabilitySlot',
          fields: [
            defineField({
              name: 'branch',
              title: 'Branch',
              type: 'reference',
              to: [{ type: 'branch' }],
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'schedule', title: 'Schedule', type: 'localeText' }),
            defineField({ name: 'consultationFee', title: 'Consultation fee', type: 'number' }),
            defineField({ name: 'isPrimary', title: 'Primary branch', type: 'boolean' }),
          ],
          preview: {
            select: { title: 'branch.name.en', subtitle: 'schedule.en' },
          },
        },
      ],
    }),
    defineField({ name: 'isFeatured', title: 'Feature on homepage', type: 'boolean', initialValue: false }),
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
    select: { title: 'name.en', subtitle: 'designation.en', media: 'photo' },
  },
});
