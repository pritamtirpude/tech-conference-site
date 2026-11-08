import { scheduledHighlightsQueryOptions } from "#/queries/get-scheduled-highlights";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import ScheduledItem from "./ScheduledItem";

function ScheduleList() {
  const { data: scheduledHighligthsData } = useSuspenseQuery(
    scheduledHighlightsQueryOptions(),
  );

  return (
    <>
      <ul className="mt-6 flex flex-col items-stretch gap-4">
        {scheduledHighligthsData.map((schedule) => (
          <li key={schedule._id}>
            <ScheduledItem schedule={schedule} />
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-center">
        <Link
          to="/speakers"
          className="text-dev-neutral-100 font-jetbrains-mono focus:outline-dev-green-200 focus:shadow-dev-1 shadow-dev-2 text-preset-5 outline-dev-neutral-100 mt-12 px-6 py-4 font-bold uppercase outline focus:outline-dashed"
        >
          View Full Schedule
        </Link>
      </div>
    </>
  );
}

export default ScheduleList;
