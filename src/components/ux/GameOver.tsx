import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import useGame from "@/hooks/State";

interface GameOverProps {
  onRestart: () => void;
}

export default function GameOver({ onRestart }: GameOverProps) {
  const [showGameOver, setShowGameOver] = useState(false);
  const { setPause } = useGame();

  useEffect(() => {
    const timeout = setTimeout(() => setShowGameOver(true), 200); // Delay before showing
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence mode='wait'>
      {showGameOver && (
        <motion.main
          className='grid place-items-center w-[100dvw] h-[100dvh] bg-[#1d1d1d]'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className='grid place-items-center gap-4'>
            <motion.h1
              className='text-white text-3xl'
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Game Over
            </motion.h1>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Button
                variant='ghost'
                className='rainbow-button'
                onClick={() => {
                  onRestart();
                  setPause(false);
                }}
              >
                Play Again
              </Button>
            </motion.div>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
