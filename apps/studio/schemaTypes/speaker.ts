import {defineField, defineType} from 'sanity'

export const speakerType = defineType({
  name: 'speaker',
  title: 'Speaker',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'Used in the speaker page URL',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      type: 'string',
    }),
    defineField({
      name: 'company',
      type: 'string',
    }),
    defineField({
      name: 'avatar',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Leave empty if the speaker name is already shown next to the image',
        }),
      ],
    }),
    defineField({
      name: 'bio',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      description: 'Show on the home page',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'name', role: 'role', company: 'company', media: 'avatar'},
    prepare: ({title, role, company, media}) => ({
      title,
      subtitle: [role, company].filter(Boolean).join(' @ '),
      media,
    }),
  },
})
