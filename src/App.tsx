import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useGame from "./hooks/State";
import Game from "./pages/Game";
import Intro from "./pages/Intro";

export default function App() {
  const { start } = useGame();
  const [allowed, setAllowed] = useState<null | boolean>(null); // Start with null

  useEffect(() => {
    const hasMouse = window.matchMedia("(pointer: fine)").matches;
    const hasKeyboard = "onkeydown" in window;

    setAllowed(hasMouse && hasKeyboard);
  }, []);

  if (allowed === null) return null;

  if (!allowed) {
    return (
      <main className='grid place-items-center w-[100dvw] h-[100dvh] bg-[#1d1d1d]'>
        <p className='text-white text-center'>
          This <span className='line-through'> website</span> game requires a
          mouse and keyboard.
        </p>
      </main>
    );
  }

  return (
    <main className='grid place-items-center w-[100dvw] h-[100dvh]'>
      <AnimatePresence mode='wait'>
        {start ? (
          <motion.div
            key='game'
            className='game'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Game />
          </motion.div>
        ) : (
          <motion.div
            key='intro'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Intro />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
