import { useState, useEffect } from "react";

interface TypewriterProps {
  children: string;
  delay?: number;
  speed?: number;
  className?: string;
  onCompleted?: (completed: boolean) => void;
}

export default function Typewriter({
  children,
  delay = 0,
  speed = 50,
  className = "",
  onCompleted,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    onCompleted?.(false);
  }, [onCompleted]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!startAnimation) return;

    if (currentIndex < children.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + children[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex === children.length) {
     
      onCompleted?.(true);
    }
  }, [children, currentIndex, speed, startAnimation, onCompleted]);

  return (
    <p className={`${className} text-white`} aria-label={children}>
      {displayedText}
      <span className='sr-only'>{children}</span>
    </p>
  );
}
