import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { User, Edit3, Check, X } from 'lucide-react';

interface UserNodeData {
  text: string;
  nodeType: 'user';
}

interface UserNodeProps {
  data: UserNodeData;
  selected?: boolean;
  id: string;
  onUpdate?: (id: string, newText: string) => void;
}

const UserNode = memo(({ data, selected, id, onUpdate }: UserNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.text);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(id, editText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(data.text);
    setIsEditing(false);
  };

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      
      <Card className={`min-w-[200px] max-w-[300px] ${selected ? 'ring-2 ring-blue-400' : ''} 
        bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border-blue-400/50`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-100">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">User Input</span>
            </div>
            {!isEditing && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0 text-blue-200 hover:text-white hover:bg-blue-500/20"
              >
                <Edit3 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-[60px] bg-white/10 border-white/30 text-white placeholder-white/50"
                placeholder="Enter your message..."
              />
              <div className="flex gap-1">
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="h-6 px-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-6 px-2 text-white border-white/30 hover:bg-white/10"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-white/90 whitespace-pre-wrap break-words">
              {data.text || 'Click edit to add your message'}
            </div>
          )}
        </CardContent>
      </Card>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </>
  );
});

UserNode.displayName = 'UserNode';

export default UserNode;