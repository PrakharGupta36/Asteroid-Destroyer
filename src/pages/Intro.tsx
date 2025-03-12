import { Button } from "@/components/ui/button";
import useGame from "@/hooks/State";

export default function Intro() {
  const { setStart } = useGame();

  return (
    <div>
      <Button onClick={() => setStart(true)}> Start </Button>
    </div>
  );
}
