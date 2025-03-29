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

  spaceshipHealth: number;
  setSpaceshipHealth: () => void;
  resetSpaceShipHealth: () => void;

  isOverAsteroid: boolean;
  setIsOverAsteroid: (value: boolean) => void;
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

      spaceshipHealth: 100,
      setSpaceshipHealth: () =>
        set((state) => ({ spaceshipHealth: state.spaceshipHealth - 10 })),
      resetSpaceShipHealth: () =>
        set(() => ({
          spaceshipHealth: 100,
        })),

      isOverAsteroid: false,
      setIsOverAsteroid: (value: boolean) => set({ isOverAsteroid: value }),
    }),

    {
      name: "game-settings-----05",
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);

export default useGame;
