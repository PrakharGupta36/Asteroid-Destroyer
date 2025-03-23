import { useEffect, useState, useRef, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useGame from "./hooks/State";
import Spinner from "./components/ui/spinner";

const Game = lazy(() => import("./pages/Game"));
const Intro = lazy(() => import("./pages/Intro"));

export default function App() {
  const { start, settings } = useGame();
  const [allowed, setAllowed] = useState<null | boolean>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const hasMouse = window.matchMedia("(pointer: fine)").matches;
    const hasKeyboard = "onkeydown" in window;
    setAllowed(hasMouse && hasKeyboard);
  }, []);

  useEffect(() => {
    const enableAudio = () => {
      if (!musicRef.current) {
        musicRef.current = new Audio("/sounds/music.mp3");
        musicRef.current.loop = true;
        musicRef.current.volume = 0.25;
      }

      if (settings[0].value) {
        musicRef.current
          .play()
          .catch((err) => console.warn("Autoplay blocked:", err));
      } else {
        musicRef.current.pause();
      }

      document.removeEventListener("click", enableAudio);
    };

    document.addEventListener("click", enableAudio, { once: true });

    return () => document.removeEventListener("click", enableAudio);
  }, [settings]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (musicRef.current) {
        if (document.hidden) {
          musicRef.current.pause();
        } else if (settings[0].value) {
          musicRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [settings]);

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
