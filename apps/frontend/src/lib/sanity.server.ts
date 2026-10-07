import { createClient } from '@sanity/client'
import { dataset, projectId } from '@repo/sanity'

// `.server.ts` keeps this out of the client bundle (Start import protection),
// so queries only ever run inside server functions. If a read token is ever
// needed (private dataset, drafts), add it here from process.env.
export const sanityClient = createClient({
  projectId,
  dataset,
  // Pinned so Sanity API changes never alter query results unexpectedly.
  apiVersion: '2026-10-07',
  // Cached CDN reads of published content; edits show up within seconds.
  useCdn: true,
  perspective: 'published',
})
