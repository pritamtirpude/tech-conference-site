import { useMyScheduleStore } from "#/store";
import { cn } from "cn";
import { useState } from "react";

// Only the fields the card renders, so any query that supplies them
// (highlights, a speaker's talk, the keynote) can feed this component.
export type ScheduledItemData = {
  // Optional: some sources (the speaker modal's talk) don't supply it, and
  // those items can't be saved.
  _id?: string;
  title: string;
  description?: string | null;
  location?: string | null;
  day: number;
  startTime: string;
  endTime: string;
  speaker: { name: string; company: string | null };
  track: { name: string; color: string };
};

type ScheduledItemProps = {
  schedule: ScheduledItemData;
  // Set false where the details are shown elsewhere (e.g. the speaker modal).
  showDetails?: boolean;
};

function ScheduledItem({ schedule, showDetails = true }: ScheduledItemProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const isSaved = useMyScheduleStore((state) =>
    schedule._id ? state.savedIds.includes(schedule._id) : false,
  );
  const toggleSaved = useMyScheduleStore((state) => state.toggleSaved);

  const handleIsDetailOpen = () => {
    setIsDetailsOpen((prevState) => !prevState);
  };
  return (
    <div className="outline-dev-neutral-600 flex flex-col items-stretch outline md:flex-row">
      <div className="flex items-center justify-center py-1.5 md:px-2.5">
        <span
          className="font-jetbrains-mono text-preset-6 flex items-center font-medium uppercase [writing-mode:horizontal-tb] md:rotate-180 md:[writing-mode:vertical-rl]"
          style={{
            color: schedule.track.color,
          }}
        >
          {schedule.track.name}
        </span>
      </div>
      <div
        className="flex w-full flex-col justify-center gap-3 p-6"
        style={{
          backgroundColor: schedule.track.color,
        }}
      >
        <div className="flex w-full flex-col gap-2">
          <span className="lg:text-chakra-preset-2 md:text-chakra-tablet-preset-2 text-chakra-mobile-preset-2 text-dev-neutral-900 font-bold lowercase">
            {schedule.title}
          </span>
          <div className="flex items-center gap-2.5">
            <span className="font-jetbrains-mono text-preset-5 text-dev-neutral-900 font-bold uppercase">
              {schedule.speaker.name}
            </span>
            <span className="font-jetbrains-mono text-preset-5 text-dev-neutral-600">
              //
            </span>
            <span className="font-jetbrains-mono text-preset-5 text-dev-neutral-600 uppercase">
              {schedule.speaker.company}
            </span>
          </div>
        </div>
        {showDetails && (
          <div className={cn("block", isDetailsOpen && "hidden")}>
            <button
              onClick={handleIsDetailOpen}
              className="font-jetbrains-mono text-preset-7 text-dev-neutral-600 flex cursor-pointer uppercase"
            >
              <img src="/icons/icon-plus.svg" alt="icon plus" />
              <span>Show Details</span>
            </button>
          </div>
        )}
        {isDetailsOpen && (
          <div>
            {schedule.description && (
              <p className="text-preset-6 font-jetbrains-mono text-dev-neutral-900">
                {schedule.description}
              </p>
            )}
            {schedule.location && (
              <p className="font-jetbrains-mono text-preset-6 text-dev-neutral-900 mt-3 font-medium uppercase">
                Location: {schedule.location}
              </p>
            )}
            <button
              onClick={handleIsDetailOpen}
              className="font-jetbrains-mono text-preset-7 text-dev-neutral-600 mt-3 flex cursor-pointer uppercase"
            >
              <img src="/icons/icon-minus.svg" alt="icon minus" />
              <span>Hide Details</span>
            </button>
          </div>
        )}
      </div>
      <div
        style={{
          backgroundColor: schedule.track.color,
        }}
        className="border-l-dev-neutral-900 flex flex-row items-center justify-between gap-2 border-t-3 border-dashed p-4 md:flex-col md:justify-center md:border-t-0 md:border-l-3"
      >
        <div className="flex flex-col items-center">
          <span className="text-preset-4 font-chakra-petch text-dev-neutral-900 font-bold">
            {schedule.startTime}
          </span>
          <span className="font-jetbrains-mono text-preset-7 text-dev-neutral-900">
            {schedule.endTime}
          </span>
        </div>
        <div>
          <img src="/icons/pattern-barcode.svg" alt="icon barcode" />
        </div>
        <div>
          <span className="font-jetbrains-mono text-preset-7 text-dev-neutral-900 uppercase">
            Day {schedule.day}
          </span>
        </div>
        <div>
          <button
            type="button"
            aria-pressed={isSaved}
            aria-label={
              isSaved ? "Remove from my schedule" : "Add to my schedule"
            }
            disabled={!schedule._id}
            onClick={() => schedule._id && toggleSaved(schedule._id)}
            className="bg-dev-neutral-900 group focus-visible:ring-dev-neutral-900 flex size-8 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-3 disabled:cursor-default"
          >
            {isSaved ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="16"
                fill="none"
                viewBox="0 0 17 16"
              >
                <path
                  fill="#d1ff66"
                  d="M7.464.55c.375-.75 1.438-.718 1.781 0l2.063 4.157 4.562.656c.813.125 1.125 1.125.532 1.72L13.12 10.3l.782 4.531c.125.813-.75 1.438-1.47 1.063L8.37 13.738l-4.093 2.157c-.72.375-1.594-.25-1.47-1.063l.782-4.531L.308 7.082c-.594-.594-.281-1.594.531-1.719l4.594-.656z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="16"
                fill="none"
                viewBox="0 0 17 16"
                className="group-hover:text-dev-green-200 text-dev-neutral-100 transition-colors"
              >
                <path
                  fill="currentColor"
                  d="M15.87 5.363c.813.125 1.125 1.125.532 1.72L13.12 10.3l.782 4.531c.125.813-.75 1.438-1.47 1.063L8.37 13.738l-4.093 2.157c-.72.375-1.594-.25-1.47-1.063l.782-4.531L.308 7.082c-.594-.594-.281-1.594.531-1.719l4.594-.656L7.464.551c.375-.75 1.438-.719 1.781 0l2.063 4.156zM11.495 9.77l3.157-3.063-4.344-.625L8.37 2.145 6.402 6.082l-4.344.625L5.214 9.77l-.75 4.312 3.906-2.031 3.875 2.031z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduledItem;
