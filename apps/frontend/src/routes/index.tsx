import { urlFor } from "#/lib/sanity-image";
import { conferenceQueryOptions } from "#/queries/get-conference";
import { featuredSpeakersQueryOptions } from "#/queries/get-speakers";
import { formatDate } from "#/utils/formatDates/formatDate";
import { formatDateRange } from "#/utils/formatDates/formatDateRange";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.query(featuredSpeakersQueryOptions()),
      context.queryClient.query(conferenceQueryOptions()),
    ]);
  },
  component: Home,
});

function Home() {
  const { data: conferenceData } = useSuspenseQuery(conferenceQueryOptions());
  const speaker = conferenceData?.keynote?.speaker;
  const avatar = speaker?.avatar;

  return (
    <>
      {/* Hero Section */}
      <section className="flex flex-col gap-8 xl:flex-row">
        <div className="bg-dev-neutral-100 px-8 py-5">
          <h1 className="md:text-chakra-preset-1 text-chakra-mobile-preset-1 font-bold">
            {conferenceData?.tagline}
          </h1>
          <div className="relative -top-4 flex items-center justify-center md:-top-12">
            <img src="/icons/bg-horizon-text.svg" alt="horizon text" />
          </div>

          <div className="mt-6.5 md:mt-15 lg:mt-20">
            <div className="bg-dev-neutral-900 h-0.5 w-full" />
            <div className="mt-4 flex items-center justify-between">
              <span className="font-jetbrains-mono text-preset-6 uppercase">
                {conferenceData &&
                  formatDateRange(
                    conferenceData.startDate,
                    conferenceData.endDate,
                  )}
              </span>
              <span className="font-jetbrains-mono text-preset-6 uppercase">
                {conferenceData?.location?.venue},{" "}
                {conferenceData?.location?.cityAbbreviation}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-dev-cyan-100 overflow-hidden md:flex">
          <div className="flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-4">
              <div>
                <span className="font-jetbrains-mono text-preset-6 text-dev-neutral-900 uppercase">
                  // Featured Keynote
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-chakra-preset-2 font-bold lowercase">
                  {conferenceData?.keynote?.speaker.name}
                </h2>
                <p className="font-jetbrains-mono text-preset-6 text-dev-neutral-600 font-medium uppercase">
                  {conferenceData?.keynote?.speaker.role}
                  <br />@{conferenceData?.keynote?.speaker.company}
                </p>
              </div>
            </div>

            <div className="my-[43.5px] flex flex-col gap-2">
              <div>
                <h3 className="text-preset-5 font-jetbrains-mono text-dev-neutral-900 font-bold uppercase">
                  {conferenceData?.keynote?.title}
                </h3>
              </div>
              <div>
                <span className="text-preset-6 font-jetbrains-mono text-dev-neutral-600 font-medium uppercase">
                  {conferenceData && formatDate(conferenceData.startDate)} /{" "}
                  {conferenceData?.keynote?.startTime} /{" "}
                  {conferenceData?.keynote?.location}
                </span>
              </div>
            </div>

            <div className="mt-auto">
              <button className="text-preset-5 outline-dev-neutral-900 font-jetbrains-mono shadow-dev-3 flex w-full cursor-pointer items-center justify-center gap-3 px-6 py-4 font-bold uppercase outline md:w-auto">
                View Talk{" "}
                <img src="/icons/icon-arrow-right.svg" alt="icon arrow right" />
              </button>
            </div>
          </div>

          {avatar?.asset && (
            <div className="relative hidden md:block xl:-right-15">
              <img
                className="size-full object-cover"
                src={urlFor(avatar).url()}
                alt={avatar.alt ?? speaker?.name ?? ""}
                width={400}
                height={400}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
