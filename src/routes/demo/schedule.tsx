import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

// Runs only on the server; swap the static list for a DB/API call later.
const getSessions = createServerFn({ method: 'GET' }).handler(async () => {
  return [
    { id: 1, time: '09:00', title: 'Keynote', speaker: 'TBA' },
    { id: 2, time: '10:30', title: 'Type-safe routing', speaker: 'TBA' },
    {
      id: 3,
      time: '13:00',
      title: 'Server functions in practice',
      speaker: 'TBA',
    },
  ]
})

const sessionsQueryOptions = queryOptions({
  queryKey: ['sessions'],
  queryFn: () => getSessions(),
})

export const Route = createFileRoute('/demo/schedule')({
  // Prefetch during SSR; setupRouterSsrQueryIntegration dehydrates it to the client.
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(sessionsQueryOptions),
  component: ScheduleDemo,
})

function ScheduleDemo() {
  const { data: sessions } = useSuspenseQuery(sessionsQueryOptions)

  return (
    <main className="demo-page demo-center">
      <section className="demo-panel w-full max-w-2xl">
        <p className="island-kicker mb-2">TanStack Start + Query</p>
        <h1 className="demo-title mb-6">Server Function Schedule</h1>
        <ul className="mb-4 space-y-2">
          {sessions.map((s) => (
            <li key={s.id} className="demo-list-item">
              <span className="text-base font-medium">
                {s.time} — {s.title}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
