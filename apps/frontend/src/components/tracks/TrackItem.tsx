import { Link } from "@tanstack/react-router";
import { cn } from "cn";

export type TrackItemData = {
  _id: string;
  name: string;
  description?: string;
  color: string;
};

type TrackItemProps = {
  trackItemData: TrackItemData;
};

function TrackItem({ trackItemData }: TrackItemProps) {
  return (
    <Link
      to="/schedule"
      className={cn(
        `outline-dev-neutral-100 shadow-dev-2 focus:outline-dev-green-200 focus:shadow-dev-1 inline-block h-full w-full px-5 py-4 outline focus:outline-dashed`,
      )}
    >
      <span
        style={{
          color: trackItemData.color,
        }}
        className={cn(`text-chakra-preset-3 lowercase`)}
      >
        {trackItemData.name}
      </span>
      <p className="font-jetbrains-mono text-dev-neutral-200 text-preset-6 mt-1.5 font-medium uppercase">
        {trackItemData.description}
      </p>
    </Link>
  );
}

export default TrackItem;
