
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
  key?: React.Key;
}

// Add TypeScript definitions for component props
interface AgentCardProps {
  agent: Agent;
  key?: React.Key;
}

interface AgentListItemProps {
  agent: Agent;
  key?: React.Key;
}

interface AgentDirectoryCardProps {
  agent: Agent;
  key?: React.Key;
}

interface SavingsGoalProps {
  goal: SavingsGoal;
  onAddToGoal: (goalId: string) => void;
  key?: React.Key;
}

interface TreasureItemProps {
  treasure: Treasure;
  onClick: (treasure: Treasure) => void;
  isSelected: boolean;
  key?: React.Key;
}

interface MatrixDropProps {
  char: string;
  x: number;
  y: number;
  speed: number;
  opacity: number;
  delay: number;
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
