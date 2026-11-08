import useClickOutside from "#/hooks/useClickOutside";
import { useEffect } from "react";

type SpeakerModalProps = {
  onClose: () => void;
};

function SpeakerModal({ onClose }: SpeakerModalProps) {
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
      ></dialog>
    </>
  );
  return <div>SpeakerModal</div>;
}

export default SpeakerModal;
