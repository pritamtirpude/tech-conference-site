import { sanityClient } from "#/lib/sanity.server";
import { TRACKS_QUERY } from "@repo/sanity";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

const getTracks = createServerFn({
  method: "GET",
}).handler(() => sanityClient.fetch(TRACKS_QUERY));

export const tracksQueryOptions = () =>
  queryOptions({
    queryKey: ["tracks"],
    queryFn: () => getTracks(),
  });
