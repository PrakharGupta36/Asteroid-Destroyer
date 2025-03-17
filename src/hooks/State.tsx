import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Setting {
  id: number;
  category: "sound" | "graphics";
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
}

const useGame = create<useGameTypes>()(
  persist(
    (set) => ({
      start: false,
      setStart: (value: boolean) => set(() => ({ start: value })),

      settings: [
        // 🎵 Sound Settings
        { id: 1, category: "sound", text: "Music", value: false },
        { id: 2, category: "sound", text: "Sounds", value: true },

        // 🎨 Graphics Settings
        { id: 3, category: "graphics", text: "Bloom", value: true },
        { id: 4, category: "graphics", text: "Vignette", value: true },
        { id: 5, category: "graphics", text: "Noise", value: true },
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
    }),

    {
      name: "game-settings-----01",
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);

export default useGame;
