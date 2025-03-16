import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

export default function CustomLoader() {
  const { progress, loaded, total } = useProgress();
  const [visible, setVisible] = useState(true);
  const [progressValue, setProgressValue] = useState(0);

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

  if (!visible) return null;

  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#101010] backdrop-blur-sm'>
      <div className='relative w-32 h-32 '>
        <div
          className='absolute w-56 h-56 border  border-gray-500 rounded-full opacity-20'
          style={{ left: "50%", top: "50%", transform: `translate(-50%,-50%)` }}
        ></div>

        <div
          className='absolute w-40 h-40 border  border-gray-500 rounded-full opacity-20'
          style={{ left: "50%", top: "50%", transform: `translate(-50%,-50%)` }}
        ></div>

        <div
          className='absolute w-24 h-24 border border-gray-500 rounded-full opacity-20'
          style={{ left: "50%", top: "50%", transform: `translate(-50%,-50%)` }}
        ></div>

        <div
          className='absolute w-12 h-12 border  border-gray-500 rounded-full opacity-20'
          style={{ left: "50%", top: "50%", transform: `translate(-50%,-50%)` }}
        ></div>

        {/* Central sun */}
        <div
          className='absolute w-9 h-9 bg-amber-300 border-2 rounded-full animate-pulse z-10'
          style={{ left: "50%", top: "50%", transform: `translate(-50%,-50%)` }}
        >
          <div className='absolute inset-0 bg-amber-500 rounded-full animate-pulse opacity-60'></div>
        </div>

        {/* Orbiting planets with z-index to appear above orbit paths */}
        <div className='absolute inset-0 animate-[spin_8s_linear_infinite] z-10'>
          <div
            className='absolute w-3 h-3 bg-blue-400  border rounded-full'
            style={{ left: "calc(50% - 65px)", top: "4px" }}
          ></div>
        </div>

        <div className='absolute inset-0 animate-[spin_12s_linear_infinite] z-10'>
          <div
            className='absolute w-4 h-4 bg-indigo-400 border rounded-full'
            style={{ left: "calc(50% - 98px)", top: "0px" }}
          ></div>
        </div>

        <div className='absolute inset-0 animate-[spin_16s_linear_infinite] z-10'>
          <div
            className='absolute w-2 h-2 bg-teal-400 border rounded-full'
            style={{ left: "calc(50% - 5px)", top: "10px" }}
          ></div>
        </div>

        {/* Small asteroids */}
        <div className='absolute inset-0 animate-[spin_4s_linear_infinite] z-10'>
          <div
            className='absolute w-1 h-1 bg-gray-300 rounded-full'
            style={{ left: "calc(50% - 0.5px)", top: "8px" }}
          ></div>
        </div>
      </div>

      {/* Progress indicator with custom styling */}
      <div className='w-64 space-y-3'>
        <div className='text-white text-lg font-bold'>
          Loading Game Assets: {Math.round(progress)}%
        </div>
        <Progress
          value={progressValue}
          className={cn(
            "h-0.5",
            "bg-gray-900", // Override background
            "[&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-indigo-600" // Style the indicator
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
  );
}
