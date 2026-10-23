import { tracksQueryOptions } from "#/queries/get-tracks";
import { useSuspenseQuery } from "@tanstack/react-query";
import TrackItem from "./TrackItem";

function TrackList() {
  const { data: tracksData } = useSuspenseQuery(tracksQueryOptions());

  return (
    <ul className="mt-6 grid w-full items-stretch gap-4 md:grid-cols-2 lg:grid-cols-4">
      {tracksData.map((track) => (
        <li className="w-full cursor-pointer" key={track._id}>
          <TrackItem trackItemData={track} />
        </li>
      ))}
    </ul>
  );
}

export default TrackList;
