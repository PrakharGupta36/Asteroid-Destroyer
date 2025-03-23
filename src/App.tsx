import { useEffect, useState, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useGame from "./hooks/State";
import Spinner  from "./components/ui/spinner";

const Game = lazy(() => import("./pages/Game"));
const Intro = lazy(() => import("./pages/Intro"));

export default function App() {
  const { start } = useGame();
  const [allowed, setAllowed] = useState<null | boolean>(null);

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
          This <span className='line-through'>website</span> game requires a
          mouse and a keyboard.
        </p>
      </main>
    );
  }

  return (
    <main className='grid place-items-center w-[100dvw] h-[100dvh]'>
      <AnimatePresence mode='wait'>
        <Suspense fallback={<Spinner size={"large"} />}>
          {start ? (
            <motion.div
              key='game'
              className='game'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.25, ease: "anticipate" }}
            >
              <Game />
            </motion.div>
          ) : (
            <motion.div
              key='intro'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.25, ease: "anticipate" }}
            >
              <Intro />
            </motion.div>
          )}
        </Suspense>
      </AnimatePresence>
    </main>
  );
}
