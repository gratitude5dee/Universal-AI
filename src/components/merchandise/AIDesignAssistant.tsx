import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles, Code } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIDesignAssistantProps {
  onDesignGenerated: (imageUrl: string, prompt: string) => void;
}

export const AIDesignAssistant: React.FC<AIDesignAssistantProps> = ({
  onDesignGenerated,
}) => {
  const [mode, setMode] = useState<'natural' | 'json'>('natural');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt required',
        description: 'Please describe the design you want to create.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-merch-design', {
        body: {
          prompt: mode === 'natural' ? prompt : undefined,
          jsonPrompt: mode === 'json' ? JSON.parse(prompt) : undefined,
          mode: mode,
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: 'Design generated!',
        description: 'Your AI-powered design is ready.',
      });

      onDesignGenerated(data.imageUrl, prompt);
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Failed to generate design',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const insertJSONTemplate = () => {
    const template = {
      design_type: 'illustration',
      style: 'art_deco',
      subject: 'saxophone_silhouette',
      color_palette: {
        primary: '#D4AF37',
        secondary: '#2C3E50',
        accent: '#E67E22',
        mood: 'warm',
      },
      composition: {
        focal_point: 'center',
        balance: 'symmetrical',
        text_placement: 'arch_top',
      },
      elements: [
        {
          type: 'text',
          content: 'JAZZ FESTIVAL',
          font: 'didot_bold',
          size: 48,
          position: 'top_center',
        },
      ],
      effects: ['halftone', 'texture_grain'],
    };

    setPrompt(JSON.stringify(template, null, 2));
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="h-5 w-5" />
          AI Design Assistant
        </CardTitle>
        <CardDescription className="text-white/70">
          Generate unique designs with AI - use natural language or JSON for precise control
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'natural' | 'json')}>
          <TabsList className="grid grid-cols-2 mb-4 bg-white/10">
            <TabsTrigger value="natural" className="data-[state=active]:bg-studio-accent text-white">
              Natural Language
            </TabsTrigger>
            <TabsTrigger value="json" className="data-[state=active]:bg-studio-accent text-white">
              <Code className="h-4 w-4 mr-2" />
              JSON Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="natural" className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your design: A vintage rock poster with psychedelic elements, warm color palette, and bold typography..."
              className="min-h-[150px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-white/70">JSON Schema</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={insertJSONTemplate}
                className="text-white hover:bg-white/20"
              >
                Insert Template
              </Button>
            </div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='{"design_type": "illustration", "style": "modern", ...}'
              className="min-h-[300px] font-mono text-sm bg-black/50 border-white/20 text-white placeholder:text-white/50"
              spellCheck={false}
            />
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full mt-4 bg-studio-accent hover:bg-studio-accent/90 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Design...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Design
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};