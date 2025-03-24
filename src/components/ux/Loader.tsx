import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";

export default function Loader() {
  const { progress, loaded, total } = useProgress();
  const [visible, setVisible] = useState(true);
  const [progressValue, setProgressValue] = useState(0);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressValue(progress);
    }, 100);

    if (progress === 100) {
      const timer = setTimeout(() => setVisible(false), 500);
      return () => {
        clearTimeout(timer);
        clearTimeout(timeout);
      };
    }

    return () => clearTimeout(timeout);
  }, [progress]);

  useEffect(() => {
    const showLoaderTimer = setTimeout(() => {
      setShowLoader(true);
    }, 300);

    return () => clearTimeout(showLoaderTimer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`transition-opacity duration-700  ${
        showLoader ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className='fixed inset-0 flex flex-col items-center justify-center bg-[#101010] backdrop-blur-sm z-1'>
        <div className='relative w-32 h-32 '>
          <div
            className='absolute w-56 h-56 border  border-gray-500 rounded-full opacity-50 -z-10'
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(-50%,-50%)`,
            }}
          ></div>

          <div
            className='absolute w-40 h-40 border  border-gray-500 rounded-full opacity-50 -z-10'
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(-50%,-50%)`,
            }}
          ></div>

          <div
            className='absolute w-24 h-24 border border-gray-500 rounded-full opacity-50 -z-10'
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(-50%,-50%)`,
            }}
          ></div>

          <div
            className='absolute w-12 h-12 border  border-gray-500 rounded-full opacity-50 -z-10'
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(-50%,-50%)`,
            }}
          ></div>

          {/* Central sun */}
          <div
            className='absolute w-12 h-12  bg-amber-300 border-2 rounded-full animate-pulse'
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(-50%,-50%)`,
            }}
          >
            <div className='absolute inset-0 bg-amber-500 rounded-full animate-pulse opacity-60'></div>
          </div>

          {/* Orbiting planets with z-index to appear above orbit paths */}
          <div className='absolute inset-0 animate-[spin_8s_linear_infinite] '>
            <div
              className='absolute w-3 h-3 bg-blue-400  border rounded-full'
              style={{ left: "calc(50% - 65px)", top: "4px" }}
            ></div>
          </div>

          <div className='absolute inset-0 animate-[spin_12s_linear_infinite] '>
            <div
              className='absolute w-4 h-4 bg-indigo-400 border rounded-full'
              style={{ left: "calc(50% - 98px)", top: "-8px" }}
            ></div>
          </div>

          <div className='absolute inset-0 animate-[spin_16s_linear_infinite] '>
            <div
              className='absolute w-2 h-2 bg-teal-400 border rounded-full'
              style={{ left: "calc(50% - 5px)", top: "12px" }}
            ></div>
          </div>

          {/* Small asteroids */}
          <div className='absolute inset-0 animate-[spin_4s_linear_infinite] '>
            <div
              className='absolute w-1 h-1 bg-gray-300 rounded-full'
              style={{ left: "calc(50% - 0.5px)", top: "8px" }}
            ></div>
          </div>
        </div>

        {/* Progress indicator with custom styling */}
        <div className='w-64 space-y-3 mt-20'>
          <div className='text-white text-lg font-bold'>
            Loading Game Assets: {Math.round(progress)}%
          </div>
          <Progress
            value={progressValue}
            className={cn(
              "h-1",
              "bg-white", // Override background
              "[&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-indigo-600"
            )}
          />

          <div className='flex justify-between text-xs text-gray-400'>
            <span>Loading assets</span>
            <span>
              {loaded}/{total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
