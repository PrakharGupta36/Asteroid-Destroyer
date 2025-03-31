import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";

export default function CustomLoader({
  setIsLoading,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { progress, loaded, total } = useProgress();
  const [visible, setVisible] = useState(true);
  const [progressValue, setProgressValue] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      setFadeOut(true);
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [progress, setIsLoading]);

  useEffect(() => {
    const timeout = setTimeout(() => setProgressValue(progress), 100);
    if (progress === 100) {
      const timer = setTimeout(() => setVisible(false), 400);
      return () => {
        clearTimeout(timer);
        clearTimeout(timeout);
      };
    }
    return () => clearTimeout(timeout);
  }, [progress]);

  useEffect(() => {
    const showLoaderTimer = setTimeout(() => setShowLoader(true), 200);
    return () => clearTimeout(showLoaderTimer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : ""
      } ${showLoader ? "opacity-100" : "opacity-0"}`}
    >
      <div className='fixed inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md'>
        {/* Subtle Circular Loader */}
        <div className='relative w-16 h-16'>
          <div className='absolute inset-0 animate-spin-slow'>
            <div className='w-full h-full border-4 border-gray-500 border-t-transparent rounded-full'></div>
          </div>
        </div>

        {/* Loading Text & Progress */}
        <div className='w-60 space-y-3 mt-8 text-center'>
          <div className='text-white text-sm font-medium'>
            Loading: {Math.round(progress)}%
          </div>
          <Progress
            value={progressValue}
            className={cn(
              "h-1 bg-gray-700",
              "[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-500"
            )}
          />
          <div className='text-xs text-gray-400'>
            Assets Loaded: {loaded}/{total}
          </div>
        </div>
      </div>
    </div>
  );
}
