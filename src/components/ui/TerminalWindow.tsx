
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TerminalWindow = () => {
  const [text, setText] = useState<string[]>([]);
  const lines = [
    '$ initializing universal.ai',
    '$ loading creator toolkit...',
    '$ initializing neural fabric',
    '$ connecting to decentralized nodes',
    '[SYSTEM] Creator mode activated',
    'Ready to create magic_'
  ];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < lines.length) {
        setText(prev => [...prev, lines[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="relative w-full max-w-2xl bg-[#1a1b26]/90 rounded-lg overflow-hidden backdrop-blur-sm border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Window Controls */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1b26]/80 border-b border-white/10">
        <div className="h-3 w-3 rounded-full bg-red-500/70"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500/70"></div>
        <div className="h-3 w-3 rounded-full bg-green-500/70"></div>
        <span className="ml-2 text-sm text-gray-400">AI Studio</span>
      </div>
      
      {/* Terminal Content */}
      <div className="p-4 font-mono text-sm">
        {text.map((line, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-2 ${line.startsWith('[SYSTEM]') ? 'text-cyan-400' : 'text-green-400'}`}
          >
            {line}
          </motion.div>
        ))}
        <motion.div 
          className="inline-block w-3 h-5 bg-green-400"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

export default TerminalWindow;
