
declare module 'recharts' {
  import { FC, ReactNode, RefAttributes } from 'react';

  export interface ResponsiveContainerProps {
    aspect?: number;
    className?: string;
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    maxHeight?: number;
    children?: ReactNode;
    debounce?: number;
    id?: string | number;
  }

  export const ResponsiveContainer: FC<ResponsiveContainerProps & RefAttributes<HTMLDivElement>>;

  // Add other recharts components as needed
  export const LineChart: FC<any>;
  export const Line: FC<any>;
  export const BarChart: FC<any>;
  export const Bar: FC<any>;
  export const PieChart: FC<any>;
  export const Pie: FC<any>;
  export const Cell: FC<any>;
  export const XAxis: FC<any>;
  export const YAxis: FC<any>;
  export const CartesianGrid: FC<any>;
  export const Tooltip: FC<any>;
  export const Legend: FC<any>;
  export const ReferenceLine: FC<any>;
  export const Area: FC<any>;
  export const AreaChart: FC<any>;
}
