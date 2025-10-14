import * as React from "react"
import { AlertTriangle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface ErrorBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  onRetry?: () => void
  onDismiss?: () => void
  variant?: "error" | "warning" | "info"
}

const ErrorBanner = React.forwardRef<HTMLDivElement, ErrorBannerProps>(
  ({ className, title, description, onRetry, onDismiss, variant = "error", ...props }, ref) => {
    const colors = {
      error: {
        bg: "bg-[hsl(var(--error))]/10",
        border: "border-[hsl(var(--error))]/20",
        icon: "text-[hsl(var(--error))]",
        text: "text-[hsl(var(--error))]",
        subtext: "text-[hsl(var(--error))]/70"
      },
      warning: {
        bg: "bg-[hsl(var(--warning))]/10",
        border: "border-[hsl(var(--warning))]/20",
        icon: "text-[hsl(var(--warning))]",
        text: "text-[hsl(var(--warning))]",
        subtext: "text-[hsl(var(--warning))]/70"
      },
      info: {
        bg: "bg-[hsl(var(--accent-blue))]/10",
        border: "border-[hsl(var(--accent-blue))]/20",
        icon: "text-[hsl(var(--accent-blue))]",
        text: "text-[hsl(var(--accent-blue))]",
        subtext: "text-[hsl(var(--accent-blue))]/70"
      }
    }

    const colorScheme = colors[variant]

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg p-4 border",
          colorScheme.bg,
          colorScheme.border,
          className
        )}
        role="alert"
        aria-live="assertive"
        {...props}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className={cn("w-5 h-5 mt-0.5 flex-shrink-0", colorScheme.icon)} aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className={cn("text-sm font-medium mb-1", colorScheme.text)}>
              {title}
            </p>
            {description && (
              <p className={cn("text-xs mb-3", colorScheme.subtext)}>
                {description}
              </p>
            )}
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="border-white/10"
              >
                Retry
              </Button>
            )}
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Dismiss error"
            >
              <X className={cn("w-4 h-4", colorScheme.icon)} />
            </button>
          )}
        </div>
      </div>
    )
  }
)
ErrorBanner.displayName = "ErrorBanner"

export { ErrorBanner }
