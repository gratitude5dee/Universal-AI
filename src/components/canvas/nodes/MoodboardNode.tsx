import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Palette, Edit3, Check, X, Plus } from 'lucide-react';

interface MoodboardItem {
  id: string;
  type: 'color' | 'image' | 'text';
  value: string;
}

const MoodboardNode: React.FC<NodeProps> = ({ data, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(String(data?.title || 'Moodboard'));
  const [items, setItems] = useState<MoodboardItem[]>(Array.isArray(data?.items) ? data.items : []);
  const [newItemValue, setNewItemValue] = useState('');
  const [newItemType, setNewItemType] = useState<'color' | 'image' | 'text'>('color');

  const handleSave = useCallback(() => {
    // Update node data
    setIsEditing(false);
  }, []);

  const handleCancel = useCallback(() => {
    setTitle(data?.title || 'Moodboard');
    setItems(data?.items || []);
    setIsEditing(false);
  }, [data?.title, data?.items]);

  const addItem = useCallback(() => {
    if (newItemValue.trim()) {
      const newItem: MoodboardItem = {
        id: Date.now().toString(),
        type: newItemType,
        value: newItemValue.trim(),
      };
      setItems([...items, newItem]);
      setNewItemValue('');
    }
  }, [newItemValue, newItemType, items]);

  const removeItem = useCallback((itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  }, [items]);

  const renderItem = (item: MoodboardItem) => {
    switch (item.type) {
      case 'color':
        return (
          <div 
            className="w-12 h-12 rounded-md border border-studio-sand/30 shadow-sm"
            style={{ backgroundColor: item.value }}
            title={item.value}
          />
        );
      case 'image':
        return (
          <img
            src={item.value}
            alt="Moodboard item"
            className="w-12 h-12 object-cover rounded-md border border-studio-sand/30"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        );
      case 'text':
        return (
          <Badge variant="outline" className="text-xs">
            {item.value}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="min-w-[300px] max-w-[400px] bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-studio-accent" />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-studio-accent" />
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-sm font-medium border-studio-sand/30"
              />
            ) : (
              <span className="text-sm font-medium text-studio-clay">{title}</span>
            )}
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

        <div className="grid grid-cols-4 gap-2 mb-3 max-h-40 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              {renderItem(item)}
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-2 h-2" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                value={newItemType}
                onChange={(e) => setNewItemType(e.target.value as 'color' | 'image' | 'text')}
                className="px-2 py-1 border border-studio-sand/30 rounded text-sm"
              >
                <option value="color">Color</option>
                <option value="image">Image</option>
                <option value="text">Text</option>
              </select>
              <Button
                onClick={addItem}
                size="sm"
                className="bg-studio-accent hover:bg-studio-accent/90"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <Input
              placeholder={
                newItemType === 'color' ? 'Enter hex color (#000000)' :
                newItemType === 'image' ? 'Enter image URL' :
                'Enter text'
              }
              value={newItemValue}
              onChange={(e) => setNewItemValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              className="border-studio-sand/30"
            />
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-studio-accent" />
    </Card>
  );
};

export default MoodboardNode;