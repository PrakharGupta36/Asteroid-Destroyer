import useGame from "@/hooks/State";
import { useEffect, useRef } from "react";

import { Button } from "../../ui/button";
import Settings from "../Settings";

export default function SettingsGame() {
  const { pause, setPause, overlay, showStory } = useGame();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!pause) {
      document.body.focus();
    }
  }, [pause]);

  return (
    <Settings
      trigger={
        <Button
          disabled={!showStory || !overlay}
          ref={btnRef}
          className='absolute top-0 z-10 m-4 border pause-btn'
          tabIndex={-1}
          onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) =>
            e.preventDefault()
          }
          onMouseDown={(e) => e.preventDefault()}
        >
          Pause (Shift + S)
        </Button>
      }
      pause={pause}
      setPause={setPause}
    />
  );
}
