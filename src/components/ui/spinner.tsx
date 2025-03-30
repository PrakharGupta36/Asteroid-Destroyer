import type React from "react";
import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const spinnerVariants = cva("flex items-center justify-center", {
  variants: {
    show: {
      true: "flex",
      false: "hidden",
    },
  },
  defaultVariants: {
    show: true,
  },
});

const loaderVariants = cva("animate-spin", {
  variants: {
    size: {
      small: "h-6 w-6",
      medium: "h-8 w-8",
      large: "h-12 w-12",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface SpinnerContentProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string;
  children?: React.ReactNode;
  color?: string;
}

export default function Spinner({
  size,
  show,
  children,
  className,
  color = "#8E8E93",
}: SpinnerContentProps) {
  // Create 12 lines for the iOS spinner
  const lines = Array.from({ length: 12 }, (_, i) => {
    // Calculate opacity for each line (iOS style fades from most opaque to least)
    const opacity = (12 - i) / 12;

    return (
      <rect
        key={i}
        x='11'
        y='1'
        width='2'
        height='5'
        rx='1'
        fill={color}
        style={{
          opacity,
          transform: `rotate(${i * 30}deg)`,
          transformOrigin: "center center",
        }}
      />
    );
  });

  return (
    <div className={cn("absolute z-10", spinnerVariants({ show }))}>
      <svg
        className={cn(loaderVariants({ size }), className)}
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        {lines}
      </svg>
      {children && <div className='mt-2'>{children}</div>}
    </div>
  );
}
