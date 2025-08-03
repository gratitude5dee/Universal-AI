import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const CoverHighlights = () => {
    const highlights = [
        "Featured on 'Future Beats' Spotify Playlist.",
        "Sold out 'THE TAPE' limited edition vinyl.",
        "Collaborated with renowned digital artist 'PixelDreamer'.",
        "Performed at 'Synthwave Fest 2024'."
    ];
    
    return (
        <Card id="highlights" className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4 text-white text-shadow-sm">Cover Highlights</h3>
            <p className="text-sm text-white/70 mb-4">These key points are used by your AI Booking Agent to pitch you for opportunities.</p>
            <div className="space-y-3">
                {highlights.map((highlight, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-white/10 rounded-lg group hover:bg-white/15 transition-all"
                    >
                        <Sparkles size={16} className="text-yellow-400 flex-shrink-0"/>
                        <p className="text-sm text-white/90 flex-grow">{highlight}</p>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-white/50 hover:text-red-400">
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
            </div>
             <Button variant="outline" className="w-full mt-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Plus size={16} className="mr-2" /> Add Highlight
            </Button>
        </Card>
    );
};

export default CoverHighlights;