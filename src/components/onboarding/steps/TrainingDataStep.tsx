import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, UploadCloud, File, Video, Mic, CheckCircle, Sparkles, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Liquid Glass Background
const LiquidGlassBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-orb" />
      <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-orb animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-orb animation-delay-4000" />
    </div>
  );
};

// Holographic File Card
const HolographicFileCard = ({ file, status, index }) => {
  const getFileIcon = (type) => {
    const iconClass = "h-5 w-5 mr-3";
    if (type === 'image') return <File className={`${iconClass} text-cyan-400`}/>;
    if (type === 'video') return <Video className={`${iconClass} text-purple-400`}/>;
    if (type === 'voice') return <Mic className={`${iconClass} text-orange-400`}/>;
    return <File className={`${iconClass} text-slate-400`}/>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.8 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="relative group"
    >
      {/* Holographic shimmer effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />

      <div className="relative backdrop-blur-xl bg-white/10 p-4 rounded-xl border border-white/20 overflow-hidden">
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-hue-rotate opacity-50" />

          {!status.completed ? (
            <div className="relative w-24 h-2">
              <div className="absolute inset-0 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${status.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <motion.div
                className="absolute top-0 h-full w-4 bg-white/30 blur-md"
                animate={{ left: `${Math.max(0, status.progress - 2)}%` }}
              />
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="h-5 w-5 text-cyan-400"/>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const TrainingDataStep = ({ onNext, onBack }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState({});
  const dropzoneRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const gradientX = useTransform(mouseX, [0, 1], ['40%', '60%']);
  const gradientY = useTransform(mouseY, [0, 1], ['40%', '60%']);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const type = file.type.startsWith('image') ? 'image' :
                   file.type.startsWith('video') ? 'video' : 'voice';
          }));
        } else {
          clearInterval(interval);
          setFileStatuses(prev => ({
            ...prev,
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*':[], 'video/*':[], 'audio/*':[]}
  });


    </div>
  );
};

export default TrainingDataStep;