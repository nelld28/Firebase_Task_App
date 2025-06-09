
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
      "relative h-5 w-full bg-background border-[2.5px] border-black p-0.5", // Sharp rectangle, 2.5px black border, padding for inset fill
      className
    )}
    {...props} // Now props does not contain indicatorClassName
  >
    <ProgressPrimitive.Indicator
      className={cn( // Apply indicatorClassName to the Indicator for its background
        "h-full w-full flex-1 bg-slate-300 border-[2.5px] border-black transition-all", // Default fill color, 2.5px black border
        indicatorClassName 
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
