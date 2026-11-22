import { sanityClient } from "#/lib/sanity.server";
import { ALL_SCHEDULES_QUERY, SCHEDULED_HIGHLIGHTS_QUERY } from "@repo/sanity";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

const getScheduledHighlights = createServerFn({
  method: "GET",
}).handler(() => sanityClient.fetch(SCHEDULED_HIGHLIGHTS_QUERY));

const getAllSchedules = createServerFn({
  method: "GET",
}).handler(() => sanityClient.fetch(ALL_SCHEDULES_QUERY));

export const allSchedulesQueryOptions = () =>
  queryOptions({
    queryKey: ["schedules", "all"],
    queryFn: () => getAllSchedules(),
  });

export const scheduledHighlightsQueryOptions = () =>
  queryOptions({
    queryKey: ["scheduled_highlights"],
    queryFn: () => getScheduledHighlights(),
  });
