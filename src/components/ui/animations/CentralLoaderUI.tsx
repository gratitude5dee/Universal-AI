import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, HardDrive, MemoryStick, CheckCircle } from 'lucide-react'; // Or other relevant icons

interface CentralLoaderUIProps {
  progress: number; // 0 to 100
  statusText: string;
  cpuUsage: number; // 0 to 100
  gpuUsage: number; // 0 to 100 (using HardDrive as placeholder for GPU icon)
  memUsage: number; // 0 to 100
  showCheckmark?: boolean;
}

const StatBar: React.FC<{ label: string; value: number; icon: React.ElementType }> = ({
  label,
  value,
  icon: Icon,
}) => (
  <div className="flex flex-col items-center w-16">
    <Icon className="w-5 h-5 mb-1 text-green-400" />
    <div className="text-xs text-green-400 mb-1">{label}</div>
    <div className="w-2 h-16 bg-green-900/50 rounded overflow-hidden relative">
      <motion.div
        className="w-full bg-green-400 absolute bottom-0 left-0"
        initial={{ height: '0%' }}
        animate={{ height: `${value}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
    <div className="text-xs text-green-300 mt-1">{value.toFixed(0)}%</div>
  </div>
);

const CentralLoaderUI: React.FC<CentralLoaderUIProps> = ({
  progress,
  statusText,
  cpuUsage,
  gpuUsage,
  memUsage,
  showCheckmark = false,
}) => {
  const hexagonPoints = "100,0 200,50 200,150 100,200 0,150 0,50"; // Example points for a hexagon

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10">
      {/* Hexagon Loader */}
      <motion.div
        className="relative w-48 h-48 sm:w-56 sm:h-56 mb-6" // Increased size
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Outer Hexagon with glow */}
          <motion.polygon
            points={hexagonPoints}
            stroke="#0f0" // Glowing green border
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
            style={{
              filter: 'drop-shadow(0 0 8px #0f0)', // Glow effect using SVG filter is also an option
            }}
          />

          {/* Inner Segments (example of 6 segments) */}
          {/* This is a simplified representation. More complex segment animations can be added. */}
          {[...Array(6)].map((_, i) => (
            <motion.line
              key={i}
              x1="100"
              y1="100" // Center point
              x2={100 + 80 * Math.cos((Math.PI / 3) * i + Math.PI / 6)} // Points on hexagon vertices
              y2={100 + 80 * Math.sin((Math.PI / 3) * i + Math.PI / 6)}
              stroke="#0f0"
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: progress / 100 > (i / 6) ? 0.7 : 0, scale: 1 }} // Segments appear as progress increases
              transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
            />
          ))}

          {/* Central Icon / Logo Placeholder */}
          {!showCheckmark ? (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              {/* Placeholder for UNIVERSAL.AI logo - using a simple hexagon for now */}
               <text
                x="50%"
                y="50%"
                dy=".3em" // vertical centering
                textAnchor="middle"
                fill="#0f0"
                fontSize="20"
                fontFamily="monospace"
                style={{ filter: 'drop-shadow(0 0 5px #0f0)'}}
              >
                U.AI
              </text>
            </motion.g>
          ) : (
            <motion.g
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="w-16 h-16 text-green-400" x="68" y="68" />
            </motion.g>
          )}
        </svg>
      </motion.div>

      {/* Status Text */}
      <motion.p
        className="text-lg sm:text-xl text-green-400 font-mono mb-3"
        style={{ textShadow: '0 0 5px #0f0, 0 0 10px #0f0' }} // Glow effect
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        key={statusText} // To re-animate if text changes
      >
        {statusText}
      </motion.p>

      {/* Progress Bar */}
      <div className="w-64 sm:w-80 h-2 bg-green-900/70 rounded-full overflow-hidden mb-10 border border-green-700/50">
        <motion.div
          className="h-full bg-green-400"
          style={{ textShadow: '0 0 8px #0f0' }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
      </div>

      {/* System Stats */}
      <motion.div
        className="flex space-x-6 sm:space-x-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <StatBar label="CPU" value={cpuUsage} icon={Cpu} />
        <StatBar label="GPU" value={gpuUsage} icon={HardDrive} /> {/* Using HardDrive as placeholder for GPU */}
        <StatBar label="MEM" value={memUsage} icon={MemoryStick} />
      </motion.div>
    </div>
  );
};

export default CentralLoaderUI;
