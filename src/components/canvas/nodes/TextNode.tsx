import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Type, Edit3, Check, X } from 'lucide-react';

const TextNode: React.FC<NodeProps> = ({ data, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(String(data?.content || ''));

  const handleSave = useCallback(() => {
    // Update node data
    setIsEditing(false);
  }, []);

  const handleCancel = useCallback(() => {
    setContent(String(data?.content || ''));
    setIsEditing(false);
  }, [data?.content]);

  return (
    <Card className="min-w-[200px] max-w-[400px] bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-studio-accent" />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-studio-accent" />
            <span className="text-sm font-medium text-studio-clay">Text</span>
          </div>
          
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6 p-0"
            >
              <Edit3 className="w-3 h-3" />
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="h-6 w-6 p-0 text-green-600"
              >
                <Check className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-6 w-6 p-0 text-red-600"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your text..."
            className="min-h-[80px] resize-none border-studio-sand/30"
            autoFocus
          />
        ) : (
          <div 
            className="min-h-[80px] p-2 rounded-md border border-studio-sand/30 bg-white/50 cursor-text"
            onClick={() => setIsEditing(true)}
          >
            {content || <span className="text-gray-400 italic">Click to add text...</span>}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-studio-accent" />
    </Card>
  );
};

export default TextNode;