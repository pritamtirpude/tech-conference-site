import {defineField, defineType} from 'sanity'

export const trackType = defineType({
  name: 'track',
  title: 'Track',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'string',
    }),
    defineField({
      name: 'color',
      type: 'string',
      description: 'Hex colour for the track badge, e.g. #B5E9FC',
      validation: (rule) =>
        rule
          .required()
          .regex(/^#[0-9a-fA-F]{6}$/, {name: 'hex colour'})
          .error('Use a 6-digit hex colour like #B5E9FC'),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'color'},
  },
})
