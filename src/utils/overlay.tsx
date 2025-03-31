import useGame from "@/hooks/State";
import { Html } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function Overlay() {
  const { countdown, setCountdown, setOverlay } = useGame();
  const [isPointerCenter, setIsPointerCenter] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;

    if (isPointerCenter) {
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
    }
  }, [countdown, isPointerCenter, setCountdown, setOverlay]);

  return (
    <Html center className='overlay_container'>
      <div
        className='text-center w-md h-32 text-2xl grid place-items-center'
        onMouseOver={() => setIsPointerCenter(true)}
        onMouseLeave={() => setIsPointerCenter(false)}
      >
        <div>
          {isPointerCenter ? (
            <div className={`overlay `}>{countdown}</div>
          ) : (
            <p className='!italic text-base'>
              Keep your cursor/pointer in the center
            </p>
          )}
        </div>
      </div>
    </Html>
  );
}
