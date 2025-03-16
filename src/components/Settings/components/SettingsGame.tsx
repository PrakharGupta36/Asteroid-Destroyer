import useGame from "@/hooks/State";
import { useRef } from "react";
import Settings from "../Settings";
import { Button } from "../../ui/button";

export default function SettingsGame() {
  const { pause, setPause } = useGame();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <Settings
      trigger={
        <Button ref={btnRef} className='absolute top-0 z-10 m-4 border'>
          Pause (ESC)
        </Button>
      }
      pause={pause}
      setPause={setPause}
    />
  );
}
