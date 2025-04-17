
import { 
  TargetAndTransition, 
  AnimationControls,
  MotionStyle,
  ForwardRefComponent,
  HTMLMotionProps
} from 'framer-motion';
import { LucideIcon } from 'lucide-react';

declare module 'framer-motion' {
  interface TargetAndTransition {
    boxShadow?: string;
    borderColor?: string;
    backgroundPosition?: string;
    backgroundColor?: string;
    transform?: string;
    [key: string]: any;
  }

  interface MotionStyle {
    transform?: string;
    backgroundColor?: string;
    [key: string]: any;
  }
}

// Add this to fix the type in Landing.tsx
declare global {
  interface ForwardRefExoticComponent<P> {
    (props: P): JSX.Element;
  }
  
  interface LucideIconType {
    (props: any): JSX.Element;
  }
}
