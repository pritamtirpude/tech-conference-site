import { urlFor } from "#/lib/sanity-image";
import { useUIStore } from "#/store";
import type { FEATURED_SPEAKERS_QUERY_RESULT } from "@repo/sanity";
import { cn } from "cn";
import SpeakerModal from "../SpeakerModal";

// Derived from TypeGen so it can't drift from FEATURED_SPEAKERS_QUERY.
export type SpeakerData = FEATURED_SPEAKERS_QUERY_RESULT[number];

type SpeakerItemProps = {
  speaker: SpeakerData;
  index: number;
};

// Literal class names so Tailwind can see them at build time.
const BG_COLORS = [
  "bg-dev-yellow-100",
  "bg-dev-red-100",
  "bg-dev-red-300",
  "bg-dev-cyan-100",
  "bg-dev-purple-100",
  "bg-dev-blue-100",
];

function SpeakerItem({ speaker, index }: SpeakerItemProps) {
  const avatar = speaker.avatar;

  const setIsDialogOpen = useUIStore((state) => state.setIsDialogOpen);
  const isDialogOpen = useUIStore((state) => state.isDialogOpen);

  const onClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      {isDialogOpen && <SpeakerModal onClose={onClose} />}
      <button
        onClick={() => setIsDialogOpen(true)}
        aria-haspopup="dialog"
        className="outline-dev-neutral-600 focus:shadow-dev-1 focus:outline-dev-green-200 flex h-full cursor-pointer flex-col text-left outline focus:outline-dashed"
      >
        {avatar?.asset && (
          <div
            className={cn(
              "bg-[url(/icons/pattern-avatar-bg.svg)] bg-cover bg-center bg-no-repeat",
              // Cycles in list order: stable across server/client renders.
              BG_COLORS[index % BG_COLORS.length],
            )}
          >
            <img
              className="size-full object-cover"
              src={urlFor(avatar.asset).url()}
              alt={speaker.name}
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex flex-col gap-1">
            <span className="text-dev-neutral-100 text-chakra-preset-3 font-semibold lowercase">
              {speaker.name}
            </span>
            <p className="text-dev-neutral-200 font-jetbrains-mono text-preset-6 font-medium uppercase">
              {speaker.role} @{speaker.company}
            </p>
          </div>
          <div className="bg-dev-neutral-600 mt-3 h-px w-full"></div>
          <div className="mt-3">
            <p className="text-dev-green-200 font-jetbrains-mono font-medium">
              {speaker.talk?.title}
            </p>
          </div>
        </div>
      </button>
    </>
  );
}

export default SpeakerItem;
