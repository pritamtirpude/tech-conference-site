import { create } from "zustand";
import type { SpeakerData } from "#/components/featured_speakers/SpeakerItem";

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
