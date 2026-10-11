import { featuredSpeakersQueryOptions } from "#/lib/speakers.functions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    context.queryClient.query({
      ...featuredSpeakersQueryOptions(),
      // staleTime: 'static',
    }),
  component: App,
});

function App() {
  const { data: speakers } = useSuspenseQuery(featuredSpeakersQueryOptions());

  return <main className="">dsads</main>;
}
