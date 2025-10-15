import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Loader2, Send, Zap } from 'lucide-react';
import { Node } from '@xyflow/react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PromptPanelProps {
  selectedNode: Node | null;
  nodes: Node[];
  boardId?: string;
  onUpdateNode: (nodeId: string, content: string) => void;
  onAddAIResponse: (parentNodeId: string, response: string) => void;
}

interface AINode extends Node {
  data: {
    text: string;
    nodeType: 'system' | 'user' | 'ai';
    isStreaming?: boolean;
  };
}

type StreamChunk = {
  choices?: Array<{
    delta?: {
      content?: string;
    };
  }>;
};

const isStreamChunk = (value: unknown): value is StreamChunk => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  return Array.isArray((value as StreamChunk).choices);
};

const PromptPanel = ({ selectedNode, nodes, boardId, onUpdateNode, onAddAIResponse }: PromptPanelProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [model, setModel] = useState('llama3.1-8b');
  const [temperature, setTemperature] = useState([0.8]);
  const [maxTokens, setMaxTokens] = useState([500]);
  const { toast } = useToast();

  // Update prompt when selected node changes
  useEffect(() => {
    if (selectedNode?.data?.text && typeof selectedNode.data.text === 'string') {
      setPrompt(selectedNode.data.text);
    } else {
      setPrompt('');
    }
  }, [selectedNode]);

  // Get conversation lineage for the selected node
  const getLineage = (nodeId: string): AINode[] => {
    const lineage: AINode[] = [];
    const aiNodes = nodes as AINode[];
    
    // Find path from root to selected node
    const findPath = (currentId: string, visited: Set<string> = new Set()): AINode[] => {
      if (visited.has(currentId)) return [];
      visited.add(currentId);
      
      const node = aiNodes.find(n => n.id === currentId);
      if (!node) return [];
      
      // Find parent nodes (nodes that connect to this one)
      const parentEdges = nodes.filter(n => 
        n.id !== currentId && 
        // Check if there's a connection (simplified - you might need to check actual edges)
        Math.abs((n.position?.x || 0) - (node.position?.x || 0)) < 200 &&
        Math.abs((n.position?.y || 0) - (node.position?.y || 0)) < 200
      );

      if (parentEdges.length > 0) {
        const parentPath = findPath(parentEdges[0].id, visited);
        return [...parentPath, node];
      }
      
      return [node];
    };

    return findPath(nodeId);
  };

  const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL ??
    'https://ixkkrousepsiorwlaycp.supabase.co';

  const generateResponse = async () => {
    if (!selectedNode || !boardId) {
      toast({
        title: "Error",
        description: "Please select a node and ensure you're on a saved canvas",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Get conversation lineage
      const lineage = getLineage(selectedNode.id);
      
      // Add current prompt to lineage if editing
      const updatedLineage = [...lineage];
      if (prompt && prompt !== selectedNode.data?.text) {
        updatedLineage[updatedLineage.length - 1] = {
          ...selectedNode,
          data: { ...selectedNode.data, text: prompt, nodeType: 'user' }
        } as AINode;
      }

      console.log('Generating with lineage:', updatedLineage);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        throw sessionError;
      }

      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        throw new Error('No active session found. Please sign in again.');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/cerebras-stream`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          boardId,
          lineage: updatedLineage,
          model,
          temperature: temperature[0],
          maxTokens: maxTokens[0]
        })
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(errorText || 'Failed to connect to AI service');
      }

      // Handle streaming response
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        // Update current node with user input
        if (prompt !== selectedNode.data?.text) {
          onUpdateNode(selectedNode.id, prompt);
        }

        // Create temporary AI response node
        const tempResponseId = `ai-${Date.now()}`;
        onAddAIResponse(selectedNode.id, '');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                toast({
                  title: "Generation Complete",
                  description: "AI response has been generated successfully"
                });
                return;
              }

              try {
                const parsed: unknown = JSON.parse(data);
                if (isStreamChunk(parsed) && parsed.choices?.[0]?.delta?.content) {
                  const content = parsed.choices[0].delta?.content ?? '';
                  fullResponse += content;

                  // Update the AI response node with streaming content
                  onAddAIResponse(selectedNode.id, fullResponse);
                }
              } catch (e) {
                console.error('Error parsing stream chunk:', e);
              }
            }
          }
        }
      }

    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate AI response",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickGenerate = () => {
    if (!prompt.trim()) {
      setPrompt("Generate an innovative idea for a creative project");
    }
    generateResponse();
  };

  return (
    <Card className="w-80 h-full bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Zap className="w-5 h-5" />
          AI Prompt Panel
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Prompt Input */}
        <div className="space-y-2">
          <Label className="text-white/90">Prompt</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt or idea..."
            className="min-h-[120px] bg-white/10 border-white/30 text-white placeholder-white/50"
          />
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label className="text-white/90">Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="bg-white/10 border-white/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="llama3.1-8b">Llama 3.1 8B</SelectItem>
              <SelectItem value="llama3.1-70b">Llama 3.1 70B</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <Label className="text-white/90">Temperature: {temperature[0]}</Label>
          <Slider
            value={temperature}
            onValueChange={setTemperature}
            max={1}
            min={0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Max Tokens */}
        <div className="space-y-2">
          <Label className="text-white/90">Max Tokens: {maxTokens[0]}</Label>
          <Slider
            value={maxTokens}
            onValueChange={setMaxTokens}
            max={1000}
            min={100}
            step={50}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={generateResponse}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Generate Response
              </>
            )}
          </Button>

          <Button
            onClick={handleQuickGenerate}
            disabled={isGenerating}
            variant="outline"
            className="w-full text-white border-white/30 hover:bg-white/10"
          >
            <Zap className="w-4 h-4 mr-2" />
            Quick Generate
          </Button>
        </div>

        {/* Node Info */}
        {selectedNode && (
          <div className="pt-4 border-t border-white/20">
            <Label className="text-white/70 text-sm">
              Selected Node: {(selectedNode as AINode).data?.nodeType || 'Unknown'}
            </Label>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptPanel;