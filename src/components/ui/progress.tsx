
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

// Extend props to include indicatorClassName
interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps // Use the extended props type
>(({ className, value, indicatorClassName, ...props }, ref) => ( // Destructure indicatorClassName
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-5 w-full overflow-hidden border-[3px] border-[#8d6e63] bg-muted p-[1px]", // Outer 3px border (#8d6e63), track color (bg-muted), 1px padding for inset
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn( 
        "h-full w-full flex-1 transition-all", // Fill only, no border on indicator
        indicatorClassName ? indicatorClassName : "bg-slate-300" // Default fill or specific via prop
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
