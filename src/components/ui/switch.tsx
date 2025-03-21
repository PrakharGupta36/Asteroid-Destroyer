import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import useGame from "@/hooks/State";

function Switch({
  onClick,
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const clickAudio = React.useMemo(() => new Audio("/sounds/clickAudio.mp3"), []);
  const { settings } = useGame();

  return (
    <SwitchPrimitive.Root
      onClick={(event) => {
        if (settings[1].value) {
          clickAudio.currentTime = 0;
          clickAudio.volume = 1;
          clickAudio
            .play()
            .catch((err) => console.log("Click audio error:", err));
        }

        if (onClick) {
          onClick(event);
        }
      }}
      data-slot='switch'
      className={cn(
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500", // Green when ON, Red when OFF
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground",
          "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
