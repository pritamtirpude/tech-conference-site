import { FEATURED_SPEAKERS_QUERY, GET_ALL_SPEAKERS_QUERY } from "@repo/sanity";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { sanityClient } from "../lib/sanity.server";

export const getFeaturedSpeakers = createServerFn({ method: "GET" }).handler(
  () => sanityClient.fetch(FEATURED_SPEAKERS_QUERY),
);

export const getAllSpeakers = createServerFn({ method: "GET" }).handler(() =>
  sanityClient.fetch(GET_ALL_SPEAKERS_QUERY),
);

export const featuredSpeakersQueryOptions = () =>
  queryOptions({
    queryKey: ["speakers", "featured"],
    queryFn: () => getFeaturedSpeakers(),
  });

export const allSpeakersQueryOptions = () =>
  queryOptions({
    queryKey: ["speakers", "all"],
    queryFn: () => getAllSpeakers(),
  });
