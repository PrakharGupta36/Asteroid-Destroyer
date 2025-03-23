import React from "react";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

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
}

export default function Spinner({
  size,
  show,
  children,
  className,
}: SpinnerContentProps) {
  return (
    <div className={cn("absolute z-10 ", spinnerVariants({ show }))}>
      <svg
        className={cn(loaderVariants({ size }), className)}
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='white'
          strokeWidth='4'
        ></circle>
        <path
          className='opacity-75'
          fill='white'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        ></path>
      </svg>
      {children && <div className='mt-2'>{children}</div>}
    </div>
  );
}
