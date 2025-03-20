import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import useGame from "@/hooks/State";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden \
   disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none \
   focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[#212121] border border-[#212121] text-white shadow-[4px_4px_6px_#000,-4px_-4px_6px_#2f2f2f] \
          hover:bg-[#1a1a1a] hover:shadow-[3px_3px_5px_#000,-3px_-3px_5px_#2a2a2a] active:shadow-inset-[3px_3px_6px_#000,inset_-3px_-3px_6px_#1f1f1f] active:text-gray-500 ",
        destructive:
          "bg-gradient-to-r from-red-800 via-gray-700 to-gray-600 text-white shadow-[3px_3px_5px_#ff0000,-3px_-3px_5px_#ff5050] hover:shadow-red-500/50",
        outline:
          "border border-gray-600 bg-gray-900 text-whitesmoke shadow-[3px_3px_5px_#444,-3px_-3px_5px_#666] hover:bg-gray-800 hover:text-gray-300",
        secondary:
          "bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 text-whitesmoke shadow-[3px_3px_5px_#444,-3px_-3px_5px_#666] hover:shadow-gray-400/40",
        ghost: "text-gray-300 hover:bg-gray-800 hover:text-whitesmoke",
        link: "text-gray-400 underline-offset-4 hover:underline hover:text-whitesmoke",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function ButtonFancy({
  className,
  variant,
  size,
  asChild = false,
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const btnAudio = React.useMemo(() => new Audio("/sounds/btnAudio.mp3"), []);
  const { settings } = useGame();

  return (
    <Comp
      data-slot='button'
      className={cn(
        buttonVariants({ variant, size }), // Base styles from cva
        className, // Ensure user-provided styles are applied last
        "px-6 py-7 text-lg relative overflow-hidden font-semibold tracking-wide rounded-lg text-white transition-all duration-300 ease-in-out",
        "hover:scale-[1.03] active:scale-80 hover:rotate-[2deg] active:rotate-[-2deg]",
        "before:rounded-xl before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gray-100 before:opacity-5 before:scale-150 before:translate-x-[-100%]",
        "before:rotate-12 before:transition-transform before:duration-300 hover:before:translate-x-[10%] hover:before:scale-100",
        "before:content-['']"
      )}
      {...props}
      onClick={(event) => {
        if (settings[1].value) {
          btnAudio.currentTime = 0;
          btnAudio
            .play()
            .catch((err) => console.log("Click audio error:", err));
        }

        if (onClick) {
          onClick(event);
        }
      }}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { ButtonFancy, buttonVariants };
