import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
  {
    variants: {
      status: {
        active:
          "bg-[hsl(var(--success))]/20 text-[hsl(var(--success))] border-[hsl(var(--success))]/30",
        pending:
          "bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30",
        error:
          "bg-[hsl(var(--error))]/20 text-[hsl(var(--error))] border-[hsl(var(--error))]/30",
        info:
          "bg-[hsl(var(--accent-blue))]/20 text-[hsl(var(--accent-blue))] border-[hsl(var(--accent-blue))]/30",
        default:
          "bg-white/10 text-[hsl(var(--text-secondary))] border-white/20",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  showDot?: boolean
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, showDot = true, children, ...props }, ref) => {
    return (
      <span
        className={cn(statusBadgeVariants({ status, className }))}
        ref={ref}
        {...props}
      >
        {showDot && (
          <span 
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: "currentColor"
            }}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge, statusBadgeVariants }
