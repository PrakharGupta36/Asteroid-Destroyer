import { useEffect, useState, useRef, Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";
import useGame from "./hooks/State";
import Spinner from "./components/ui/spinner";
import GameOver from "./components/ux/GameOver";

// Lazy load pages
const Game = lazy(() => import("./pages/Game"));
const Intro = lazy(() => import("./pages/Intro"));

export default function App() {
  const { start, settings, setPause, spaceshipHealth, resetSpaceShipHealth } =
    useGame();
  const [allowed, setAllowed] = useState<null | boolean>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const hasMouse = window.matchMedia("(pointer: fine)").matches;
    const hasKeyboard = "onkeydown" in window;
    const newAllowed = hasMouse && hasKeyboard;

    if (allowed !== newAllowed) {
      setAllowed(newAllowed);
    }
  }, [allowed]);

  useEffect(() => {
    const enableAudio = () => {
      if (!musicRef.current) {
        musicRef.current = new Audio("/sounds/music.mp3");
        musicRef.current.loop = true;
        musicRef.current.volume = 0.25;
      }

      if (settings[0]?.value) {
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
    let timeoutId: NodeJS.Timeout;

    const handleVisibilityChange = () => {
      if (!musicRef.current) return;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (document.hidden) {
          setPause(true);
          musicRef.current?.pause();
        } else if (settings[0]?.value) {
          setPause(false);
          musicRef.current?.play().catch(() => {});
        }
      }, 100);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [setPause, settings]);

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

  if (spaceshipHealth <= 0) {
    return <GameOver onRestart={resetSpaceShipHealth} />;
  }

  return (
    <main className='grid place-items-center w-[100dvw] h-[100dvh]'>
      <AnimatePresence mode='wait'>
        <Suspense
          fallback={
            <div className='grid place-items-center h-[100dvh]'>
              <Spinner size='large' />
            </div>
          }
        >
          {start ? <Game /> : <Intro />}
        </Suspense>
      </AnimatePresence>
    </main>
  );
}
