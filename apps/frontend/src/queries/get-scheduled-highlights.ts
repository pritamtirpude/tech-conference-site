import { sanityClient } from "#/lib/sanity.server";
import { SCHEDULED_HIGHLIGHTS_QUERY } from "@repo/sanity";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

const getScheduledHighlights = createServerFn({
  method: "GET",
}).handler(() => sanityClient.fetch(SCHEDULED_HIGHLIGHTS_QUERY));

export const scheduledHighlightsQueryOptions = () =>
  queryOptions({
    queryKey: ["scheduled_highlights"],
    queryFn: () => getScheduledHighlights(),
  });
