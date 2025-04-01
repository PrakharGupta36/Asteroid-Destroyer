import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useGame from "@/hooks/State";
import Typewriter from "@/utils/typewriter";
import { Html } from "@react-three/drei";

const storyTexts = [
  "Pilot, we need you in the cockpit now! We're trapped in an asteroid belt, and you're the only one skilled enough to get us out. Take control, destroy 15 asteroids.",

  "Good job, pilot! But the radar just picked up another wave—faster and denser than before. The speed of our laser is upgraded ",

  "That was close… too close. But hold on—our scanners are detecting one final wave. This is it, pilot. Stay sharp, this one’s not going to be easy.",
];

export default function Story() {
  const { settings, currentLevel, showStory, setShowStory, setOverlay } =
    useGame();
  const [showNextButton, setShowNextButton] = useState<boolean>(false);
  const muffledTalkingAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isTabActive, setIsTabActive] = useState<boolean>(true);

  useEffect(() => {
    if (!muffledTalkingAudioRef.current) {
      muffledTalkingAudioRef.current = new Audio("/sounds/muffledTalking.mp3");
      muffledTalkingAudioRef.current.loop = true;
    }

    const audio = muffledTalkingAudioRef.current;

    if (settings[1].value && showStory && !showNextButton && isTabActive) {
      audio.currentTime = 0;
      audio.play();
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [settings, showNextButton, showStory, isTabActive]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <Html center className='html_story'>
      <section className='story_container'>
        <Card className='story bg-black/70 border border-gray-500 shadow-lg shadow-blue-500/30  rounded-xl max-w-lg'>
          <CardContent>
            <div className='flex gap-5 items-start'>
              <img
                className='w-14 h-14 bg-white rounded-full p-[6px] shadow-md'
                src='/character.png'
                alt='character image'
              />
              <Typewriter
                delay={50}
                className='text-white text-lg leading-relaxed tracking-wide'
                onCompleted={setShowNextButton}
              >
                {storyTexts[currentLevel - 1] || storyTexts[0]}
              </Typewriter>
            </div>
          </CardContent>

          <CardFooter className='flex justify-end gap-5 mt-4'>
            <Button
              disabled={showNextButton}
              className='px-6 py-2 text-sm font-medium border border-gray-400 bg-gray-800 text-white hover:bg-gray-700'
              onClick={() => {
                setShowStory(false);
                setOverlay(true);
              }}
            >
              Skip
            </Button>
            <Button
              disabled={!showNextButton}
              className='px-6 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-500'
              onClick={() => {
                setShowStory(false);
                setOverlay(true);
              }}
            >
              {`Begin level ${currentLevel}`}
            </Button>
          </CardFooter>
        </Card>
      </section>
    </Html>
  );
}
