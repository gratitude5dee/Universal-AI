import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatrixBackground from './MatrixBackground';
import CentralLoaderUI from './CentralLoaderUI';

interface FuturisticLoaderProps {
  onComplete: () => void;
}

const statusMessagesList = [
  "INITIALIZING SYSTEM...",
  "CALIBRATING SENSORS...",
  "LOADING CORE MODULES...",
  "DECOMPRESSING ASSETS...",
  "COMPILING SHADERS...",
  "ESTABLISHING NEXUS...",
  "AWAKENING AI CORE...",
  "ALIGNING REALMS...",
  "SYNCHRONIZING DATASTREAMS...",
  "FINALIZING BOOT SEQUENCE..."
];

const FuturisticLoader: React.FC<FuturisticLoaderProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'booting' | 'loading' | 'finishing' | 'done'>('booting');
  const [progress, setProgress] = useState(0);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [statusText, setStatusText] = useState(statusMessagesList[0]);
  const [showCentralUI, setShowCentralUI] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

  // System stats simulation
  const [cpu, setCpu] = useState(0);
  const [gpu, setGpu] = useState(0);
  const [mem, setMem] = useState(0);

  const getRandomUsage = () => 70 + Math.random() * 28; // Fluctuate between 70% and 98%

  // Stage 1: Boot-up
  useEffect(() => {
    if (stage === 'booting') {
      setShowMatrix(true); // Matrix rain starts
      setStatusText(statusMessagesList[0]); // Initial status
      const timer1 = setTimeout(() => {
        setShowCentralUI(true); // Central UI fades in
      }, 500); // Delay for Matrix to appear first
      const timer2 = setTimeout(() => setStage('loading'), 1000); // Start loading phase after initial fade-ins
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [stage]);

  // Stage 2: Loading
  useEffect(() => {
    if (stage === 'loading') {
      const duration = 4000; // 4 seconds for loading
      const progressUpdateInterval = 50; // Update progress every 50ms
      const statusChangeInterval = duration / statusMessagesList.length;
      let currentProgress = 0;
      let statusTimeoutId: NodeJS.Timeout;

      const progressIntervalId = setInterval(() => {
        currentProgress += (progressUpdateInterval / duration) * 100;
        if (currentProgress >= 100) {
          setProgress(100);
          clearInterval(progressIntervalId);
          clearTimeout(statusTimeoutId); // Clear pending status updates
          setStage('finishing');
        } else {
          setProgress(currentProgress);
        }
        // Update stats
        setCpu(getRandomUsage());
        setGpu(getRandomUsage());
        setMem(getRandomUsage());
      }, progressUpdateInterval);

      // Cycle through status messages
      const updateStatusMessage = (index: number) => {
        if (index < statusMessagesList.length) {
          setStatusText(statusMessagesList[index]);
          setCurrentStatusIndex(index);
          statusTimeoutId = setTimeout(() => updateStatusMessage(index + 1), statusChangeInterval);
        }
      };

      // Start cycling status messages shortly after loading begins
      const initialStatusDelay = setTimeout(() => updateStatusMessage(currentStatusIndex), 100);


      return () => {
        clearInterval(progressIntervalId);
        clearTimeout(statusTimeoutId);
        clearTimeout(initialStatusDelay);
      };
    }
  }, [stage, currentStatusIndex]); // Added currentStatusIndex to dependencies

  // Stage 3: Finishing
  useEffect(() => {
    if (stage === 'finishing') {
      setStatusText("SYSTEM READY"); // Changed from "ALL SYSTEMS OPERATIONAL"
      const holdTimer = setTimeout(() => {
        // Trigger exit animations
        setShowCentralUI(false); // Central UI starts fading out
      }, 500); // Hold for 500ms

      const fadeOutTimer = setTimeout(() => {
        setShowMatrix(false); // Matrix rain fades out
      }, 1000); // Matrix fades after Central UI starts fading

      const completeTimer = setTimeout(() => {
        setStage('done');
      }, 1500); // Ensure all fades complete before calling onComplete

      return () => {
        clearTimeout(holdTimer);
        clearTimeout(fadeOutTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [stage]);

  // Stage 4: Done - call onComplete
  useEffect(() => {
    if (stage === 'done') {
      onComplete();
    }
  }, [stage, onComplete]);


  const centralUIVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5, ease: "easeIn" } }
  };

  const matrixVariants = {
    hidden: { opacity: 0, transition: { duration: 0.7, ease: "easeOut" } },
    visible: { opacity: 1, transition: { duration: 0.7, ease: "easeIn" } },
    intensifyExit: { // Example of intensify then fade, can be more complex
        opacity: [1, 0.7, 1, 0],
        scale: [1, 1.05, 1, 0.95], // Optional: scale effect for intensity
        transition: { duration: 1, times: [0, 0.2, 0.4, 1], ease:"easeInOut" }
    }
  };


  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <AnimatePresence>
        {showMatrix && (
          <motion.div
            key="matrix-bg"
            initial="hidden"
            animate="visible"
            exit={stage === 'finishing' ? "intensifyExit" : "hidden"} // Use intensify on finish
            variants={matrixVariants}
            className="absolute inset-0"
          >
            <MatrixBackground />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCentralUI && (
          <motion.div
            key="central-ui"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={centralUIVariants}
            className="relative" // Ensure it's on top of the matrix if needed, or manage z-index
          >
            <CentralLoaderUI
              progress={progress}
              statusText={statusText}
              cpuUsage={cpu}
              gpuUsage={gpu}
              memUsage={mem}
              showCheckmark={stage === 'finishing' && progress === 100}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FuturisticLoader;
