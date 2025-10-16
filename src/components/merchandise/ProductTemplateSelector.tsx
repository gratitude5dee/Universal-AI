import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProductTemplates, ProductTemplate } from '@/hooks/useProductTemplates';
import { Loader2, Shirt, Printer, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductTemplateSelectorProps {
  onSelectTemplate: (template: ProductTemplate) => void;
  selectedTemplate?: ProductTemplate;
}

export const ProductTemplateSelector: React.FC<ProductTemplateSelectorProps> = ({
  onSelectTemplate,
  selectedTemplate,
}) => {
  const { templates, isLoading, getTemplatesByCategory } = useProductTemplates();

  if (isLoading) {
    return (
      <Card className="backdrop-blur-md bg-white/10 border-white/20">
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </CardContent>
      </Card>
    );
  }

  const apparelTemplates = getTemplatesByCategory('apparel');
  const accessoryTemplates = getTemplatesByCategory('accessories');
  const printTemplates = getTemplatesByCategory('print');

  const renderTemplateGrid = (templates: ProductTemplate[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={`cursor-pointer transition-all hover:scale-105 ${
            selectedTemplate?.id === template.id
              ? 'ring-2 ring-studio-accent bg-studio-accent/20'
              : 'bg-white/10'
          } backdrop-blur-md border-white/20`}
          onClick={() => onSelectTemplate(template)}
        >
          <CardHeader className="p-4">
            {template.image_url && (
              <img
                src={template.image_url}
                alt={template.name}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
            )}
            <CardTitle className="text-sm text-white">{template.name}</CardTitle>
            <CardDescription className="text-xs text-white/70">
              From ${template.base_cost.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xs text-white/60 space-y-1">
              {template.specifications?.material && (
                <div>Material: {template.specifications.material}</div>
              )}
              {template.specifications?.sizes && (
                <div>Sizes: {template.specifications.sizes.join(', ')}</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Choose Your Product</CardTitle>
        <CardDescription className="text-white/70">
          Select a product template to start designing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="apparel">
          <TabsList className="grid grid-cols-3 mb-6 bg-white/10">
            <TabsTrigger value="apparel" className="data-[state=active]:bg-studio-accent text-white">
              <Shirt className="h-4 w-4 mr-2" />
              Apparel
            </TabsTrigger>
            <TabsTrigger value="accessories" className="data-[state=active]:bg-studio-accent text-white">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Accessories
            </TabsTrigger>
            <TabsTrigger value="print" className="data-[state=active]:bg-studio-accent text-white">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </TabsTrigger>
          </TabsList>

          <TabsContent value="apparel">
            {renderTemplateGrid(apparelTemplates)}
          </TabsContent>

          <TabsContent value="accessories">
            {renderTemplateGrid(accessoryTemplates)}
          </TabsContent>

          <TabsContent value="print">
            {renderTemplateGrid(printTemplates)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};