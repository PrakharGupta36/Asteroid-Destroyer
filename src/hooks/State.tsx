import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Setting {
  id: number;
  category: "general" | "sound" | "graphics";
  text: string;
  value: boolean;
}

interface useGameTypes {
  start: boolean;
  setStart: (value: boolean) => void;

  settings: Setting[];
  setSettings: (id: number, value: boolean) => void;

  pause: boolean;
  setPause: (value: boolean) => void;

  isIntroAnimationFinish: boolean;
  setIsIntroAnimationFinish: (value: boolean) => void;

  currentLevel: number;
  setCurrentLevel: (value: number) => void;

  showStory: boolean;
  setShowStory: (value: boolean) => void;

  countdown: number;
  setCountdown: (updater: number | ((prev: number) => number)) => void;

  overlay: boolean;
  setOverlay: (value: boolean) => void;

  spaceshipHealth: number;
  setSpaceshipHealth: () => void;

  asteroidDestroyed: number;
  setAsteroidDestroyed: (value: number) => void;

  isOverAsteroid: boolean;
  setIsOverAsteroid: (value: boolean) => void;

  isGameCompleted: boolean;
  setIsGameCompleted: (value: boolean) => void;

  isSpaceshipHit: boolean;
  setIsSpaceshipHit: (value: boolean) => void;

  reset: () => void;
}

const useGame = create<useGameTypes>()(
  persist(
    (set) => ({
      start: false,
      setStart: (value: boolean) => set(() => ({ start: value })),

      settings: [
        { id: 1, category: "sound", text: "Music", value: false },
        { id: 2, category: "sound", text: "Sounds", value: true },

        { id: 3, category: "graphics", text: "Bloom", value: true },
        { id: 4, category: "graphics", text: "Noise", value: false },

        { id: 5, category: "general", text: "Restart", value: false },
        { id: 6, category: "graphics", text: "Vignette", value: true },
        { id: 7, category: "graphics", text: "Contrast", value: false },
        { id: 8, category: "graphics", text: "Saturation", value: false },
        { id: 9, category: "graphics", text: "Glitch Effect", value: true },
        { id: 10, category: "graphics", text: "Scanline Effect", value: true },
      ],

      setSettings: (id: number, value: boolean) =>
        set((state) => ({
          settings: state.settings.map((setting) =>
            setting.id === id ? { ...setting, value } : setting
          ),
        })),

      pause: false,
      setPause: (value: boolean) => set({ pause: value }),

      isIntroAnimationFinish: false,
      setIsIntroAnimationFinish: (value: boolean) =>
        set({ isIntroAnimationFinish: value }),

      currentLevel: 1,
      setCurrentLevel: (value: number) => set(() => ({ currentLevel: value })),

      showStory: true,
      setShowStory: (value: boolean) =>
        set(() => ({
          showStory: value,
        })),

      countdown: 5,
      setCountdown: (value: number | ((prev: number) => number)) =>
        set((state) => ({
          countdown:
            typeof value === "function" ? value(state.countdown) : value,
        })),

      overlay: false,
      setOverlay: (value: boolean) => set(() => ({ overlay: value })),

      asteroidDestroyed: 0,
      setAsteroidDestroyed: (value: number) =>
        set(() => ({ asteroidDestroyed: value })),

      spaceshipHealth: 100,
      setSpaceshipHealth: () =>
        set((state) => ({ spaceshipHealth: state.spaceshipHealth - 10 })),

      isOverAsteroid: false,
      setIsOverAsteroid: (value: boolean) => set({ isOverAsteroid: value }),

      isGameCompleted: false,
      setIsGameCompleted: (value: boolean) => set({ isGameCompleted: value }),

      isSpaceshipHit: false,
      setIsSpaceshipHit: (value: boolean) => set({ isSpaceshipHit: value }),

      reset: () =>
        set(() => ({
          start: true,
          isGameCompleted: false,
          spaceshipHealth: 100,
          asteroidDestroyed: 0,
          countdown: 0,
          currentLevel: 1,
          showStory: true,
          overlay: false,
        })),
    }),

    {
      name: "game-settings-----15",
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);

export default useGame;
