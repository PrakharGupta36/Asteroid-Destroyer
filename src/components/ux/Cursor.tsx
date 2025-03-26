import { useEffect, useState } from "react";

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<{
    x: number | null;
    y: number | null;
  }>({
    x: null,
    y: null,
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

export default function Cursor({ isOverAsteroid }: { isOverAsteroid: boolean }) {
  const { x, y } = useMousePosition();
  return (
    <>
      <div
        style={{
          left: `${x}px`,
          top: `${y}px`,
          border: isOverAsteroid
            ? "2px solid red"
            : "2px solid white",
        }}
        className='ring'
      ></div>
      <div
        className='line-1'
        style={{
          left: `${x}px`,
          top: `${y}px`,
          backgroundColor: isOverAsteroid ? "red" : "white",
        }}
      ></div>
      <div
        className='line-2'
        style={{
          left: `${x}px`,
          top: `${y}px`,
          backgroundColor: isOverAsteroid ? "red" : "white",
        }}
      ></div>
    </>
  );
}
