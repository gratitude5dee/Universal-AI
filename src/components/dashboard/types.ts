import { Node } from '@xyflow/react';

export interface DashboardNodeData extends Record<string, unknown> {
  label: string;
  component?: React.ComponentType<any>;
  props?: any;
}

export type DashboardNode = Node<DashboardNodeData>;

export const DASHBOARD_NODE_TYPES = {
  GREETING: 'greeting',
  FINANCIAL: 'financial',
  CREATIONS: 'creations',
  VOICE_ASSISTANT: 'voiceAssistant',
  SCHEDULE: 'schedule',
  CHAT: 'chat',
  ACTIONS: 'actions',
} as const;

export type DashboardNodeType = typeof DASHBOARD_NODE_TYPES[keyof typeof DASHBOARD_NODE_TYPES];