import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, Copy, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const LinktreeSection = () => (
    <Card id="linktree" className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4 text-white text-shadow-sm">Generated One-Pager</h3>
        <p className="text-sm text-white/70 mb-4">A shareable, auto-generated website based on your profile data. Perfect for your social media bios.</p>
        
        <motion.div 
            className="flex gap-4 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex-grow p-3 bg-white/10 rounded-lg font-mono text-sm text-cyan-300 flex items-center border border-white/20">
                <Link size={16} className="mr-2 text-cyan-400"/>
                <span>universal.ai/gratitud3</span>
            </div>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Copy size={16} className="mr-2" /> Copy
            </Button>
        </motion.div>
        
        <div className="flex gap-3">
            <Button className="flex-grow bg-studio-accent hover:bg-studio-accent/90 text-white">
                Generate / Update Page
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ExternalLink size={16} />
            </Button>
        </div>
        
        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-white/60 mb-2">Preview includes:</p>
            <ul className="text-xs text-white/70 space-y-1">
                <li>• Artist bio and highlights</li>
                <li>• Latest releases and projects</li>
                <li>• Contact information</li>
                <li>• Social media links</li>
            </ul>
        </div>
    </Card>
);

export default LinktreeSection;