import { defineQuery } from 'groq'

// Each query must be a single static string so TypeGen can analyse it.
// After changing one, run `pnpm --filter studio typegen` to refresh its
// `<NAME>_RESULT` type in sanity.types.ts.

export const FEATURED_SPEAKERS_QUERY = defineQuery(`
  *[_type == "speaker" && featured == true] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    role,
    company,
    // Only what urlFor() and <img alt> need — also keeps the result
    // serializable across the server-function boundary.
    avatar { asset, hotspot, crop, alt }
  }
`)

export const CONFERENCE_QUERY = defineQuery(`
  *[_type == "conference"][0]{
    tagline, 
    startDate, 
    endDate, 
    location{venue, cityAbbreviation},
    "keynote": *[_type == "talk" && track->name == "Keynote"] | order(day asc, startTime asc)[0]{
      title,
      day,
      startTime, 
      location, 
      speaker->{
        name, 
        role, 
        company, 
        avatar{asset, hotspot, crop, alt}}
    }
  }
`)

export const TRACKS_QUERY = defineQuery(`
  *[_type == "track" && name != "Keynote"] | order(_createdAt asc)
`)
