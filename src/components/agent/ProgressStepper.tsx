import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: string;
  completedSteps: string[];
  onStepClick?: (stepId: string) => void;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}) => {
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isClickable = isCompleted || index <= currentStepIndex;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300",
                    isCompleted && "bg-gradient-to-br from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))] border-transparent",
                    isCurrent && !isCompleted && "border-[hsl(var(--accent-purple))] bg-[hsl(var(--bg-elevated))] ring-4 ring-[hsl(var(--accent-purple))]/20",
                    !isCurrent && !isCompleted && "border-white/20 bg-[hsl(var(--bg-secondary))]",
                    isClickable && "cursor-pointer hover:scale-110",
                    !isClickable && "opacity-50 cursor-not-allowed"
                  )}
                  aria-label={`${step.label} - ${isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Upcoming'}`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <span className={cn(
                      "text-sm font-semibold",
                      isCurrent ? "text-[hsl(var(--accent-purple))]" : "text-[hsl(var(--text-tertiary))]"
                    )}>
                      {index + 1}
                    </span>
                  )}
                </button>
                
                <div className="mt-3 text-center">
                  <div className={cn(
                    "text-sm font-medium transition-colors",
                    isCurrent ? "text-[hsl(var(--text-primary))]" : "text-[hsl(var(--text-secondary))]"
                  )}>
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-[hsl(var(--text-tertiary))] mt-1 max-w-[120px]">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {!isLast && (
                <div className="flex-1 h-0.5 mb-8 mx-2 relative">
                  <div className="absolute inset-0 bg-white/10" />
                  <div 
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))] transition-all duration-500",
                      isCompleted ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;