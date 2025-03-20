import useGame from "@/hooks/State";
import { useRef } from "react";

import { Button } from "../../ui/button";
import Settings from "../Settings";

export default function SettingsGame() {
  const { pause, setPause } = useGame();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <Settings
      trigger={
        <Button
          ref={btnRef}
          className='absolute top-0 z-10 m-4 border pointer-events-none'
          disabled
          tabIndex={-1}
          onKeyDown={(e) => e.preventDefault()} 
        >
          Pause (shift + s)
        </Button>
      }
      pause={pause}
      setPause={setPause}
    />
  );
}
