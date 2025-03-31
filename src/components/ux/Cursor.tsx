import { CSSProperties, useEffect, useMemo, useState } from "react";

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      setMousePosition({ x: clientX, y: clientY });
    };

    document.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  return mousePosition;
}

export default function Cursor({
  isOverAsteroid,
}: {
  isOverAsteroid: boolean;
}) {
  const { x, y } = useMousePosition();

  const cursorStyles = useMemo(() => {
    return {
      ring: {
        position: "fixed",
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none" as CSSProperties["pointerEvents"],
        border: `1px solid ${isOverAsteroid ? "red" : "white"}`,
        borderRadius: "50%",
        width: "33px",
        height: "33px",
        zIndex: 9999,
      } as CSSProperties,
      line: (rotation: number) =>
        ({
          position: "fixed",
          left: `${x}px`,
          top: `${y}px`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          pointerEvents: "none" as CSSProperties["pointerEvents"],
          backgroundColor: isOverAsteroid ? "red" : "white",
          height: "1px",
          width: "20px",
          zIndex: 9999,
        } as CSSProperties),
    };
  }, [x, y, isOverAsteroid]);

  return (
    <>
      <div style={cursorStyles.ring} className='cursor-ring' />
      <div style={cursorStyles.line(0)} className='cursor-line-horizontal' />
      <div style={cursorStyles.line(90)} className='cursor-line-vertical' />
    </>
  );
}
