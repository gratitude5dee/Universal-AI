
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
  const lastKnownPos = useRef({ x: 0, y: 0 });

  // Track mouse movement
  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      lastKnownPos.current = { x: e.clientX, y: e.clientY };
      
      // Use requestAnimationFrame for smoother performance
      requestAnimationFrame(() => {
        setPosition({ x: lastKnownPos.current.x, y: lastKnownPos.current.y });
      });

      // Check if hovering over an interactive element
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
        targetElement?.tagName === 'TEXTAREA';

      setIsHovering(isInteractive);
    };

    // Handle mouse clicks
    const handleMouseDown = () => {
      setIsActive(true);
    };

    const handleMouseUp = () => {
      setIsActive(false);
    };

    // Add event listeners
    window.addEventListener('mousemove', updateCursorPosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
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
  }, []);

  // Determine cursor class based on state
  const getCursorClassName = () => {
    if (isLoading) return "futuristic-cursor loading";
    if (isActive && isHovering) return "futuristic-cursor active";
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
          translateX: position.x,
          translateY: position.y,
          x: "-50%",
          y: "-50%",
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
      
      {/* Larger trailing cursor (optional) */}
      <motion.div
        className="futuristic-cursor-trail"
        style={{
          translateX: position.x,
          translateY: position.y,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.2 : 0.1,
        }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
};

export default FuturisticCursor;
