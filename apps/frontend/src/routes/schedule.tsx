import ScheduledItem from "#/components/scheduled/ScheduledItem";
import { allSchedulesQueryOptions } from "#/queries/get-scheduled-highlights";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { cn } from "cn";
import { useState } from "react";
import { useMyScheduleStore } from "#/store";

const DAYS = [1, 2, 3];
const Tracks = [
  {
    label: "Frontend",
    value: "Frontend",
  },
  {
    label: "Performance",
    value: "Performance",
  },
  {
    label: "A11Y",
    value: "Accessibility",
  },
  {
    label: "Tooling",
    value: "Tooling",
  },
];

type ScheduleSearch = {
  day?: number;
  track?: string;
};

export const Route = createFileRoute("/schedule")({
  // Invalid or unknown values are treated as "no filter" so stale shared
  // links still render the full schedule instead of an error.
  validateSearch: (search: Record<string, unknown>): ScheduleSearch => {
    const day = Number(search.day);
    return {
      day: DAYS.includes(day) ? day : undefined,
      track:
        typeof search.track === "string" && search.track !== ""
          ? search.track
          : undefined,
    };
  },
  loader: async ({ context }) => {
    await context.queryClient.query(allSchedulesQueryOptions());
  },
  component: Schedules,
});

function Schedules() {
  const { data: allSchedules } = useSuspenseQuery(allSchedulesQueryOptions());
  const { day, track } = Route.useSearch();
  // Local state, not URL: saved ids live in this browser only, so a shared
  // link with this filter would show another user an empty list.
  const [mySchedule, setMySchedule] = useState(false);
  const savedIds = useMyScheduleStore((state) => state.savedIds);
  const navigate = Route.useNavigate();

  const schedulesData = allSchedules.filter(
    (schedule) =>
      (day === undefined || schedule.day === day) &&
      (track === undefined || schedule.track.name === track) &&
      (!mySchedule || savedIds.includes(schedule._id)),
  );

  // Clicking the active day clears it; undefined values are dropped from the URL.
  const toggleDay = (selected: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        day: prev.day === selected ? undefined : selected,
      }),
    });
  };

  const toggleTrack = (selected: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        track: prev.track === selected ? undefined : selected,
      }),
    });
  };

  const toggleMySchedule = () => setMySchedule((prev) => !prev);

  // Resets every filter. Saved stars stay in localStorage.
  const clearFilters = () => {
    setMySchedule(false);
    navigate({ search: {} });
  };

  return (
    <section>
      <h1 className="text-dev-green-200 text-chakra-mobile-preset-2 lg:text-chakra-preset-2 md:text-chakra-tablet-preset-2 lowercase">
        // Schedule
      </h1>

      <div className="mt-6 flex items-center gap-2.5">
        <div className="flex items-center gap-2.5">
          {DAYS.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={day === d}
              onClick={() => toggleDay(d)}
              className={cn(
                "hover:text-dev-green-200 hover:outline-dev-green-200 focus-visible:shadow-dev-1 font-jetbrains-mono text-preset-6 focus-visible:outline-dev-green-200 cursor-pointer px-4 py-2 font-medium uppercase outline transition-colors duration-200 focus-visible:outline-dashed",
                day === d
                  ? "bg-dev-green-200 focus-visible:shadow-dev-1 text-dev-neutral-900 hover:text-dev-neutral-900 outline-dev-green-200 outline-0 focus-visible:outline-hidden"
                  : "outline-dev-neutral-100 text-dev-neutral-100 hover:shadow-dev-1",
              )}
            >
              Day {String(d).padStart(2, "0")}
            </button>
          ))}
        </div>
        <div className="bg-dev-neutral-500 h-6 w-px" />

        <div className="flex items-center gap-2.5">
          {Tracks.map((trackItem) => (
            <button
              key={trackItem.value}
              type="button"
              aria-pressed={track === trackItem.value}
              onClick={() => toggleTrack(trackItem.value)}
              className={cn(
                "font-jetbrains-mono text-preset-6 focus-visible:outline-dev-green-200 focus-visible:shadow-dev-1 cursor-pointer rounded-full px-4 py-2 font-medium uppercase outline transition-colors duration-200 focus-visible:outline-dashed",
                track === trackItem.value
                  ? "bg-dev-green-200 text-dev-neutral-900 outline-dev-green-200"
                  : "outline-dev-neutral-500 text-dev-neutral-100 hover:text-dev-green-200 hover:outline-dev-green-200",
              )}
            >
              {trackItem.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-pressed={!!mySchedule}
            onClick={toggleMySchedule}
            className={cn(
              "font-jetbrains-mono text-preset-6 outline-dev-green-200 hover:shadow-dev-1 focus-visible:shadow-dev-1 cursor-pointer rounded-full px-4 py-2 font-medium uppercase transition-colors duration-200 outline-dashed focus-visible:outline-solid",
              mySchedule
                ? "bg-dev-green-200 text-dev-neutral-900"
                : "text-dev-green-200",
            )}
          >
            My Schedule
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="font-jetbrains-mono text-preset-6 text-dev-red-300 outline-dev-red-300 hover:shadow-dev-5 focus-visible:shadow-dev-5 cursor-pointer rounded-full px-4 py-2 font-medium uppercase outline transition-colors duration-200 focus-visible:outline-dashed"
          >
            clear
          </button>
        </div>
      </div>

      <div className="bg-dev-neutral-500 mt-6 h-px w-full" />

      <ul className="mt-6 flex flex-col gap-4">
        {schedulesData.map((schedule) => (
          <li key={schedule._id}>
            <ScheduledItem schedule={schedule} />
          </li>
        ))}
      </ul>
    </section>
  );
}
