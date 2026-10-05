import {defineField, defineType} from 'sanity'

// Singleton: the Studio structure (../structure.ts) pins this to one document with
// this fixed ID, and sanity.config.ts hides "create"/"delete" for it.
export const CONFERENCE_DOCUMENT_ID = 'conference'

export const conferenceType = defineType({
  name: 'conference',
  title: 'Conference',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'brandCode',
      type: 'string',
      description: 'Short code used in the design, e.g. DEVHORIZON_26',
    }),
    defineField({
      name: 'tagline',
      type: 'string',
    }),
    defineField({
      name: 'startDate',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      type: 'date',
      validation: (rule) =>
        rule
          .required()
          .min(rule.valueOfField('startDate'))
          .error('Must be on or after the start date'),
    }),
    defineField({
      name: 'location',
      type: 'object',
      fields: [
        defineField({name: 'venue', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'city', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'cityAbbreviation', type: 'string', description: 'e.g. SF'}),
        defineField({name: 'state', type: 'string'}),
      ],
    }),
  ],
})
