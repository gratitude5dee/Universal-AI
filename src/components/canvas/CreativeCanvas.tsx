import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TextNode from './nodes/TextNode';
import ImageNode from './nodes/ImageNode';
import TaskNode from './nodes/TaskNode';
import MoodboardNode from './nodes/MoodboardNode';
import UserNode from './nodes/UserNode';
import AINode from './nodes/AINode';
import CanvasToolbar from './CanvasToolbar';
import PromptPanel from './PromptPanel';
import { motion } from 'framer-motion';

const nodeTypes: NodeTypes = {
  text: TextNode,
  image: ImageNode,
  task: TaskNode,
  moodboard: MoodboardNode,
  user: UserNode,
  ai: AINode,
};

const defaultCanvasPayload = {
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
};

type CanvasPayload = typeof defaultCanvasPayload & Record<string, unknown>;

const scoreCanvasPayload = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') return -1;

  const typedPayload = payload as Partial<CanvasPayload>;
  const nodes = Array.isArray(typedPayload.nodes) ? typedPayload.nodes.length : 0;
  const edges = Array.isArray(typedPayload.edges) ? typedPayload.edges.length : 0;
  const keys = Object.keys(typedPayload).length;

  return nodes * 2 + edges + (keys > 0 ? 1 : 0);
};

const resolveCanvasPayload = (content?: unknown, canvasData?: unknown): CanvasPayload => {
  const contentScore = scoreCanvasPayload(content);
  const canvasDataScore = scoreCanvasPayload(canvasData);

  const payload =
    (contentScore >= canvasDataScore ? content : canvasData)
      ?? content
      ?? canvasData
      ?? defaultCanvasPayload;

  return {
    ...defaultCanvasPayload,
    ...(typeof payload === 'object' ? payload : {}),
  } as CanvasPayload;
};

interface CreativeCanvasProps {
  boardId?: string;
  isReadOnly?: boolean;
}

const CreativeCanvas: React.FC<CreativeCanvasProps> = ({ boardId, isReadOnly = false }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Load canvas data
  useEffect(() => {
    if (boardId) {
      loadCanvasData();
    } else {
      setIsLoading(false);
    }
  }, [boardId]);

  const loadCanvasData = async () => {
    try {
      console.log('Loading canvas data for board:', boardId);
      const { data, error } = await supabase
        .from('boards')
        .select('content, canvas_data')
        .eq('id', boardId)
        .single();

      if (error) {
        console.error('Error loading canvas:', error);
        throw error;
      }

      console.log('Canvas data loaded:', data);
      const canvasPayload = resolveCanvasPayload(data?.content, data?.canvas_data);
      setNodes(canvasPayload.nodes || []);
      setEdges(canvasPayload.edges || []);
    } catch (error) {
      toast({
        title: "Error loading canvas",
        description: "Failed to load canvas data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveCanvasData = useCallback(async () => {
    if (!boardId || isReadOnly) return;

    try {
      const canvasData = {
        nodes,
        edges,
        viewport: { x: 0, y: 0, zoom: 1 }
      };

      const { error } = await supabase
        .from('boards')
        .update({
          content: canvasData,
          canvas_data: canvasData,
          content: canvasData,
          updated_at: new Date().toISOString()
        })
        .eq('id', boardId);

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error saving canvas",
        description: "Failed to save canvas changes",
        variant: "destructive",
      });
    }
  }, [nodes, edges, boardId, isReadOnly, toast]);

  // Auto-save changes
  useEffect(() => {
    const timer = setTimeout(() => {
      saveCanvasData();
    }, 1000);

    return () => clearTimeout(timer);
  }, [nodes, edges, saveCanvasData]);

  const addNode = useCallback((type: string, position?: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: position || { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        text: type === 'user' ? 'Enter your prompt...' : `New ${type}`,
        nodeType: type === 'user' ? 'user' : type === 'ai' ? 'ai' : 'system',
      },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const updateNode = useCallback((nodeId: string, content: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, text: content } }
          : node
      )
    );
  }, [setNodes]);

  const addAIResponse = useCallback((parentNodeId: string, response: string) => {
    const parentNode = nodes.find(n => n.id === parentNodeId);
    if (!parentNode) return;

    const aiNode: Node = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      position: {
        x: parentNode.position.x + 50,
        y: parentNode.position.y + 150,
      },
      data: {
        text: response,
        nodeType: 'ai',
        isStreaming: !response,
      },
    };

    setNodes((nds) => [...nds, aiNode]);
    setEdges((eds) => [...eds, {
      id: `${parentNodeId}-${aiNode.id}`,
      source: parentNodeId,
      target: aiNode.id,
    }]);
  }, [nodes, setNodes, setEdges]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-studio-accent"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full h-full relative bg-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!isReadOnly && (
        <>
          <CanvasToolbar onAddNode={addNode} />
          <div className="absolute top-0 right-0 h-full z-10">
            <PromptPanel
              selectedNode={selectedNode}
              nodes={nodes}
              boardId={boardId}
              onUpdateNode={updateNode}
              onAddAIResponse={addAIResponse}
            />
          </div>
        </>
      )}
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node)}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent"
        style={{ background: 'transparent' }}
      >
        <Background 
          color="rgba(255, 255, 255, 0.1)" 
          gap={20}
          size={1}
        />
        <Controls 
          className="bg-white/10 backdrop-blur-sm border-white/20"
        />
        <MiniMap 
          className="bg-white/10 backdrop-blur-sm border-white/20"
          nodeColor="rgba(255, 255, 255, 0.8)"
        />
      </ReactFlow>
    </motion.div>
  );
};

export default CreativeCanvas;