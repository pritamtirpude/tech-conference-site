import { urlFor } from '#/lib/sanity-image'
import { featuredSpeakersQueryOptions } from '#/lib/speakers.functions'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  // Fetch during SSR/navigation; the result is dehydrated into the page.
  // `staleTime: 'static'` = use cached data if present, whatever its age
  // (what the deprecated ensureQueryData did); useSuspenseQuery refetches
  // in the background when it's stale.
  loader: ({ context }) =>
    context.queryClient.query({
      ...featuredSpeakersQueryOptions(),
      staleTime: 'static',
    }),
  component: App,
})

function App() {
  const { data: speakers } = useSuspenseQuery(featuredSpeakersQueryOptions())

  return (
    <main>
      <h1 className="font-chakra-petch text-chakra-mobile-preset-1">
        The Tech Conference Site
      </h1>

      <section aria-labelledby="featured-speakers">
        <h2 id="featured-speakers">Featured speakers</h2>
        <ul>
          {speakers.map((speaker) => (
            <li key={speaker._id}>
              {speaker.avatar && (
                <img
                  src={urlFor(speaker.avatar)
                    .width(160)
                    .height(160)
                    .auto('format')
                    .url()}
                  // Empty alt by default: the name is shown right next to it.
                  alt={speaker.avatar.alt ?? ''}
                  width={80}
                  height={80}
                />
              )}
              <h3>{speaker.name}</h3>
              <p>
                {[speaker.role, speaker.company].filter(Boolean).join(' @ ')}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
