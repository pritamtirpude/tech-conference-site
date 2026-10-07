import {defineCliConfig} from 'sanity/cli'
import {dataset, projectId} from '@repo/sanity'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
  // `pnpm typegen`: scans the shared package for defineQuery() calls and writes
  // schema + query result types back into it, for both apps to import.
  typegen: {
    path: '../../packages/sanity/src/**/*.ts',
    schema: 'schema.json',
    generates: '../../packages/sanity/src/sanity.types.ts',
  },
})
