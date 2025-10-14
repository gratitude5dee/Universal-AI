import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center py-12 px-4",
          className
        )}
        {...props}
      >
        {Icon && (
          <div className="mb-4 p-3 rounded-full bg-white/5 border border-white/10">
            <Icon className="w-8 h-8 text-[hsl(var(--text-tertiary))]" aria-hidden="true" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-[hsl(var(--text-primary))] mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[hsl(var(--text-secondary))] max-w-md mb-6">
            {description}
          </p>
        )}
        {action && (
          <Button onClick={action.onClick} variant="default">
            {action.label}
          </Button>
        )}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
