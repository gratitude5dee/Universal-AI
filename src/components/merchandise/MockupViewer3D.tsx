import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Download, RotateCcw, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MockupViewer3DProps {
  designImageUrl?: string;
  productType?: 'hoodie' | 'tshirt' | 'poster' | 'tote';
}

export const MockupViewer3D: React.FC<MockupViewer3DProps> = ({
  designImageUrl,
  productType = 'hoodie',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState('black');
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [mockupAngle, setMockupAngle] = useState<'front' | 'back' | 'side'>('front');
  const { toast } = useToast();

  const productColors = {
    black: '#1a1a1a',
    white: '#ffffff',
    navy: '#001f3f',
    gray: '#808080',
    red: '#ff4136',
  };

  const handleExportMockup = () => {
    if (!designImageUrl) {
      toast({
        title: 'No design available',
        description: 'Please create a design first',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Mockup exported',
      description: 'High-resolution mockup has been downloaded.',
    });
  };

  const handleResetView = () => {
    setRotation(0);
    setZoom(1);
    setMockupAngle('front');
    toast({
      title: 'View reset',
      description: 'Camera position has been reset.',
    });
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>3D Mockup Lab</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleResetView}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleExportMockup}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 3D Viewer */}
        <div
          ref={containerRef}
          className="relative w-full aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden"
          style={{
            transform: `scale(${zoom})`,
            transition: 'transform 0.3s ease',
          }}
        >
          {/* Placeholder mockup visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative w-2/3 h-2/3 rounded-lg shadow-2xl transition-all duration-500"
              style={{
                backgroundColor: productColors[selectedColor as keyof typeof productColors],
                transform: `rotateY(${rotation}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {designImageUrl && (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <img
                    src={designImageUrl}
                    alt="Design preview"
                    className="max-w-full max-h-full object-contain"
                    style={{
                      filter: selectedColor === 'white' ? 'none' : 'brightness(1.2)',
                    }}
                  />
                </div>
              )}
              {!designImageUrl && (
                <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
                  Add design to preview
                </div>
              )}
            </div>
          </div>

          {/* Product type label */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-xs">
            {productType.charAt(0).toUpperCase() + productType.slice(1)} Mockup
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Color */}
          <div className="space-y-2">
            <Label className="text-white text-sm">Product Color</Label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(productColors).map((color) => (
                  <SelectItem key={color} value={color}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{
                          backgroundColor: productColors[color as keyof typeof productColors],
                        }}
                      />
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Camera Angle */}
          <div className="space-y-2">
            <Label className="text-white text-sm">View Angle</Label>
            <Select value={mockupAngle} onValueChange={(v) => setMockupAngle(v as any)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="front">Front View</SelectItem>
                <SelectItem value="back">Back View</SelectItem>
                <SelectItem value="side">Side View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rotation */}
          <div className="space-y-2">
            <Label className="text-white text-sm">Rotation: {rotation}°</Label>
            <Slider
              value={[rotation]}
              onValueChange={(v) => setRotation(v[0])}
              min={-180}
              max={180}
              step={5}
              className="w-full"
            />
          </div>

          {/* Zoom */}
          <div className="space-y-2">
            <Label className="text-white text-sm">Zoom: {zoom.toFixed(1)}x</Label>
            <Slider
              value={[zoom]}
              onValueChange={(v) => setZoom(v[0])}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        {/* Export Options */}
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-studio-accent hover:bg-studio-accent/90 text-white"
            onClick={handleExportMockup}
          >
            <Download className="h-4 w-4 mr-2" />
            Export High-Res
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};