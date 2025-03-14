import Settings from "@/components/Settings";
import { ButtonFancy } from "@/components/ui/buttonFancy";
import useGame from "@/hooks/State";

export default function Intro() {
  const { setStart } = useGame();

  return (
    <div className='grid gap-7'>
      <ButtonFancy variant={"secondary"} onClick={() => setStart(true)}>
        Start
      </ButtonFancy>

      <Settings />
    </div>
  );
}
