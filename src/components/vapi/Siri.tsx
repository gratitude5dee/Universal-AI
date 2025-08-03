"use client";
 
import React, { useState, useEffect } from 'react';
import { Mic, PhoneCall } from 'lucide-react';
import ReactSiriwave, { IReactSiriwaveProps } from 'react-siriwave';
import { motion, AnimatePresence } from 'framer-motion';
import useVapi from '@/hooks/use-vapi';
 
type CurveStyle = "ios" | "ios9";
 
interface SiriProps {
  theme: CurveStyle;
}
 
const Siri: React.FC<SiriProps> = ({ theme }) => {
  const { volumeLevel, isSessionActive, toggleCall, conversation } = useVapi();
  const [siriWaveConfig, setSiriWaveConfig] = useState<IReactSiriwaveProps>({
    theme: theme || "ios9",
    ratio: 1,
    speed: 0.2,
    amplitude: 1,
    frequency: 6,
    color: '#fff',
    cover: false,
    width: 300,
    height: 100,
    autostart: true,
    pixelDepth: 1,
    lerpSpeed: 0.1,
  });
 
  useEffect(() => {
    setSiriWaveConfig(prevConfig => ({
      ...prevConfig,
      amplitude: isSessionActive ? (volumeLevel > 0.01 ? volumeLevel * 7.5 : 0) : 0,
      speed: isSessionActive ? (volumeLevel > 0.05 ? 0.1 : 0.05) : 0,
      frequency: isSessionActive ? (volumeLevel > 0.01 ? 2 + volumeLevel * 4 : 2) : 0,
    }));
  }, [volumeLevel, isSessionActive]);
 
  const handleToggleCall = () => {
    toggleCall();
  };
 
  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="flex items-center justify-center">
        <motion.button
          key="callButton"
          onClick={handleToggleCall}
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          animate={{ x: isSessionActive ? -20 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ zIndex: 10, position: 'relative' }}
        >
          <AnimatePresence mode="wait">
            {!isSessionActive ? (
              <motion.div
                key="micIcon"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Mic size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="phoneIcon"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <PhoneCall size={20} className="text-red-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        <motion.div
          className="overflow-hidden"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: isSessionActive ? 300 : 0, opacity: isSessionActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginLeft: '10px' }}
        >
          <ReactSiriwave {...siriWaveConfig} />
        </motion.div>
      </div>
      <div className="mt-4 h-16 text-center text-white/80 text-sm">
        <AnimatePresence>
          {conversation.length > 0 && (
            <motion.p
              key={conversation[conversation.length - 1].text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <strong>{conversation[conversation.length - 1].role}:</strong> {conversation[conversation.length - 1].text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
 
export default Siri;