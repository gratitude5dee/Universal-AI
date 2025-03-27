
import React, { ReactNode, useState, useEffect, useCallback, useRef } from "react";
import Header from "../header";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import MatrixAnimation from "../animations/matrix-animation";

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
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
      }}
      layout
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Animated cloud background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background gradient already applied in the parent div */}
        
        {/* Animated cloud elements with improved opacity for better contrast */}
        <motion.div 
          className="absolute top-0 left-[-10%] w-[50%] h-[50%] opacity-10 bg-blue-lighter blur-3xl rounded-full"
          animate={{
            x: ["0%", "5%", "0%"],
            y: ["0%", "3%", "0%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <motion.div 
          className="absolute bottom-0 right-[-5%] w-[40%] h-[40%] opacity-8 bg-blue-light blur-3xl rounded-full"
          animate={{
            x: ["0%", "-8%", "0%"],
            y: ["0%", "-5%", "0%"],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <motion.div 
          className="absolute top-[30%] right-[10%] w-[30%] h-[30%] opacity-10 bg-blue-primary blur-3xl rounded-full"
          animate={{
            x: ["0%", "-10%", "0%"],
            y: ["0%", "8%", "0%"],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
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
