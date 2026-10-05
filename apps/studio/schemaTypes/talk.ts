import {defineField, defineType} from 'sanity'

// Zero-padded 24h "HH:mm". Padding matters: GROQ sorts these as strings,
// so "9:00" would sort after "10:00", while "09:00" sorts correctly.
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export const talkType = defineType({
  name: 'talk',
  title: 'Talk',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'speaker',
      type: 'reference',
      to: [{type: 'speaker'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'track',
      type: 'reference',
      to: [{type: 'track'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'day',
      type: 'number',
      description: 'Conference day (1 = the conference start date)',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'startTime',
      type: 'string',
      description: '24-hour time, e.g. 09:00',
      validation: (rule) =>
        rule.required().regex(TIME_PATTERN, {name: 'HH:mm'}).error('Use HH:mm, e.g. 09:00'),
    }),
    defineField({
      name: 'endTime',
      type: 'string',
      description: '24-hour time, e.g. 10:00',
      validation: (rule) =>
        rule
          .required()
          .regex(TIME_PATTERN, {name: 'HH:mm'})
          .custom((endTime, context) => {
            const startTime = (context.document as {startTime?: string} | undefined)?.startTime
            if (!endTime || !startTime) return true
            return endTime > startTime || 'Must be after the start time'
          }),
    }),
    defineField({
      name: 'location',
      type: 'string',
      description: 'Room, e.g. Room A',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'highlighted',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Schedule',
      name: 'schedule',
      by: [
        {field: 'day', direction: 'asc'},
        {field: 'startTime', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      day: 'day',
      startTime: 'startTime',
      location: 'location',
      speakerName: 'speaker.name',
      media: 'speaker.avatar',
    },
    prepare: ({title, day, startTime, location, speakerName, media}) => ({
      title,
      subtitle: [day ? `Day ${day}` : null, startTime, location, speakerName]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
