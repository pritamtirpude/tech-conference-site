import HeroSection from "#/components/HeroSection";
import Tracks from "#/components/tracks";
import { conferenceQueryOptions } from "#/queries/get-conference";
import { featuredSpeakersQueryOptions } from "#/queries/get-speakers";
import { tracksQueryOptions } from "#/queries/get-tracks";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.query(featuredSpeakersQueryOptions()),
      context.queryClient.query(conferenceQueryOptions()),
      context.queryClient.query(tracksQueryOptions()),
    ]);
  },
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      {/* Tracks Section */}
      <Tracks />
    </>
  );
}
