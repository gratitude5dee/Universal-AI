import { useEffect } from 'react';

interface UseOnboardingNavigationProps {
  onNext: () => void;
  onBack?: () => void;
  disabled?: boolean;
}

export const useOnboardingNavigation = ({ 
  onNext, 
  onBack, 
  disabled = false 
}: UseOnboardingNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;
      
      // Prevent navigation if user is typing in an input or interacting with a select
      const target = event.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || 
                      target.tagName === 'TEXTAREA' || 
                      target.contentEditable === 'true' ||
                      target.closest('[role="combobox"]') ||
                      target.closest('[role="button"]');
      
      if (isTyping) return;

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          onNext();
          break;
        case 'Escape':
          if (onBack) {
            event.preventDefault();
            onBack();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onBack, disabled]);

  const handleAreaClick = (event: React.MouseEvent) => {
    if (disabled) return;
    
    // Only trigger if clicking on the background area, not on interactive elements
    const target = event.target as HTMLElement;
    const isInteractive = target.closest('button') || 
                         target.closest('input') || 
                         target.closest('select') ||
                         target.closest('[role="button"]') ||
                         target.closest('[role="combobox"]') ||
                         target.closest('.dropzone') ||
                         target.hasAttribute('data-interactive');
    
    if (!isInteractive && event.target === event.currentTarget) {
      onNext();
    }
  };

  return { handleAreaClick };
};