
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="node" />
/// <reference types="canvas-confetti" />
/// <reference path="./button.d.ts" />
/// <reference path="./framer-motion.d.ts" />
/// <reference path="./crossmint.d.ts" />
/// <reference path="./buffer.d.ts" />
/// <reference path="./env.d.ts" />
/// <reference path="./recharts.d.ts" />

// Ensure React JSX runtime is properly typed
declare module 'react/jsx-runtime' {
  export default any;
}

// Add Fragment typing to avoid the key prop error
interface FragmentProps {
  children?: React.ReactNode;
  // Allow key as a property but it won't be part of the props passed to the component
  key?: React.Key;
}

// Add TypeScript definitions for component props
interface AgentCardProps {
  agent: Agent;
  // Allow key as a property but it won't be part of the props passed to the component
  key?: React.Key;
}

interface AgentListItemProps {
  agent: Agent;
  // Allow key as a property but it won't be part of the props passed to the component
  key?: React.Key;
}

interface AgentDirectoryCardProps {
  agent: Agent;
  // Allow key as a property but it won't be part of the props passed to the component
  key?: React.Key;
}

interface SavingsGoalProps {
  goal: SavingsGoal;
  onAddToGoal: (goalId: string) => void;
  // Allow key as a property but it won't be part of the props passed to the component
  key?: React.Key;
}

interface TreasureItemProps {
  treasure: Treasure;
  onClick: (treasure: Treasure) => void;
  isSelected: boolean;
  // Allow key as a property but it won't be part of the props passed to the component
  key?: React.Key;
}

interface MatrixDropProps {
  char: string;
  x: number;
  y: number;
  speed: number;
  opacity: number;
  delay: number;
  // Allow key as a property but it won't be part of the props passed to the component
  key?: React.Key;
}

interface MainContentProps {
  children: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface ContentProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

interface DistributionLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

// Define tooltip provider props
interface TooltipProviderProps {
  children: React.ReactNode;
}
