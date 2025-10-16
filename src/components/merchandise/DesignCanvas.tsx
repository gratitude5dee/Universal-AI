import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, Textbox, FabricImage } from 'fabric';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  MousePointer2, 
  Pencil, 
  Square, 
  Circle as CircleIcon, 
  Type,
  Trash2,
  Undo2,
  Redo2,
  Download,
  Save,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DesignCanvasProps {
  initialImage?: string;
  onSave?: (canvasData: any, imageUrl: string) => void;
  productTemplate?: any;
}

export const DesignCanvas: React.FC<DesignCanvasProps> = ({
  initialImage,
  onSave,
  productTemplate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'draw' | 'rectangle' | 'circle' | 'text'>('select');
  const [activeColor, setActiveColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const { toast } = useToast();

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 800,
      backgroundColor: '#ffffff',
    });

    // Initialize drawing brush
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = brushSize;

    setFabricCanvas(canvas);

    // Load initial image if provided
    if (initialImage) {
      FabricImage.fromURL(initialImage, {
        crossOrigin: 'anonymous'
      }).then((img) => {
        img.scaleToWidth(400);
        img.set({ left: 200, top: 200 });
        canvas.add(img);
        canvas.renderAll();
      });
    }

    return () => {
      canvas.dispose();
    };
  }, []);

  // Update brush settings when tool or color changes
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === 'draw';
    
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
    }
  }, [activeTool, activeColor, brushSize, fabricCanvas]);

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);

    if (!fabricCanvas) return;

    if (tool === 'rectangle') {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: activeColor,
        width: 200,
        height: 150,
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
    } else if (tool === 'circle') {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: activeColor,
        radius: 75,
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
    } else if (tool === 'text') {
      const text = new Textbox('Your Text Here', {
        left: 100,
        top: 100,
        fill: activeColor,
        fontSize: 32,
        fontWeight: 'bold',
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    fabricCanvas.renderAll();
    toast({
      title: 'Canvas cleared',
      description: 'All objects have been removed.',
    });
  };

  const handleDelete = () => {
    if (!fabricCanvas) return;
    const activeObjects = fabricCanvas.getActiveObjects();
    activeObjects.forEach(obj => fabricCanvas.remove(obj));
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
  };

  const handleUndo = () => {
    // Note: Full undo/redo requires state history management
    toast({
      title: 'Undo',
      description: 'Full undo system coming soon!',
    });
  };

  const handleSave = () => {
    if (!fabricCanvas) return;

    const canvasData = fabricCanvas.toJSON();
    const imageDataUrl = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2, // 2x resolution for print quality
    });

    if (onSave) {
      onSave(canvasData, imageDataUrl);
    }

    toast({
      title: 'Design saved',
      description: 'Your design has been saved successfully.',
    });
  };

  const handleExport = () => {
    if (!fabricCanvas) return;

    const dataUrl = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 3, // 3x for high-quality print
    });

    const link = document.createElement('a');
    link.download = `design-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    toast({
      title: 'Design exported',
      description: 'High-resolution PNG downloaded.',
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      FabricImage.fromURL(imgUrl, {
        crossOrigin: 'anonymous'
      }).then((img) => {
        img.scaleToWidth(300);
        img.set({ left: 250, top: 250 });
        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);
        fabricCanvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'draw', icon: Pencil, label: 'Draw' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: CircleIcon, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  return (
    <div className="grid grid-cols-[auto_1fr] gap-4">
      {/* Toolbar */}
      <Card className="backdrop-blur-md bg-white/10 border-white/20 p-4 space-y-4">
        <div className="space-y-2">
          <Label className="text-white text-xs">Tools</Label>
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? 'default' : 'outline'}
              size="icon"
              onClick={() => handleToolClick(tool.id as any)}
              className={`w-full ${
                activeTool === tool.id 
                  ? 'bg-studio-accent hover:bg-studio-accent/90' 
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              } text-white`}
              title={tool.label}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <Separator className="bg-white/20" />

        {/* Color Picker */}
        <div className="space-y-2">
          <Label className="text-white text-xs">Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={activeColor}
              onChange={(e) => setActiveColor(e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Brush Size (for drawing) */}
        {activeTool === 'draw' && (
          <div className="space-y-2">
            <Label className="text-white text-xs">Brush Size: {brushSize}px</Label>
            <Slider
              value={[brushSize]}
              onValueChange={(value) => setBrushSize(value[0])}
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
          </div>
        )}

        <Separator className="bg-white/20" />

        {/* Actions */}
        <div className="space-y-2">
          <Label className="text-white text-xs">Actions</Label>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="w-full bg-white/10 border-white/20 text-white hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Clear All
          </Button>

          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('image-upload')?.click()}
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        </div>

        <Separator className="bg-white/20" />

        {/* Save/Export */}
        <div className="space-y-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            className="w-full bg-studio-accent hover:bg-studio-accent/90 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PNG
          </Button>
        </div>
      </Card>

      {/* Canvas Area */}
      <Card className="backdrop-blur-md bg-white/10 border-white/20 overflow-hidden">
        <CardContent className="p-6 flex items-center justify-center bg-gray-900/50">
          <div className="relative">
            <canvas ref={canvasRef} className="border-2 border-white/20 rounded-lg shadow-2xl" />
            {productTemplate && (
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-xs">
                Print Area: {productTemplate.print_areas?.front?.width || 12}" x {productTemplate.print_areas?.front?.height || 16}"
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};