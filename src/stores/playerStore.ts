import { create } from "zustand";

type PlayerState = {
  isPlaying: boolean;
  positionSeconds: number;
  durationSeconds: number;
  playbackRate: number;
  volume: number;
  isFullscreen: boolean;
  captionsOn: boolean;
  quality: "auto" | "1080p" | "720p" | "480p";
  setPlaying: (isPlaying: boolean) => void;
  setPosition: (positionSeconds: number) => void;
  setDuration: (durationSeconds: number) => void;
  // Drift correction nudges playback rate within ±0.05x instead of seeking,
  // so convergence to the server-authoritative clock never causes a visible jump.
  nudgeRate: (rate: number) => void;
  resetRate: () => void;
  setVolume: (volume: number) => void;
  toggleFullscreen: () => void;
  toggleCaptions: () => void;
  setQuality: (quality: PlayerState["quality"]) => void;
  reset: () => void;
};

const MAX_DRIFT_RATE = 0.05;

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  positionSeconds: 0,
  durationSeconds: 0,
  playbackRate: 1,
  volume: 1,
  isFullscreen: false,
  captionsOn: false,
  quality: "auto",

  setPlaying: (isPlaying) => set({ isPlaying }),
  setPosition: (positionSeconds) => set({ positionSeconds }),
  setDuration: (durationSeconds) => set({ durationSeconds }),

  nudgeRate: (rate) =>
    set({ playbackRate: Math.min(1 + MAX_DRIFT_RATE, Math.max(1 - MAX_DRIFT_RATE, rate)) }),
  resetRate: () => set({ playbackRate: 1 }),

  setVolume: (volume) => set({ volume }),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  toggleCaptions: () => set((state) => ({ captionsOn: !state.captionsOn })),
  setQuality: (quality) => set({ quality }),

  reset: () =>
    set({
      isPlaying: false,
      positionSeconds: 0,
      durationSeconds: 0,
      playbackRate: 1,
      isFullscreen: false,
    }),
}));
