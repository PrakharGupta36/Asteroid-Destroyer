import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useGame from "@/hooks/State";
import Typewriter from "@/utils/typewriter";
import { Html } from "@react-three/drei";
import { useState } from "react";

export default function Story() {
  const { currentLevel, setShowStory, setOverlay } = useGame();
  const [showNextButton, setShowNextButton] = useState<boolean>(false);

  return (
    <Html center className='html_story'>
      <section className='story_container'>
        <Card className='story'>
          <CardContent>
            {currentLevel === 1 ? (
              <div>
                <Typewriter
                  delay={100}
                  onCompleted={(e) => setShowNextButton(e)}
                >
                  Hello pilot, I think you need to take the seat for this one,
                  we been stuck in this asteroid belt, you are the best pilot we
                  have, get us out of here. Destroy 50 of these asteroid then
                  Oliver takes over
                </Typewriter>
              </div>
            ) : currentLevel === 2 ? (
              <div>
                <Typewriter
                  delay={100}
                  onCompleted={(e) => setShowNextButton(e)}
                >
                  The radar says we have clear this wave, but another one is
                  coming will a lot more velocity, we need to upgrade our laser
                  asap
                </Typewriter>
              </div>
            ) : (
              <div>
                <Typewriter
                  delay={100}
                  onCompleted={(e) => setShowNextButton(e)}
                >
                  Phew, that was close. Wait we have a last wave too. This is
                  one serious pilot...
                </Typewriter>
              </div>
            )}
          </CardContent>

          <CardFooter className='flex gap-3'>
            <Button
              disabled={showNextButton}
              onClick={() => {
                setShowStory(false);
                setOverlay(true);
              }}
            >
              Skip Story
            </Button>
            <Button
              disabled={!showNextButton}
              onClick={() => {
                setShowStory(false);
                setOverlay(true);
              }}
            >
              Being
            </Button>
          </CardFooter>
        </Card>
      </section>
    </Html>
  );
}
