import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, File, Upload } from 'lucide-react';

const PressKitSection = () => (
  <Card id="press-kit" className="glass-card p-6">
    <h3 className="text-xl font-semibold mb-4 text-white text-shadow-sm">Press Kit</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="glass-card p-4">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="text-cyan-400" />
          <h4 className="font-medium text-white text-shadow-sm">Website</h4>
        </div>
        <p className="text-xs text-white/70 mb-3">Link to your official website or EPK.</p>
        <input 
          defaultValue="https://gratitud3.art" 
          className="w-full bg-white/10 border border-white/20 rounded p-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" 
        />
      </div>
      <div className="glass-card p-4">
        <div className="flex items-center gap-3 mb-2">
          <File className="text-cyan-400" />
          <h4 className="font-medium text-white text-shadow-sm">PDF Press Kit</h4>
        </div>
        <p className="text-xs text-white/70 mb-3">Upload a styled PDF for offline use.</p>
        <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
          <Upload size={16} className="mr-2" />
          Upload PDF
        </Button>
      </div>
    </div>
  </Card>
);

export default PressKitSection;