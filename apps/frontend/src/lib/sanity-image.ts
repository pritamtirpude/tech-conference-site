import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { dataset, projectId } from '@repo/sanity'

// Client-safe: only builds CDN URLs, never calls the API.
const builder = createImageUrlBuilder({ projectId, dataset })

// Respects the crop/hotspot set in Studio. Chain sizing per use, e.g.
// urlFor(speaker.avatar).width(200).height(200).auto('format').url()
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
