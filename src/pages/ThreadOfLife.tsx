import React, { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Palette, Box, FileText, Factory, Store, BarChart3, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIDesignAssistant } from "@/components/merchandise/AIDesignAssistant";
import { ProductTemplateSelector } from "@/components/merchandise/ProductTemplateSelector";
import { ProductTemplate } from "@/hooks/useProductTemplates";
import { useDesigns } from "@/hooks/useDesigns";
import { useToast } from "@/hooks/use-toast";

const ThreadOfLife = () => {
  const [activeModule, setActiveModule] = useState('design-studio');
  const [selectedTemplate, setSelectedTemplate] = useState<ProductTemplate | undefined>();
  const [generatedDesignUrl, setGeneratedDesignUrl] = useState<string | undefined>();
  const { createDesign } = useDesigns();
  const { toast } = useToast();

  const handleDesignGenerated = async (imageUrl: string, prompt: string) => {
    setGeneratedDesignUrl(imageUrl);
    
    // Auto-save the generated design
    if (selectedTemplate) {
      try {
        await createDesign.mutateAsync({
          name: `AI Design - ${new Date().toLocaleDateString()}`,
          description: prompt,
          design_type: selectedTemplate.category === 'apparel' ? 'apparel' : 
                       selectedTemplate.category === 'print' ? 'print' : 'accessory',
          design_image_url: imageUrl,
          ai_prompt: prompt,
          status: 'draft',
        });
      } catch (error) {
        console.error('Failed to save design:', error);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Merchandise Studio
          </h1>
          <p className="text-white/70 text-xl">
            From Sketch to Shipping in Minutes
          </p>
        </div>

        <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
          <TabsList className="grid grid-cols-6 w-full backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
            <TabsTrigger value="design-studio" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">
              <Palette className="mr-2 h-4 w-4" />
              Design Studio
            </TabsTrigger>
            <TabsTrigger value="mockup-lab" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">
              <Box className="mr-2 h-4 w-4" />
              Mockup Lab
            </TabsTrigger>
            <TabsTrigger value="tech-pack" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">
              <FileText className="mr-2 h-4 w-4" />
              Tech Packs
            </TabsTrigger>
            <TabsTrigger value="production" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">
              <Factory className="mr-2 h-4 w-4" />
              Production
            </TabsTrigger>
            <TabsTrigger value="storefront" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">
              <Store className="mr-2 h-4 w-4" />
              Storefront
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design-studio" className="pt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="backdrop-blur-md bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="h-5 w-5 text-[#22c55e]" />
                    AI-Powered Design
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Generate unique designs in seconds with AI
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="backdrop-blur-md bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Palette className="h-5 w-5 text-[#6366f1]" />
                    Professional Templates
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Choose from curated product templates
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="backdrop-blur-md bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Box className="h-5 w-5 text-[#f59e0b]" />
                    3D Mockups
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Visualize your designs on products
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIDesignAssistant onDesignGenerated={handleDesignGenerated} />
              
              <Card className="backdrop-blur-md bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Design Preview</CardTitle>
                  <CardDescription className="text-white/70">
                    Your generated design will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedDesignUrl ? (
                    <div className="space-y-4">
                      <img
                        src={generatedDesignUrl}
                        alt="Generated design"
                        className="w-full rounded-lg"
                      />
                      <Button 
                        className="w-full bg-studio-accent hover:bg-studio-accent/90 text-white"
                        onClick={() => setActiveModule('mockup-lab')}
                      >
                        Continue to Mockups
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-white/5 rounded-lg border border-dashed border-white/20">
                      <p className="text-white/70">Generate a design to see preview</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <ProductTemplateSelector
              onSelectTemplate={setSelectedTemplate}
              selectedTemplate={selectedTemplate}
            />
          </TabsContent>

          <TabsContent value="mockup-lab" className="pt-6">
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">3D Mockup Lab</CardTitle>
                <CardDescription className="text-white/70">
                  Visualize your designs on photorealistic product mockups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-96 bg-white/5 rounded-lg border border-dashed border-white/20">
                  <p className="text-white/70">3D mockup viewer coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tech-pack" className="pt-6">
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Tech Pack Generator</CardTitle>
                <CardDescription className="text-white/70">
                  Automated manufacturing documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-96 bg-white/5 rounded-lg border border-dashed border-white/20">
                  <p className="text-white/70">Tech pack generator coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="pt-6">
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Production Pipeline</CardTitle>
                <CardDescription className="text-white/70">
                  Manage manufacturing and orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-96 bg-white/5 rounded-lg border border-dashed border-white/20">
                  <p className="text-white/70">Production pipeline coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storefront" className="pt-6">
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Storefront Publisher</CardTitle>
                <CardDescription className="text-white/70">
                  Launch products to your online stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-96 bg-white/5 rounded-lg border border-dashed border-white/20">
                  <p className="text-white/70">Storefront publisher coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="pt-6">
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Analytics Dashboard</CardTitle>
                <CardDescription className="text-white/70">
                  Track performance across your merchandise catalog
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-96 bg-white/5 rounded-lg border border-dashed border-white/20">
                  <p className="text-white/70">Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ThreadOfLife;