
import React from "react";
import { motion } from "framer-motion";

interface ContentProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const Content = ({ title, subtitle, children, className = "" }: ContentProps) => {
  return (
    <motion.div 
      className={`w-full p-6 md:p-8 space-y-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {(title || subtitle) && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {title && (
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white via-studio-accent to-blue-400 bg-clip-text text-transparent">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg text-white/80 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
