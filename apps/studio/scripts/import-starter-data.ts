/**
 * Imports seed/data.json (+ seed/avatars) into the Sanity dataset.
 *
 *   pnpm import-data -- --dry-run   # validate + print what would be written
 *   pnpm import-data                # upload avatars and write all documents
 *
 * Idempotent: document IDs are derived from the JSON IDs (sp_0 -> speaker-sp_0) and
 * written with createOrReplace, and Sanity de-duplicates identical image uploads,
 * so re-running overwrites the same documents instead of creating copies.
 * Note: createOrReplace overwrites any edits made in the Studio to these documents.
 */
import {createReadStream} from 'node:fs'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

type SanityDocumentStub = {_id: string; _type: string; [field: string]: unknown}

interface StarterData {
  conference: {
    name: string
    brandCode: string
    tagline: string
    startDate: string
    endDate: string
    location: {venue: string; city: string; cityAbbreviation: string; state: string}
  }
  tracks: Array<{id: string; name: string; description: string; color: string}>
  speakers: Array<{
    id: string
    name: string
    role: string
    company: string
    avatar: string
    bio: string
    featured: boolean
  }>
  talks: Array<{
    id: string
    title: string
    speakerId: string
    day: number
    trackId: string
    startTime: string
    endTime: string
    location: string
    description: string
    highlighted: boolean
  }>
}

const SEED_DIR = path.resolve(process.cwd(), 'seed')
const dryRun = process.argv.includes('--dry-run')

const client = getCliClient({apiVersion: '2025-02-19'})

// Hyphen, not dot: IDs containing "." are treated as private paths and
// aren't readable through the public (unauthenticated) API.
const docId = (type: string, starterId: string) => `${type}-${starterId}`

const reference = (_ref: string) => ({_type: 'reference' as const, _ref})

// "9:00" -> "09:00" so string ordering in GROQ matches time ordering.
function padTime(time: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time)
  if (!match) throw new Error(`Unexpected time format: "${time}"`)
  return `${match[1].padStart(2, '0')}:${match[2]}`
}

// "Sarah Lindström" -> "sarah-lindstrom"
function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function assertReferencesExist(data: StarterData) {
  const speakerIds = new Set(data.speakers.map((s) => s.id))
  const trackIds = new Set(data.tracks.map((t) => t.id))
  for (const talk of data.talks) {
    if (!speakerIds.has(talk.speakerId)) {
      throw new Error(`Talk ${talk.id} references unknown speaker ${talk.speakerId}`)
    }
    if (!trackIds.has(talk.trackId)) {
      throw new Error(`Talk ${talk.id} references unknown track ${talk.trackId}`)
    }
  }
}

async function uploadAvatar(relativePath: string): Promise<string> {
  const filename = path.basename(relativePath)
  const filePath = path.join(SEED_DIR, 'avatars', filename)
  const asset = await client.assets.upload('image', createReadStream(filePath), {filename})
  return asset._id
}

async function main() {
  const data = JSON.parse(await readFile(path.join(SEED_DIR, 'data.json'), 'utf8')) as StarterData
  assertReferencesExist(data)

  const {projectId, dataset} = client.config()
  console.log(`${dryRun ? '[dry run] ' : ''}Importing into ${projectId}/${dataset}`)

  const conference: SanityDocumentStub = {
    _id: 'conference', // matches CONFERENCE_DOCUMENT_ID in schemaTypes/conference.ts
    _type: 'conference',
    ...data.conference,
  }

  const tracks: SanityDocumentStub[] = data.tracks.map(({id, ...track}) => ({
    _id: docId('track', id),
    _type: 'track',
    ...track,
  }))

  const speakers: SanityDocumentStub[] = []
  for (const {id, avatar, ...speaker} of data.speakers) {
    const assetId = dryRun ? `(would upload ${path.basename(avatar)})` : await uploadAvatar(avatar)
    speakers.push({
      _id: docId('speaker', id),
      _type: 'speaker',
      ...speaker,
      slug: {_type: 'slug', current: slugify(speaker.name)},
      avatar: {_type: 'image', asset: reference(assetId)},
    })
    if (!dryRun) console.log(`  uploaded avatar for ${speaker.name}`)
  }

  const talks: SanityDocumentStub[] = data.talks.map(
    ({id, speakerId, trackId, startTime, endTime, ...talk}) => ({
      _id: docId('talk', id),
      _type: 'talk',
      ...talk,
      speaker: reference(docId('speaker', speakerId)),
      track: reference(docId('track', trackId)),
      startTime: padTime(startTime),
      endTime: padTime(endTime),
    }),
  )

  const documents = [conference, ...tracks, ...speakers, ...talks]

  if (dryRun) {
    console.log(JSON.stringify(documents.slice(0, 1).concat(speakers[0], talks[0]), null, 2))
    console.log(
      `Would write ${documents.length} documents: 1 conference, ${tracks.length} tracks, ` +
        `${speakers.length} speakers, ${talks.length} talks`,
    )
    return
  }

  // One transaction: either everything is written or nothing is, and talks can
  // reference speakers/tracks created in the same transaction.
  const transaction = client.transaction()
  for (const doc of documents) transaction.createOrReplace(doc)
  await transaction.commit()

  console.log(`Wrote ${documents.length} documents.`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
