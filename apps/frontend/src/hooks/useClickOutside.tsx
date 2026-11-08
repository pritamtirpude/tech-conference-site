import { useEffect, useRef } from "react";

function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      if (!el.contains(event.target as Node)) {
        callback();
        return;
      }

      if (el instanceof HTMLDialogElement && event.target === el) {
        const rect = el.getBoundingClientRect();
        const clickedInside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        if (!clickedInside) {
          callback();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
}

export default useClickOutside;
