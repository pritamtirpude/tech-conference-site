import useClickOutside from "#/hooks/useClickOutside";
import { urlFor } from "#/lib/sanity-image";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { SpeakerData } from "./featured_speakers/SpeakerItem";
import ScheduledItem from "./scheduled/ScheduledItem";

type SpeakerModalProps = {
  onClose: () => void;
  speaker: SpeakerData;
};

function SpeakerModal({ onClose, speaker }: SpeakerModalProps) {
  const ref = useClickOutside<HTMLDialogElement>(onClose);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    dialog.showModal();
    return () => dialog.close();
  }, [ref]);

  const modal = (
    <>
      <div className="bg-dev-neutral-900/80 fixed top-0 left-0 z-40 size-full backdrop-blur-sm" />

      <dialog
        onCancel={(event) => {
          event.preventDefault();
          onClose();
        }}
        ref={ref}
        className="bg-dev-neutral-900 outline-dev-neutral-500 fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 px-4 py-5 outline md:px-6 md:py-8 lg:p-10"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div
            style={{
              backgroundColor: speaker.talk?.track.color,
            }}
            className="w-38 bg-[url(/icons/pattern-avatar-bg.svg)] bg-cover bg-center bg-no-repeat"
          >
            {speaker.avatar?.asset && (
              <img
                src={urlFor(speaker.avatar.asset).url()}
                alt={speaker.name}
                width={152}
                height={120}
              />
            )}
          </div>
          <div>
            <span className="text-chakra-preset-3 text-dev-neutral-100 inline-block font-semibold lowercase">
              {speaker.name}
            </span>
            <p className="font-jetbrains-mono text-preset-6 text-dev-neutral-200 font-medium uppercase">
              {speaker.role} {"@"}
              {speaker.company}
            </p>
          </div>
        </div>
        <div className="border-dev-neutral-600 mt-5 border-t border-b py-5">
          <p className="font-jetbrains-mono text-preset-6 text-dev-neutral-200">
            {speaker.talk?.description}
          </p>
        </div>
        <div className="mt-5">
          <span className="font-jetbrains-mono text-dev-green-200 inline-block font-bold uppercase">
            // Talk
          </span>
          {speaker.talk && (
            <div className="mt-5">
              <ScheduledItem
                showDetails={false}
                schedule={{
                  ...speaker.talk,
                  speaker: { name: speaker.name, company: speaker.company },
                }}
              />
            </div>
          )}
        </div>
        <div className="absolute top-5 right-5">
          <button
            className="outline-dev-neutral-100 cursor-pointer p-2.5 outline"
            onClick={onClose}
          >
            <img src="/icons/icon-cross.svg" alt="icon cross" />
          </button>
        </div>
      </dialog>
    </>
  );
  return typeof document === "undefined"
    ? null
    : createPortal(modal, document.body);
}

export default SpeakerModal;
