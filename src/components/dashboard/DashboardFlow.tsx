import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import GreetingNode from './nodes/GreetingNode';
import FinancialOverviewNode from './nodes/FinancialOverviewNode';
import RecentCreationsNode from './nodes/RecentCreationsNode';
import VoiceAssistantNode from './nodes/VoiceAssistantNode';
import ScheduleCalendarNode from './nodes/ScheduleCalendarNode';
import ChatInterfaceNode from './nodes/ChatInterfaceNode';
import SuggestedActionsNode from './nodes/SuggestedActionsNode';
import { DashboardNode, DASHBOARD_NODE_TYPES } from './types';

const nodeTypes = {
  [DASHBOARD_NODE_TYPES.GREETING]: GreetingNode,
  [DASHBOARD_NODE_TYPES.FINANCIAL]: FinancialOverviewNode,
  [DASHBOARD_NODE_TYPES.CREATIONS]: RecentCreationsNode,
  [DASHBOARD_NODE_TYPES.VOICE_ASSISTANT]: VoiceAssistantNode,
  [DASHBOARD_NODE_TYPES.SCHEDULE]: ScheduleCalendarNode,
  [DASHBOARD_NODE_TYPES.CHAT]: ChatInterfaceNode,
  [DASHBOARD_NODE_TYPES.ACTIONS]: SuggestedActionsNode,
};

const initialNodes: DashboardNode[] = [
  {
    id: 'greeting-1',
    type: DASHBOARD_NODE_TYPES.GREETING,
    position: { x: 50, y: 50 },
    data: { label: 'Greeting' },
    style: { width: 300, height: 120 },
  },
  {
    id: 'financial-1',
    type: DASHBOARD_NODE_TYPES.FINANCIAL,
    position: { x: 400, y: 50 },
    data: { label: 'Financial Overview' },
    style: { width: 500, height: 400 },
  },
  {
    id: 'creations-1',
    type: DASHBOARD_NODE_TYPES.CREATIONS,
    position: { x: 50, y: 200 },
    data: { label: 'Recent Creations' },
    style: { width: 400, height: 300 },
  },
  {
    id: 'voice-1',
    type: DASHBOARD_NODE_TYPES.VOICE_ASSISTANT,
    position: { x: 950, y: 50 },
    data: { label: 'Voice Assistant' },
    style: { width: 350, height: 400 },
  },
  {
    id: 'schedule-1',
    type: DASHBOARD_NODE_TYPES.SCHEDULE,
    position: { x: 950, y: 500 },
    data: { label: 'Schedule & Calendar' },
    style: { width: 350, height: 350 },
  },
  {
    id: 'chat-1',
    type: DASHBOARD_NODE_TYPES.CHAT,
    position: { x: 50, y: 550 },
    data: { label: 'Chat Interface' },
    style: { width: 450, height: 600 },
  },
  {
    id: 'actions-1',
    type: DASHBOARD_NODE_TYPES.ACTIONS,
    position: { x: 550, y: 500 },
    data: { label: 'Suggested Actions' },
    style: { width: 350, height: 250 },
  },
];

const initialEdges: Edge[] = [];

const DashboardFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-full bg-transparent">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        snapToGrid={true}
        snapGrid={[20, 20]}
        fitView
        className="bg-transparent"
        style={{ backgroundColor: 'transparent' }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background 
          color="rgba(255, 255, 255, 0.1)" 
          gap={20} 
          size={1}
          style={{ backgroundColor: 'transparent' }}
        />
        <Controls 
          className="react-flow__controls-glass"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
          }}
        />
        <MiniMap 
          className="react-flow__minimap-glass"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
          }}
          nodeColor={() => 'rgba(155, 135, 245, 0.6)'}
        />
      </ReactFlow>
    </div>
  );
};

export default DashboardFlow;