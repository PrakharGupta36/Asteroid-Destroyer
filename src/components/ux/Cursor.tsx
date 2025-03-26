import { useEffect, useState, useCallback, CSSProperties } from "react";

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

    // More comprehensive cursor hiding
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        cursor: none !important;
        user-select: none;
      }
    `;
    document.head.appendChild(style);

    // Ensure cursor is hidden across different elements
    document.body.style.cursor = "none";
    document.documentElement.style.cursor = "none";

    document.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      // Cleanup
      document.head.removeChild(style);
      document.body.style.cursor = "default";
      document.documentElement.style.cursor = "default";
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

  // Memoize style calculations to prevent unnecessary re-renders
  const getRingStyle = useCallback(
    (): CSSProperties => ({
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
      border: isOverAsteroid ? "2px solid red" : "2px solid white",
      borderRadius: "50%",
      width: "44px",
      height: "44px",
      zIndex: 9999,
    }),
    [x, y, isOverAsteroid]
  );

  const getLineStyle = useCallback(
    (rotation: number): CSSProperties => ({
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      pointerEvents: "none",
      backgroundColor: isOverAsteroid ? "red" : "white",
      height: "2px",
      width: "20px",
      zIndex: 9999,
    }),
    [x, y, isOverAsteroid]
  );

  return (
    <>
      <div style={getRingStyle()} className='cursor-ring' />
      <div style={getLineStyle(0)} className='cursor-line-horizontal' />
      <div style={getLineStyle(90)} className='cursor-line-vertical' />
    </>
  );
}
