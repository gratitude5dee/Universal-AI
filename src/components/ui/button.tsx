import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-purple))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--accent-purple))] text-[hsl(var(--text-primary))] hover:brightness-110 active:scale-[0.98] shadow-[0_0_20px_rgba(139,92,246,0.4)]",
        destructive: "bg-[hsl(var(--error))] text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--error))]/90",
        outline: "border border-white/10 bg-transparent text-[hsl(var(--text-primary))] hover:bg-white/10",
        secondary: "bg-[hsl(var(--bg-tertiary))] text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-tertiary))]/80",
        ghost: "bg-transparent text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--accent-purple))]/10",
        link: "text-[hsl(var(--accent-purple))] underline-offset-4 hover:underline",
        success: "bg-[hsl(var(--success))] text-white hover:bg-[hsl(var(--success))]/90",
        warning: "bg-[hsl(var(--warning))] text-white hover:bg-[hsl(var(--warning))]/90",
      },
      size: {
        default: "h-10 px-6 py-2.5",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
