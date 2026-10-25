import SpeakerList from "./SpeakerList";

function FeaturedSpeakers() {
  return (
    <section className="mt-11.25">
      <span className="text-dev-green-200 font-jetbrains-mono text-preset-6 font-extrabold uppercase">
        // Featured_Speakers
      </span>
      {/* Speakers List */}
      <SpeakerList />
    </section>
  );
}

export default FeaturedSpeakers;
