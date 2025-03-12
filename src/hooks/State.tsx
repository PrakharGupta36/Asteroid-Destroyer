import { create } from "zustand";

interface useGameTypes {
  start: boolean;
  setStart: (value: boolean) => void;
}

const useGame = create<useGameTypes>((set) => ({
  start: false,
  setStart: (value: boolean) => set(() => ({ start: value })),
}));

export default useGame;
