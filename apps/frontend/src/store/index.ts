import type { SpeakerData } from "#/components/featured_speakers/SpeakerItem";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UIStateType = {
  // null = modal closed. One source of truth: no separate boolean to sync.
  selectedSpeaker: SpeakerData | null;
  openSpeaker: (speaker: SpeakerData) => void;
  closeSpeaker: () => void;
};

export const useUIStore = create<UIStateType>((set) => ({
  selectedSpeaker: null,
  openSpeaker: (selectedSpeaker) => set({ selectedSpeaker }),
  closeSpeaker: () => set({ selectedSpeaker: null }),
}));

type MyScheduleStateType = {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  clearSaved: () => void;
};

// Persisted to localStorage; only the ids are stored so the data itself
// always comes fresh from Sanity.
export const useMyScheduleStore = create<MyScheduleStateType>()(
  persist(
    (set) => ({
      savedIds: [],
      toggleSaved: (id) =>
        set((state) => ({
          savedIds: state.savedIds.includes(id)
            ? state.savedIds.filter((savedId) => savedId !== id)
            : [...state.savedIds, id],
        })),
      clearSaved: () => set({ savedIds: [] }),
    }),
    { name: "my-schedule", skipHydration: true },
  ),
);
