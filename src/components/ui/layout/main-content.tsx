
import React, { ReactNode, useState, useEffect, useCallback, useRef } from "react";
import Header from "../header";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import MatrixAnimation from "../animations/matrix-animation";
import EtherealCloudShader from "../shaders/EtherealCloudShader";

interface MainContentProps {
  children: ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const location = useLocation();
  const [isPageTransition, setIsPageTransition] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(true);
  const previousPathRef = useRef(location.pathname);
  
  // Trigger transition when route changes, but only if it's a different route
  useEffect(() => {
    // Only trigger transition if the path actually changed
    if (previousPathRef.current !== location.pathname && isAnimationComplete) {
      previousPathRef.current = location.pathname;
      setIsAnimationComplete(false);
      setIsPageTransition(true);
      console.log("Starting page transition animation");
    }
  }, [location.pathname, isAnimationComplete]);

  // Handle animation completed
  const handleAnimationComplete = useCallback(() => {
    console.log("Animation complete, setting isPageTransition to false");
    
    // Immediately set isPageTransition to false
    setIsPageTransition(false);
    
    // Allow a small delay before allowing new transitions
    setTimeout(() => {
      setIsAnimationComplete(true);
      console.log("Animation reset, ready for next transition");
    }, 800); // Increased buffer time to prevent rapid transitions
  }, []);

  // Handle animation exit completed
  const handleExitComplete = useCallback(() => {
    console.log("Exit animation completed");
    // Ensure we've reset the transition state
    setIsPageTransition(false);
  }, []);

  return (
    <motion.div 
      className="flex-1 min-h-screen flex flex-col w-full overflow-hidden relative"
      layout
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Ethereal Cloud Shader Background */}
      <EtherealCloudShader />
      
      <Header />
      
      {/* Matrix ASCII Animation Transition */}
      <AnimatePresence 
        mode="wait" 
        onExitComplete={handleExitComplete}
        initial={false}
      >
        {isPageTransition && (
          <MatrixAnimation onComplete={handleAnimationComplete} />
        )}
      </AnimatePresence>
      
      <motion.main 
        className="px-4 pb-8 mt-2 flex-1 overflow-hidden z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </motion.div>
  );
};

export default MainContent;
