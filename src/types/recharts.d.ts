
import 'recharts';
import { ReactNode } from 'react';

declare module 'recharts' {
  export interface ResponsiveContainerProps {
    children?: ReactNode;
  }
}
