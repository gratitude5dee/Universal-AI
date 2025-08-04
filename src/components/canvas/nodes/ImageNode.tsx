import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Upload, Link, Check, X } from 'lucide-react';

const ImageNode: React.FC<NodeProps> = ({ data, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(String(data?.imageUrl || ''));
  const [altText, setAltText] = useState(String(data?.altText || ''));

  const handleSave = useCallback(() => {
    // Update node data
    setIsEditing(false);
  }, []);

  const handleCancel = useCallback(() => {
    setImageUrl(data?.imageUrl || '');
    setAltText(data?.altText || '');
    setIsEditing(false);
  }, [data?.imageUrl, data?.altText]);

  return (
    <Card className="min-w-[250px] max-w-[350px] bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-studio-accent" />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-studio-accent" />
            <span className="text-sm font-medium text-studio-clay">Image</span>
          </div>
          
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6 p-0"
            >
              <Link className="w-3 h-3" />
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
          <div className="space-y-2">
            <Input
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border-studio-sand/30"
            />
            <Input
              placeholder="Alt text (optional)"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="border-studio-sand/30"
            />
          </div>
        ) : (
          <div className="space-y-2">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={altText || 'Canvas image'}
                className="w-full h-32 object-cover rounded-md border border-studio-sand/30"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            ) : (
              <div 
                className="w-full h-32 border-2 border-dashed border-studio-sand/30 rounded-md flex items-center justify-center cursor-pointer bg-white/50"
                onClick={() => setIsEditing(true)}
              >
                <div className="text-center">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-400">Click to add image</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-studio-accent" />
    </Card>
  );
};

export default ImageNode;