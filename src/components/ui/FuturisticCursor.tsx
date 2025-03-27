
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./FuturisticCursor.css";

interface FuturisticCursorProps {
  isLoading?: boolean;
}

const FuturisticCursor: React.FC<FuturisticCursorProps> = ({ 
  isLoading = false 
}) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const lastKnownPos = useRef({ x: 0, y: 0 });
  const particles = useRef<HTMLDivElement[]>([]);
  const [particleCount, setParticleCount] = useState(0);

  // Track mouse movement with improved performance
  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      lastKnownPos.current = { x: e.clientX, y: e.clientY };
      
      // Use requestAnimationFrame for smoother performance
      requestAnimationFrame(() => {
        setPosition({ x: lastKnownPos.current.x, y: lastKnownPos.current.y });
      });

      // Check if hovering over an interactive element with improved detection
      const targetElement = document.elementFromPoint(e.clientX, e.clientY);
      const isInteractive = 
        targetElement?.closest('.cursor-interactive') !== null || 
        targetElement?.closest('button') !== null || 
        targetElement?.closest('a') !== null || 
        targetElement?.closest('input') !== null ||
        targetElement?.closest('select') !== null ||
        targetElement?.closest('textarea') !== null ||
        targetElement?.tagName === 'BUTTON' ||
        targetElement?.tagName === 'A' ||
        targetElement?.tagName === 'INPUT' ||
        targetElement?.tagName === 'SELECT' ||
        targetElement?.tagName === 'TEXTAREA' ||
        targetElement?.getAttribute('role') === 'button';

      setIsHovering(isInteractive);
      
      // Emit particles on movement when hovering
      if (isInteractive && !isLoading && Math.random() > 0.92) {
        createParticle(e.clientX, e.clientY);
      }
    };

    // Handle mouse clicks with better state management
    const handleMouseDown = () => {
      setIsActive(true);
    };

    const handleMouseUp = () => {
      setIsActive(false);
    };

    // Add event listeners with passive option for better performance
    window.addEventListener('mousemove', updateCursorPosition, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    
    // Hide the default cursor on the body
    document.body.classList.add('futuristic-cursor-active');

    // Clean up event listeners when component unmounts
    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      // Restore the default cursor
      document.body.classList.remove('futuristic-cursor-active');
    };
  }, [isLoading]);

  // Create particles for enhanced visual feedback
  const createParticle = (x: number, y: number) => {
    setParticleCount(prev => prev + 1);
    setTimeout(() => {
      setParticleCount(prev => prev - 1);
    }, 600); // Duration for particle to exist
  };

  // Determine cursor class based on state
  const getCursorClassName = () => {
    if (isLoading) return "futuristic-cursor loading";
    if (isActive && isHovering) return "futuristic-cursor active hovering";
    if (isHovering) return "futuristic-cursor hovering";
    return "futuristic-cursor";
  };

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className={getCursorClassName()}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Inner ring */}
        <div className="cursor-ring"></div>
        
        {/* Optional particles for hover state */}
        <AnimatePresence>
          {isHovering && !isActive && !isLoading && (
            <>
              <motion.div 
                className="cursor-particle"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
                style={{ left: '-5px', top: '-5px' }}
              />
              <motion.div 
                className="cursor-particle"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
                style={{ right: '-3px', bottom: '-8px' }}
              />
            </>
          )}
        </AnimatePresence>
        
        {/* Loading animation dots */}
        {isLoading && (
          <div className="cursor-loading">
            <div className="loading-dot" style={{ '--index': 0 } as React.CSSProperties}></div>
            <div className="loading-dot" style={{ '--index': 1 } as React.CSSProperties}></div>
            <div className="loading-dot" style={{ '--index': 2 } as React.CSSProperties}></div>
            <div className="loading-dot" style={{ '--index': 3 } as React.CSSProperties}></div>
          </div>
        )}
      </motion.div>
      
      {/* Larger trailing cursor with improved animation */}
      <motion.div
        ref={trailRef}
        className="futuristic-cursor-trail"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.2 : 0.1,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      
      {/* Particle system for enhanced feedback */}
      <AnimatePresence>
        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={`particle-${i}-${Date.now()}`}
            className="cursor-float-particle"
            initial={{ 
              x: position.x, 
              y: position.y,
              opacity: 0.8,
              scale: 0.8
            }}
            animate={{ 
              x: position.x + (Math.random() * 40 - 20),
              y: position.y + (Math.random() * 40 - 20) - 10,
              opacity: 0,
              scale: 0.2
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </>
  );
};

export default FuturisticCursor;
