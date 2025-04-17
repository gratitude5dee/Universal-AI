
import { 
  TargetAndTransition, 
  AnimationControls,
  MotionStyle
} from 'framer-motion';

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
