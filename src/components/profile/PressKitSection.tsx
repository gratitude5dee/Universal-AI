import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, File, Upload } from 'lucide-react';

const PressKitSection = () => (
  <div className="glass-card p-8 hover:shadow-xl transition-all duration-300">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-studio-accent/20 p-2 rounded-full">
        <Globe className="text-studio-accent h-5 w-5" />
      </div>
      <h3 className="text-xl font-semibold text-studio-charcoal">Press Kit</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 bg-white/10 backdrop-blur-sm border border-studio-sand/30 rounded-xl hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <Globe className="text-studio-accent" size={18} />
          <h4 className="font-medium text-studio-charcoal">Website</h4>
        </div>
        <p className="text-xs text-studio-muted mb-4">Link to your official website or EPK.</p>
        <input 
          defaultValue="https://gratitud3.art" 
          className="w-full bg-white/50 border border-studio-sand/50 rounded-lg p-3 text-sm text-studio-charcoal placeholder:text-studio-muted focus:outline-none focus:ring-2 focus:ring-studio-accent/50 focus:border-studio-accent transition-all duration-300" 
        />
      </div>
      <div className="p-6 bg-white/10 backdrop-blur-sm border border-studio-sand/30 rounded-xl hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <File className="text-studio-accent" size={18} />
          <h4 className="font-medium text-studio-charcoal">PDF Press Kit</h4>
        </div>
        <p className="text-xs text-studio-muted mb-4">Upload a styled PDF for offline use.</p>
        <Button variant="outline" className="w-full bg-white/50 border-studio-sand/50 text-studio-charcoal hover:bg-white hover:shadow-md transition-all duration-300">
          <Upload size={16} className="mr-2" />
          Upload PDF
        </Button>
      </div>
    </div>
  </div>
);

export default PressKitSection;