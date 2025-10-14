import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "card" | "text" | "circle" | "button"
  count?: number
}

const LoadingSkeleton = React.forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ className, variant = "card", count = 1, ...props }, ref) => {
    const skeletons = Array.from({ length: count }, (_, i) => i)
    
    const getVariantClass = () => {
      switch (variant) {
        case "text":
          return "h-4 w-full rounded"
        case "circle":
          return "h-12 w-12 rounded-full"
        case "button":
          return "h-10 w-32 rounded-xl"
        case "card":
        default:
          return "h-32 w-full rounded-xl"
      }
    }

    return (
      <>
        {skeletons.map((i) => (
          <div
            key={i}
            ref={i === 0 ? ref : undefined}
            className={cn(
              "animate-pulse bg-gradient-to-r from-[hsl(var(--bg-tertiary))] via-[hsl(var(--bg-secondary))] to-[hsl(var(--bg-tertiary))] bg-[length:200%_100%]",
              getVariantClass(),
              className
            )}
            style={{
              animation: "shimmer 2s infinite",
            }}
            aria-busy="true"
            aria-live="polite"
            {...props}
          />
        ))}
      </>
    )
  }
)
LoadingSkeleton.displayName = "LoadingSkeleton"

export { LoadingSkeleton }
