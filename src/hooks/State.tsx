import { create } from "zustand";
import { persist } from "zustand/middleware";

interface useGameTypes {
  start: boolean;
  setStart: (value: boolean) => void;
  settings: {
    id: number;
    text: string;
    value: boolean;
    action: () => void;
  }[];
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
          action: () =>
            set((state) => {
              const settings = state.settings.map((e) =>
                e.id === 1 ? { ...e, value: !e.value } : e
              );
              return {
                settings,
              };
            }),
        },
        {
          id: 2,
          text: "Sounds",
          value: true,
          action: () =>
            set((state) => {
              const settings = state.settings.map((e) =>
                e.id === 2 ? { ...e, value: !e.value } : e
              );
              return {
                settings,
              };
            }),
        },
        {
          id: 3,
          text: "Post Processing",
          value: true,
          action: () =>
            set((state) => {
              const settings = state.settings.map((e) =>
                e.id === 3 ? { ...e, value: !e.value } : e
              );
              return {
                settings,
              };
            }),
        },
      ],
    }),
    {
      name: "game-settings", // name of the item in localStorage
      partialize: (state) => ({ settings: state.settings }), // only store the settings array
    }
  )
);

export default useGame;
