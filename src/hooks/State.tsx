import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Setting {
  id: number;
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
}

const useGame = create<useGameTypes>()(
  persist(
    (set) => ({
      start: false,
      setStart: (value: boolean) => set(() => ({ start: value })),
      settings: [
        {
          id: 1,
          text: "Music",
          value: false,
        },
        {
          id: 2,
          text: "Sounds",
          value: true,
        },
        {
          id: 3,
          text: "Post Processing",
          value: true,
        },
      ],
      setSettings: (id: number, value: boolean) =>
        set((state) => ({
          settings: state.settings.map((setting) =>
            setting.id === id ? { ...setting, value } : setting
          ),
        })),
      pause: false,
      setPause: (value: boolean) => set({ pause: value }),
    }),

    {
      name: "game-settings",
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);

export default useGame;
