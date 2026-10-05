import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main>
      <h1 className="font-chakra-petch text-chakra-mobile-preset-1">
        The Tech Conference Site
      </h1>
    </main>
  )
}
