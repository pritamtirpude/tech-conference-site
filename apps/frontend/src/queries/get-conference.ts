import { CONFERENCE_QUERY } from "@repo/sanity";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { sanityClient } from "../lib/sanity.server";

const getConference = createServerFn({
  method: "GET",
}).handler(() => sanityClient.fetch(CONFERENCE_QUERY));

export const conferenceQueryOptions = () =>
  queryOptions({
    queryKey: ["conference"],
    queryFn: () => getConference(),
  });
