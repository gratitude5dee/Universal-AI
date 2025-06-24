import React from "react";
import { Cpu, Bot, Paintbrush, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface AIModelStepProps {
  aiModel: string;
  setAiModel: (model: string) => void;
  agentPurpose: string;
}

const AIModelStep: React.FC<AIModelStepProps> = ({ aiModel, setAiModel, agentPurpose }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white animate-pulse text-shadow-sm">AI Model Selection</h2>
        <p className="text-white/80 text-shadow-sm">Choose the AI models and configure their parameters</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          className={`backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl cursor-pointer transition-all ${aiModel === 'gpt-4o' ? 'border-emerald-500 bg-emerald-50/10 shadow-lg' : 'hover:border-emerald-200'}`}
          onClick={() => setAiModel('gpt-4o')}
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100/30 flex items-center justify-center">
            <Cpu className="h-5 w-5 text-emerald-500" />
          </div>
          <h3 className="font-medium mt-4 mb-1 text-white text-shadow-sm">GPT-4o</h3>
          <p className="text-sm text-white/80 text-shadow-sm">Advanced multimodal model with deep knowledge and reasoning</p>
          <div className="mt-4 text-xs text-white/70 flex items-center">
            <span className="mr-4">Cost: $$$</span>
            <span>Quality: Very High</span>
          </div>
        </div>
        
        <div 
          className={`backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl cursor-pointer transition-all ${aiModel === 'claude-3' ? 'border-blue-500 bg-blue-50/10 shadow-lg' : 'hover:border-blue-200'}`}
          onClick={() => setAiModel('claude-3')}
        >
          <div className="w-10 h-10 rounded-full bg-blue-100/30 flex items-center justify-center">
            <Bot className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="font-medium mt-4 mb-1 text-white text-shadow-sm">Claude 3</h3>
          <p className="text-sm text-white/80 text-shadow-sm">Balanced AI with strong creative capabilities</p>
          <div className="mt-4 text-xs text-white/70 flex items-center">
            <span className="mr-4">Cost: $$</span>
            <span>Quality: High</span>
          </div>
        </div>
        
        <div 
          className={`backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl cursor-pointer transition-all ${aiModel === 'stable-diffusion' ? 'border-indigo-500 bg-indigo-50/10 shadow-lg' : 'hover:border-indigo-200'}`}
          onClick={() => setAiModel('stable-diffusion')}
        >
          <div className="w-10 h-10 rounded-full bg-indigo-100/30 flex items-center justify-center">
            <Paintbrush className="h-5 w-5 text-indigo-500" />
          </div>
          <h3 className="font-medium mt-4 mb-1 text-white text-shadow-sm">Stable Diffusion XL</h3>
          <p className="text-sm text-white/80 text-shadow-sm">Specialized image generation model</p>
          <div className="mt-4 text-xs text-white/70 flex items-center">
            <span className="mr-4">Cost: $</span>
            <span>Quality: High for Images</span>
          </div>
        </div>
        
        <div 
          className={`backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl cursor-pointer transition-all ${aiModel === 'llama-3' ? 'border-purple-500 bg-purple-50/10 shadow-lg' : 'hover:border-purple-200'}`}
          onClick={() => setAiModel('llama-3')}
        >
          <div className="w-10 h-10 rounded-full bg-purple-100/30 flex items-center justify-center">
            <Bot className="h-5 w-5 text-purple-500" />
          </div>
          <h3 className="font-medium mt-4 mb-1 text-white text-shadow-sm">Llama 3</h3>
          <p className="text-sm text-white/80 text-shadow-sm">Open-source model with flexible deployment options</p>
          <div className="mt-4 text-xs text-white/70 flex items-center">
            <span className="mr-4">Cost: $</span>
            <span>Quality: Good</span>
          </div>
        </div>
      </div>
      
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl">
        <h3 className="font-medium mb-3 text-white text-shadow-sm">Parameter Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <div className="flex justify-between">
              <Label htmlFor="temperature" className="text-sm text-white text-shadow-sm">Temperature</Label>
              <span className="text-xs text-white/70">0.7</span>
            </div>
            <input type="range" min="0" max="2" step="0.1" defaultValue="0.7" id="temperature" className="w-full mt-1" />
            <div className="flex justify-between text-xs text-white/70 mt-1">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label htmlFor="max-tokens" className="text-sm text-white text-shadow-sm">Max Tokens</Label>
              <span className="text-xs text-white/70">2048</span>
            </div>
            <input type="range" min="512" max="8192" step="512" defaultValue="2048" id="max-tokens" className="w-full mt-1" />
            <div className="flex justify-between text-xs text-white/70 mt-1">
              <span>Brief</span>
              <span>Detailed</span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="system-prompt" className="text-sm text-white text-shadow-sm">System Prompt</Label>
            <Textarea 
              id="system-prompt" 
              className="mt-1 h-20 text-white backdrop-blur-sm bg-white/10 border border-white/20 placeholder:text-white/50"
              placeholder="You are an AI assistant that specializes in..."
            />
          </div>
          
          <div>
            <Label htmlFor="stop-sequences" className="text-sm text-white text-shadow-sm">Stop Sequences (Optional)</Label>
            <Input 
              id="stop-sequences" 
              className="mt-1 text-white backdrop-blur-sm bg-white/10 border border-white/20 placeholder:text-white/50"
              placeholder="END, STOP, etc. (comma separated)"
            />
            <p className="text-xs text-white/70 mt-1">These sequences will signal the AI to stop generating content</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center bg-blue-50/30 backdrop-blur-sm p-4 rounded-lg border border-blue-100/30">
        <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
        <p className="text-sm text-white text-shadow-sm">
          <strong>AI Assistant:</strong> For {agentPurpose === 'art' ? 'visual content' : agentPurpose === 'music' ? 'audio generation' : 'creative writing'}, I recommend using {aiModel === 'gpt-4o' ? 'GPT-4o with temperature 0.8' : aiModel === 'claude-3' ? 'Claude 3 with temperature 0.7' : aiModel === 'stable-diffusion' ? 'Stable Diffusion with higher guidance scale' : 'Llama 3 with a detailed system prompt'}.
        </p>
      </div>
    </div>
  );
};

export default AIModelStep;