import React, { useState } from "react";
import { motion } from "framer-motion";
import { Paintbrush, Music, FileText, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PurposeStepProps {
  agentPurpose: string;
  setAgentPurpose: (purpose: string) => void;
}

const PurposeStep: React.FC<PurposeStepProps> = ({ agentPurpose, setAgentPurpose }) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold white-bg-heading">Agent Purpose & Capabilities</h2>
        <p className="white-bg-subheading">Select what your AI agent will create or manage</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          className={`relative backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 flex flex-col items-center text-center transition-all cursor-pointer ${agentPurpose === 'art' ? 'border-purple-500 bg-purple-50/10 shadow-lg' : 'hover:border-purple-200'}`}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setAgentPurpose('art')}
        >
          <div className="w-12 h-12 rounded-full bg-purple-100/30 flex items-center justify-center mb-3">
            <Paintbrush className="h-6 w-6 text-purple-500" />
          </div>
          <h3 className="font-medium mb-1 text-blue-dark">Generative Art</h3>
          <p className="text-sm text-blue-dark/70">Creates visual art based on prompts and inputs</p>
        </motion.div>
        
        <motion.div 
          className={`relative backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 flex flex-col items-center text-center transition-all cursor-pointer ${agentPurpose === 'music' ? 'border-blue-500 bg-blue-50/10 shadow-lg' : 'hover:border-blue-200'}`}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setAgentPurpose('music')}
        >
          <div className="w-12 h-12 rounded-full bg-blue-100/30 flex items-center justify-center mb-3">
            <Music className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="font-medium mb-1 text-blue-dark">Music Composition</h3>
          <p className="text-sm text-blue-dark/70">Generates original music and audio compositions</p>
        </motion.div>
        
        <motion.div 
          className={`relative backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 flex flex-col items-center text-center transition-all cursor-pointer ${agentPurpose === 'writing' ? 'border-green-500 bg-green-50/10 shadow-lg' : 'hover:border-green-200'}`}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setAgentPurpose('writing')}
        >
          <div className="w-12 h-12 rounded-full bg-green-100/30 flex items-center justify-center mb-3">
            <FileText className="h-6 w-6 text-green-500" />
          </div>
          <h3 className="font-medium mb-1 text-blue-dark">Creative Writing</h3>
          <p className="text-sm text-blue-dark/70">Writes stories, poetry, articles, and other text</p>
        </motion.div>
      </div>
      
      <div className="pt-4">
        <Label htmlFor="purpose-description" className="text-blue-dark">Description</Label>
        <Textarea 
          id="purpose-description" 
          placeholder="Describe what your agent will do in more detail..."
          className="h-24 mt-2 text-blue-dark"
        />
      </div>
      
      <div className="pt-2 pb-6">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm flex items-center text-blue-dark/70 hover:text-blue-dark"
        >
          {showAdvanced ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
          {showAdvanced ? "Hide advanced options" : "Show advanced options"}
        </button>
        
        {showAdvanced && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-blue-dark">Advanced Capabilities</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input type="checkbox" id="cap-autonomous" className="mr-2" />
                <label htmlFor="cap-autonomous" className="text-sm text-blue-dark">Autonomous operation</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="cap-interactive" className="mr-2" />
                <label htmlFor="cap-interactive" className="text-sm text-blue-dark">Interactive feedback loops</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="cap-collaboration" className="mr-2" />
                <label htmlFor="cap-collaboration" className="text-sm text-blue-dark">Multi-agent collaboration</label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center bg-blue-50 p-4 rounded-lg">
        <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
        <p className="text-sm text-blue-700">
          <strong>AI Assistant:</strong> For generative art, I recommend enabling autonomous operation for continuous creation.
        </p>
      </div>
    </div>
  );
};

export default PurposeStep;