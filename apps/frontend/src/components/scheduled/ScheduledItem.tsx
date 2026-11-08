import type { SCHEDULED_HIGHLIGHTS_QUERY_RESULT } from "@repo/sanity";
import { cn } from "cn";
import { useState } from "react";

export type ScheduledItemData = SCHEDULED_HIGHLIGHTS_QUERY_RESULT[number];

type ScheduledItemProps = {
  schedule: ScheduledItemData;
};

function ScheduledItem({ schedule }: ScheduledItemProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
        className="flex w-full flex-col gap-3 p-6"
        style={{
          backgroundColor: schedule.track.color,
        }}
      >
        <div className="flex w-full flex-col gap-2">
          <span className="text-chakra-preset-2 text-dev-neutral-900 font-bold">
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
        <div className={cn("block", isDetailsOpen && "hidden")}>
          <button
            onClick={handleIsDetailOpen}
            className="font-jetbrains-mono text-preset-7 text-dev-neutral-600 flex cursor-pointer uppercase"
          >
            <img src="/icons/icon-plus.svg" alt="icon plus" />
            <span>Show Details</span>
          </button>
        </div>
        {isDetailsOpen && (
          <div>
            <p className="text-preset-6 font-jetbrains-mono text-dev-neutral-900">
              {schedule.description}
            </p>
            <p className="font-jetbrains-mono text-preset-6 text-dev-neutral-900 mt-3 font-medium uppercase">
              Location: {schedule.location}
            </p>
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
          <button className="bg-dev-neutral-900 flex size-8 cursor-pointer items-center justify-center rounded-full">
            <img src="/icons/icon-star-empty.svg" alt="icon star empty" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduledItem;
