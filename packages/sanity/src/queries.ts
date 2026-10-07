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
