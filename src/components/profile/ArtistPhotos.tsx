import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ArtistPhotos = () => {
    const photos = [
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400&h=400&fit=crop",
    ];

    return (
        <Card id="photos" className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white text-shadow-sm">Artist Photos</h3>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Plus size={16} className="mr-2" />
                    Upload
                </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((src, i) => (
                    <motion.div 
                        key={i} 
                        className="aspect-square rounded-lg overflow-hidden bg-white/10 border border-white/20" 
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <img 
                            src={src} 
                            alt={`Artist Photo ${i+1}`} 
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                    </motion.div>
                ))}
            </div>
        </Card>
    );
};

export default ArtistPhotos;