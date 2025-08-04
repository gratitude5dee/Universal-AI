import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Bot, Loader2 } from 'lucide-react';

interface AINodeData {
  text: string;
  nodeType: 'ai';
  isStreaming?: boolean;
}

interface AINodeProps {
  data: AINodeData;
  selected?: boolean;
}

const AINode = memo(({ data, selected }: AINodeProps) => {
  return (
    <>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
      
      <Card className={`min-w-[200px] max-w-[300px] ${selected ? 'ring-2 ring-purple-400' : ''} 
        bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border-purple-400/50`}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-purple-100">
            {data.isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">AI Response</span>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="text-sm text-white/90 whitespace-pre-wrap break-words">
            {data.text || (data.isStreaming ? 'Generating response...' : 'No response yet')}
            {data.isStreaming && (
              <span className="animate-pulse">▋</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
    </>
  );
});

AINode.displayName = 'AINode';

export default AINode;