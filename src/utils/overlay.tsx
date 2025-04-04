import useGame from "@/hooks/State";
import { Html } from "@react-three/drei";
import { useEffect } from "react";

export default function Overlay() {
  const { countdown, setCountdown, setOverlay } = useGame();

  useEffect(() => {
    if (countdown <= 0) return;

    const intervalId = setInterval(() => {
      setCountdown((prev) => {
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
    <Html as='section' center className='overlay_container'>
      <div className='text-center text-4xl font-bold grid place-items-center relative -top-50'>
        <div className={`overlay !italic`}>{countdown}</div>
      </div>
    </Html>
  );
}
