import * as React from "react"
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface InfoTooltipProps {
  content: string
  className?: string
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, className }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-white/10 transition-colors",
              className
            )}
            aria-label="More information"
          >
            <Info className="w-3.5 h-3.5 text-[hsl(var(--text-tertiary))]" aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs text-xs bg-[hsl(var(--bg-secondary))] border-white/10 text-[hsl(var(--text-secondary))]"
        >
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
