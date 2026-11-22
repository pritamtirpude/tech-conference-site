import SpeakerItem from "#/components/featured_speakers/SpeakerItem";
import SpeakerModal from "#/components/SpeakerModal";
import { allSpeakersQueryOptions } from "#/queries/get-speakers";
import { useUIStore } from "#/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/speakers")({
  loader: async ({ context }) => {
    await context.queryClient.query(allSpeakersQueryOptions());
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: speakers } = useSuspenseQuery(allSpeakersQueryOptions());

  const selectedSpeaker = useUIStore((state) => state.selectedSpeaker);
  const closeSpeaker = useUIStore((state) => state.closeSpeaker);

  return (
    <section>
      <h1 className="text-dev-green-200 text-chakra-mobile-preset-2 lg:text-chakra-preset-2 md:text-chakra-tablet-preset-2 lowercase">
        // Speakers
      </h1>

      <ul className="mt-12 grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-4">
        {speakers.map((speaker, index) => (
          <li key={speaker._id}>
            <SpeakerItem speaker={speaker} index={index} />
          </li>
        ))}
      </ul>
      {selectedSpeaker && (
        <SpeakerModal speaker={selectedSpeaker} onClose={closeSpeaker} />
      )}
    </section>
  );
}
