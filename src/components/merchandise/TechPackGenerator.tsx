import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Download, Send, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Material {
  name: string;
  type: string;
  quantity: string;
  supplier?: string;
}

interface TechPackGeneratorProps {
  designId?: string;
  designImageUrl?: string;
  productType?: string;
}

export const TechPackGenerator: React.FC<TechPackGeneratorProps> = ({
  designId,
  designImageUrl,
  productType = 'hoodie',
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [productName, setProductName] = useState('');
  const [materials, setMaterials] = useState<Material[]>([
    { name: 'Main Fabric', type: 'Cotton Fleece', quantity: '2 yards', supplier: '' },
  ]);
  const [printMethod, setPrintMethod] = useState('screen-print');
  const [includeGrading, setIncludeGrading] = useState(true);
  const [includeBOM, setIncludeBOM] = useState(true);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const { toast } = useToast();

  const handleAddMaterial = () => {
    setMaterials([...materials, { name: '', type: '', quantity: '', supplier: '' }]);
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleMaterialChange = (index: number, field: keyof Material, value: string) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index][field] = value;
    setMaterials(updatedMaterials);
  };

  const handleGenerateTechPack = async () => {
    if (!designImageUrl) {
      toast({
        title: 'No design available',
        description: 'Please create a design first',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const techPackData = {
        productName: productName || `${productType} Design`,
        productType,
        designImageUrl,
        materials,
        printMethod,
        includeGrading,
        includeBOM,
        specialInstructions,
        generatedAt: new Date().toISOString(),
      };

      // Call edge function to generate PDF
      const { data, error } = await supabase.functions.invoke('generate-tech-pack', {
        body: techPackData,
      });

      if (error) throw error;

      toast({
        title: 'Tech Pack generated',
        description: 'Your manufacturing documentation is ready.',
      });

      // Download the PDF
      if (data?.pdfUrl) {
        window.open(data.pdfUrl, '_blank');
      }
    } catch (error) {
      console.error('Tech pack generation error:', error);
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToManufacturer = () => {
    toast({
      title: 'Coming soon',
      description: 'Direct manufacturer integration will be available soon.',
    });
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Tech Pack Generator
        </CardTitle>
        <CardDescription className="text-white/70">
          Create professional manufacturing specifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <Label className="text-white text-sm">Product Name</Label>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., Vintage Band Hoodie"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div>
            <Label className="text-white text-sm">Print Method</Label>
            <Select value={printMethod} onValueChange={setPrintMethod}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="screen-print">Screen Printing</SelectItem>
                <SelectItem value="dtg">Direct-to-Garment (DTG)</SelectItem>
                <SelectItem value="heat-transfer">Heat Transfer</SelectItem>
                <SelectItem value="embroidery">Embroidery</SelectItem>
                <SelectItem value="sublimation">Sublimation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bill of Materials */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-white text-sm">Bill of Materials</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddMaterial}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Material
            </Button>
          </div>

          {materials.map((material, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 items-end">
              <Input
                placeholder="Material name"
                value={material.name}
                onChange={(e) => handleMaterialChange(index, 'name', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Input
                placeholder="Type"
                value={material.type}
                onChange={(e) => handleMaterialChange(index, 'type', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Input
                placeholder="Quantity"
                value={material.quantity}
                onChange={(e) => handleMaterialChange(index, 'quantity', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Input
                placeholder="Supplier (optional)"
                value={material.supplier}
                onChange={(e) => handleMaterialChange(index, 'supplier', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRemoveMaterial(index)}
                className="bg-white/10 border-white/20 text-white hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Special Instructions */}
        <div>
          <Label className="text-white text-sm">Special Instructions</Label>
          <Textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special manufacturing notes or requirements..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="grading"
              checked={includeGrading}
              onCheckedChange={(checked) => setIncludeGrading(checked as boolean)}
              className="border-white/20"
            />
            <label
              htmlFor="grading"
              className="text-sm text-white cursor-pointer"
            >
              Include size grading chart
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="bom"
              checked={includeBOM}
              onCheckedChange={(checked) => setIncludeBOM(checked as boolean)}
              className="border-white/20"
            />
            <label
              htmlFor="bom"
              className="text-sm text-white cursor-pointer"
            >
              Include detailed Bill of Materials (BOM)
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleGenerateTechPack}
            disabled={isGenerating}
            className="bg-studio-accent hover:bg-studio-accent/90 text-white"
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generate PDF
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleSendToManufacturer}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Send className="h-4 w-4 mr-2" />
            Send to Manufacturer
          </Button>
        </div>

        {/* Info */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-white/70 text-xs">
            <strong className="text-white">Tech Pack includes:</strong> Product specifications,
            measurements, materials list, print placement guides, color references, and
            manufacturing instructions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};