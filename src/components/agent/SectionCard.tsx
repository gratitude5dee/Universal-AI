import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SectionCardProps {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  helpText?: string;
  isValid?: boolean;
  validationMessage?: string;
  characterCount?: { current: number; max: number };
  defaultExpanded?: boolean;
  required?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({
  id,
  title,
  description,
  icon,
  children,
  helpText,
  isValid,
  validationMessage,
  characterCount,
  defaultExpanded = true,
  required = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getCharacterCountColor = () => {
    if (!characterCount) return '';
    const percentage = (characterCount.current / characterCount.max) * 100;
    if (percentage >= 90) return 'text-[hsl(var(--error))]';
    if (percentage >= 75) return 'text-[hsl(var(--warning))]';
    return 'text-[hsl(var(--success))]';
  };

  return (
    <div 
      id={id}
      className={cn(
        "backdrop-blur-xl bg-white/5 rounded-xl border transition-all duration-300 overflow-hidden",
        isValid === false 
          ? "border-[hsl(var(--error))]/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
          : isValid === true 
          ? "border-[hsl(var(--success))]/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
          : "border-white/10 hover:border-white/20",
        "animate-fade-in"
      )}
      style={{
        animationDelay: `${Math.random() * 200}ms`,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
        aria-expanded={isExpanded}
        aria-controls={`section-${id}`}
      >
        <div className="flex items-center gap-4 flex-1">
          {icon && (
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--accent-purple))]/20 to-[hsl(var(--accent-blue))]/20 text-[hsl(var(--accent-purple))] group-hover:scale-110 transition-transform">
              {icon}
            </div>
          )}
          
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[hsl(var(--text-primary))]">
                {title}
                {required && <span className="text-[hsl(var(--error))] ml-1">*</span>}
              </h3>
              
              {helpText && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="text-[hsl(var(--text-tertiary))] hover:text-[hsl(var(--text-primary))] transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">{helpText}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {description && (
              <p className="text-sm text-[hsl(var(--text-secondary))] mt-1">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Validation Status */}
            {isValid === true && (
              <div className="flex items-center gap-2 text-[hsl(var(--success))]">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Complete</span>
              </div>
            )}
            {isValid === false && (
              <div className="flex items-center gap-2 text-[hsl(var(--error))]">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Needs attention</span>
              </div>
            )}
            
            {/* Character Count */}
            {characterCount && (
              <span className={cn("text-sm font-mono", getCharacterCountColor())}>
                {characterCount.current}/{characterCount.max}
              </span>
            )}

            {/* Expand/Collapse Icon */}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-[hsl(var(--text-secondary))] group-hover:text-[hsl(var(--text-primary))] transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[hsl(var(--text-secondary))] group-hover:text-[hsl(var(--text-primary))] transition-colors" />
            )}
          </div>
        </div>
      </button>

      {/* Body */}
      {isExpanded && (
        <div 
          id={`section-${id}`}
          className="px-6 pb-6 animate-accordion-down"
        >
          {validationMessage && isValid === false && (
            <div className="mb-4 p-3 rounded-lg bg-[hsl(var(--error))]/10 border border-[hsl(var(--error))]/20 text-[hsl(var(--error))] text-sm">
              {validationMessage}
            </div>
          )}
          
          {children}
        </div>
      )}
    </div>
  );
};

export default SectionCard;