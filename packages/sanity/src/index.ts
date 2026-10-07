// Shared Sanity code for apps/frontend and apps/studio.
// Exported as TypeScript source (no build step) — each app's bundler compiles it.

export const projectId = '2ucm6pnj'
export const dataset = 'production'

export * from './queries'

export type * from './sanity.types'
