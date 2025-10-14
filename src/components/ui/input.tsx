import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle, AlertCircle } from "lucide-react"

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean
  success?: boolean
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text-primary))] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--text-tertiary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-purple))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all md:text-sm",
              error && "border-[hsl(var(--error))] focus-visible:ring-[hsl(var(--error))] pr-10",
              success && "border-[hsl(var(--success))] focus-visible:ring-[hsl(var(--success))] pr-10",
              !error && !success && "border-white/10",
              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={helperText ? `${props.id}-helper` : undefined}
            {...props}
          />
          {error && (
            <AlertCircle 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--error))]" 
              aria-hidden="true"
            />
          )}
          {success && (
            <CheckCircle 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--success))]" 
              aria-hidden="true"
            />
          )}
        </div>
        {helperText && (
          <p 
            id={`${props.id}-helper`}
            className={cn(
              "text-xs mt-1.5",
              error && "text-[hsl(var(--error))]",
              success && "text-[hsl(var(--success))]",
              !error && !success && "text-[hsl(var(--text-tertiary))]"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
