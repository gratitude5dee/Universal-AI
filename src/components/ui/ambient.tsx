
import React, { useState, useEffect } from "react";
import CloudShader from "./shaders/CloudShader";
import { motion } from "framer-motion";

const Ambient = ({ showAsciiStreams = false }: { showAsciiStreams?: boolean }) => {
  // ASCII data stream animation
  const AsciiStream = ({
    top,
    left,
    delay,
    duration
  }: {
    top: string;
    left: string;
    delay: number;
    duration: number;
  }) => {
    const characters = "10101010101010101010";
    const [streamChars, setStreamChars] = useState(characters);
    
    useEffect(() => {
      const interval = setInterval(() => {
        setStreamChars(prev => {
          const shifted = prev.substring(1) + prev.charAt(0);
          return shifted;
        });
      }, 150);
      return () => clearInterval(interval);
    }, []);
    
    return (
      <motion.div 
        className="fixed text-green-500/20 text-xs font-mono pointer-events-none" 
        style={{top, left}} 
        initial={{opacity: 0, y: -50}} 
        animate={{opacity: [0, 0.4, 0], y: [0, 100]}} 
        transition={{repeat: Infinity, duration, delay, ease: "linear"}}
      >
        {streamChars.split('').map((char, i) => (
          <motion.div 
            key={i} 
            animate={{opacity: [0.2, 1, 0.2]}} 
            transition={{duration: 2, repeat: Infinity, delay: i * 0.1}}
          >
            {char}
          </motion.div>
        ))}
      </motion.div>
    );
  };
  
  return (
    <div className="fixed inset-0 min-h-screen w-full overflow-hidden -z-10 pointer-events-none">
      {/* Cloud GLSL Shader Background */}
      <CloudShader />
      
      {/* Overlay to add slight darkening and better text contrast */}
      <div className="absolute inset-0 bg-blue-darker/20 z-1"></div>
      
      {/* ASCII data streams - optional based on prop */}
      {showAsciiStreams && (
        <>
          <AsciiStream top="10%" left="15%" delay={2} duration={8} />
          <AsciiStream top="20%" left="85%" delay={3.5} duration={10} />
          <AsciiStream top="50%" left="8%" delay={1} duration={12} />
          <AsciiStream top="70%" left="92%" delay={4} duration={9} />
          <AsciiStream top="35%" left="60%" delay={2.5} duration={11} />
        </>
      )}

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none z-2" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px'
        }} 
      />

      {/* Add subtle particles floating in the background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/10"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Ambient;
