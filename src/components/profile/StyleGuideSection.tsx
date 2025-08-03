import React from 'react';
import { Card } from '@/components/ui/card';
import { Palette, Type, Image } from 'lucide-react';
import { motion } from 'framer-motion';

const StyleGuideSection = () => (
    <Card id="style-guide" className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4 text-white text-shadow-sm">Artist Style Guide</h3>
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h4 className="font-medium flex items-center gap-2 mb-3 text-white text-shadow-sm">
                    <Palette size={16} className="text-cyan-400"/> 
                    Color Palette
                </h4>
                <div className="flex gap-3 flex-wrap">
                    {[
                        { color: '#1a0b2e', name: 'Deep Purple' },
                        { color: '#3d1e6d', name: 'Royal Purple' },
                        { color: '#8c52ff', name: 'Electric Purple' },
                        { color: '#e6007a', name: 'Magenta' },
                        { color: '#ff7f50', name: 'Coral' },
                        { color: '#00f0ff', name: 'Cyan' }
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            className="text-center"
                            whileHover={{ scale: 1.1 }}
                        >
                            <div 
                                className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg"
                                style={{ backgroundColor: item.color }}
                            />
                            <p className="text-xs text-white/70 mt-1">{item.name}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h4 className="font-medium flex items-center gap-2 mb-3 text-white text-shadow-sm">
                    <Type size={16} className="text-cyan-400"/> 
                    Typography
                </h4>
                <div className="space-y-2">
                    <div className="p-3 bg-white/10 rounded-lg">
                        <p className="font-heading text-2xl text-white">Heading: Neue Machina</p>
                        <p className="text-xs text-white/60">Used for titles and headers</p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg">
                        <p className="font-sans text-base text-white">Body: Inter</p>
                        <p className="text-xs text-white/60">Used for body text and descriptions</p>
                    </div>
                </div>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h4 className="font-medium flex items-center gap-2 mb-3 text-white text-shadow-sm">
                    <Image size={16} className="text-cyan-400"/> 
                    Visual Style
                </h4>
                <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square bg-gradient-to-br from-purple-900 to-pink-600 rounded-lg p-3 flex items-center justify-center">
                        <span className="text-xs text-white font-medium text-center">Gradient<br/>Backgrounds</span>
                    </div>
                    <div className="aspect-square bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3 flex items-center justify-center">
                        <span className="text-xs text-white font-medium text-center">Glass<br/>Morphism</span>
                    </div>
                    <div className="aspect-square bg-black/50 rounded-lg p-3 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-cyan-400 opacity-20 animate-pulse"></div>
                        <span className="text-xs text-white font-medium text-center relative z-10">Neon<br/>Accents</span>
                    </div>
                </div>
            </motion.div>
        </div>
    </Card>
);

export default StyleGuideSection;