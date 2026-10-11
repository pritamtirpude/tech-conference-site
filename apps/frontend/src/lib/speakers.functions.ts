import { FEATURED_SPEAKERS_QUERY } from "@repo/sanity";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { sanityClient } from "./sanity.server";

// Runs on the server only; in the client bundle this becomes an RPC stub.
// The return type comes from TypeGen (FEATURED_SPEAKERS_QUERY_RESULT).
export const getFeaturedSpeakers = createServerFn({ method: "GET" }).handler(
  () => sanityClient.fetch(FEATURED_SPEAKERS_QUERY),
);

// Shared by the route loader (ensureQueryData) and the component
// (useSuspenseQuery) so both hit the same cache entry.
export const featuredSpeakersQueryOptions = () =>
  queryOptions({
    queryKey: ["speakers", "featured"],
    queryFn: () => getFeaturedSpeakers(),
  });
