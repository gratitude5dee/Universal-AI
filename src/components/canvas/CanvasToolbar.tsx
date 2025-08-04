import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Type, Image, CheckSquare, Palette, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface CanvasToolbarProps {
  onAddNode: (type: string, position?: { x: number; y: number }) => void;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ onAddNode }) => {
  const toolItems = [
    {
      type: 'text',
      icon: Type,
      label: 'Text',
      description: 'Add text content',
    },
    {
      type: 'image',
      icon: Image,
      label: 'Image',
      description: 'Add images',
    },
    {
      type: 'task',
      icon: CheckSquare,
      label: 'Tasks',
      description: 'Task lists',
    },
    {
      type: 'moodboard',
      icon: Palette,
      label: 'Moodboard',
      description: 'Color & inspiration',
    },
  ];

  return (
    <motion.div
      className="absolute top-4 left-4 z-50"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-3 bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-studio-accent" />
          <span className="text-sm font-medium text-studio-clay">Add Elements</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {toolItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.type}
                variant="ghost"
                size="sm"
                onClick={() => onAddNode(item.type)}
                className="flex flex-col items-center gap-1 h-auto p-3 hover:bg-studio-accent/10 group"
                title={item.description}
              >
                <Icon className="w-5 h-5 text-studio-accent group-hover:scale-110 transition-transform" />
                <span className="text-xs text-studio-clay">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};

export default CanvasToolbar;