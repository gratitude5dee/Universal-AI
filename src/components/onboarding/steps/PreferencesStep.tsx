import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Cpu, Link2, Palette } from 'lucide-react';
import { useOnboarding } from '@/context/OnboardingContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOnboardingNavigation } from '@/hooks/useOnboardingNavigation';

interface PreferencesStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PreferencesStep: React.FC<PreferencesStepProps> = ({ onNext, onBack }) => {
  const { preferences, setPreferences } = useOnboarding();
  const { handleAreaClick } = useOnboardingNavigation({ onNext, onBack });

  return (
    <div 
      className="bg-background/20 backdrop-blur-sm border border-border rounded-lg max-w-3xl mx-auto p-8 cursor-pointer"
      onClick={handleAreaClick}
      role="button"
      tabIndex={0}
      aria-label="Click anywhere or press Enter/Space to continue to next step"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Tuning the Orrery</h2>
        <p className="text-muted-foreground">Set the core parameters for your AI and creative environment.</p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/10 p-4 rounded-lg">
                <label className="flex items-center text-lg font-medium mb-2"><Cpu className="mr-2 h-5 w-5 text-primary"/> Preferred LLM</label>
                <Select value={preferences.llm} onValueChange={(value) => setPreferences({ llm: value })}>
                    <SelectTrigger className="w-full bg-background/50 border-border" data-interactive="true"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="gpt-4o">GPT-4o</SelectItem><SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem><SelectItem value="llama-3">Llama 3</SelectItem></SelectContent>
                </Select>
            </div>
             <div className="bg-muted/10 p-4 rounded-lg">
                <label className="flex items-center text-lg font-medium mb-2"><Link2 className="mr-2 h-5 w-5 text-primary"/> Default Blockchain</label>
                <Select value={preferences.chain} onValueChange={(value) => setPreferences({ chain: value })}>
                    <SelectTrigger className="w-full bg-background/50 border-border" data-interactive="true"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="ethereum">Ethereum</SelectItem><SelectItem value="solana">Solana</SelectItem><SelectItem value="base">Base</SelectItem></SelectContent>
                </Select>
            </div>
        </div>
        <div className="bg-muted/10 p-4 rounded-lg">
            <label className="flex items-center text-lg font-medium mb-2"><Palette className="mr-2 h-5 w-5 text-primary"/> Creative Style</label>
            <Select value={preferences.style} onValueChange={(value) => setPreferences({ style: value })}>
                <SelectTrigger className="w-full bg-background/50 border-border" data-interactive="true"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="balanced">Balanced</SelectItem><SelectItem value="expressive">Expressive</SelectItem><SelectItem value="technical">Technical</SelectItem><SelectItem value="minimalist">Minimalist</SelectItem></SelectContent>
            </Select>
        </div>
      </div>
      
      <div className="flex justify-between mt-8 pt-4 border-t border-border">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={onNext} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Finalize <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PreferencesStep;