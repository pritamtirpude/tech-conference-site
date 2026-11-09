import { featuredSpeakersQueryOptions } from "#/queries/get-speakers";
import { useUIStore } from "#/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import SpeakerModal from "../SpeakerModal";
import SpeakerItem from "./SpeakerItem";

function SpeakerList() {
  const { data: featuredSpeakersData } = useSuspenseQuery(
    featuredSpeakersQueryOptions(),
  );
  const selectedSpeaker = useUIStore((state) => state.selectedSpeaker);
  const closeSpeaker = useUIStore((state) => state.closeSpeaker);

  return (
    <>
      <ul className="mt-6 grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-4">
        {featuredSpeakersData.map((speaker, index) => (
          <li key={speaker._id} className="cursor-pointer">
            <SpeakerItem speaker={speaker} index={index} />
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-center">
        <Link
          to="/speakers"
          className="text-dev-neutral-100 font-jetbrains-mono focus:outline-dev-green-200 focus:shadow-dev-1 shadow-dev-2 text-preset-5 outline-dev-neutral-100 mt-12 px-6 py-4 font-bold uppercase outline focus:outline-dashed"
        >
          View All Speakers
        </Link>
      </div>
      {selectedSpeaker && (
        <SpeakerModal speaker={selectedSpeaker} onClose={closeSpeaker} />
      )}
    </>
  );
}

export default SpeakerList;
