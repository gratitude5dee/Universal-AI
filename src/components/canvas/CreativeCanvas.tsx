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
import CanvasToolbar from './CanvasToolbar';
import { motion } from 'framer-motion';

const nodeTypes: NodeTypes = {
  text: TextNode,
  image: ImageNode,
  task: TaskNode,
  moodboard: MoodboardNode,
};

interface CreativeCanvasProps {
  boardId?: string;
  isReadOnly?: boolean;
}

const CreativeCanvas: React.FC<CreativeCanvasProps> = ({ boardId, isReadOnly = false }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      const { data, error } = await supabase
        .from('boards')
        .select('canvas_data')
        .eq('id', boardId)
        .single();

      if (error) throw error;

      if (data?.canvas_data) {
        const canvasData = data.canvas_data as any;
        setNodes(canvasData.nodes || []);
        setEdges(canvasData.edges || []);
      }
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
          canvas_data: canvasData,
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
        label: type === 'text' ? 'New Text' : `New ${type}`,
        content: '',
      },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

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
        <CanvasToolbar onAddNode={addNode} />
      )}
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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