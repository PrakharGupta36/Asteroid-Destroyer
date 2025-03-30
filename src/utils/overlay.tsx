import useGame from "@/hooks/State";
import { Html } from "@react-three/drei";
import { useEffect } from "react";

export default function Overlay() {
  const { countdown, setCountdown, setOverlay } = useGame();

  useEffect(() => {
    if (countdown <= 0) return;

    const intervalId = setInterval(() => {
      setCountdown((prev: number) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setOverlay(false);
          return 0;
        }
        return prev - 1;
      });
    }, 900);

    return () => clearInterval(intervalId);
  }, [countdown, setCountdown, setOverlay]);

  return (
    <Html center className='overlay_container'>
      <div className='overlay'>{countdown}</div>
    </Html>
  );
}
