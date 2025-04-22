
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
    children: ReactNode | ((containerProps: any) => ReactNode);
    debounce?: number;
    id?: string | number;
  }

  export interface LegendProps {
    width?: number;
    height?: number;
    layout?: 'horizontal' | 'vertical';
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    iconSize?: number;
    iconType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye';
    payload?: Array<any>;
    chartWidth?: number;
    chartHeight?: number;
    margin?: object;
    content?: ReactNode | FC<any>;
    wrapperStyle?: object;
    onClick?: (data: any) => void;
    onMouseEnter?: (data: any) => void;
    onMouseLeave?: (data: any) => void;
  }

  export const ResponsiveContainer: FC<ResponsiveContainerProps & RefAttributes<HTMLDivElement>>;
  export const Label: FC<any>;

  // Add other recharts components
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
