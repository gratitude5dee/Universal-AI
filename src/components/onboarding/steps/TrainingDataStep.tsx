import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, UploadCloud, File, Video, Mic, CheckCircle, Sparkles, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useOnboardingNavigation } from '@/hooks/useOnboardingNavigation';

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
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center">
            {getFileIcon(file.type)}
            <span className="text-white font-medium">{file.name}</span>
          </div>
          
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
  const { handleAreaClick } = useOnboardingNavigation({ 
    onNext, 
    onBack, 
    disabled: uploadedFiles.length === 0 
  });

  const gradientX = useTransform(mouseX, [0, 1], ['40%', '60%']);
  const gradientY = useTransform(mouseY, [0, 1], ['40%', '60%']);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const type = file.type.startsWith('image') ? 'image' :
                   file.type.startsWith('video') ? 'video' : 'voice';
      
      setUploadedFiles(prev => [...prev, { name: file.name, type, size: file.size }]);
      setFileStatuses(prev => ({ ...prev, [file.name]: { progress: 0, completed: false } }));
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setFileStatuses(prev => {
          const current = prev[file.name];
          if (current && current.progress < 100) {
            return { ...prev, [file.name]: { ...current, progress: current.progress + 10 } };
          } else {
            clearInterval(interval);
            return { ...prev, [file.name]: { progress: 100, completed: true } };
          }
        });
      }, 200);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*':[], 'video/*':[], 'audio/*':[]}
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <LiquidGlassBackground />
      
      <div 
        className="w-full max-w-4xl backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-8 cursor-pointer"
        onClick={handleAreaClick}
        role="button"
        tabIndex={0}
        aria-label="Click anywhere or press Enter/Space to continue (upload files first)"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Training Data Upload</h2>
          <p className="text-white/70">Upload files to train your AI agent</p>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 dropzone
            ${isDragActive ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/30 hover:border-white/50'}
          `}
          data-interactive="true"
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-12 w-12 text-white/50 mx-auto mb-4" />
          <p className="text-white text-lg mb-2">
            {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}
          </p>
          <p className="text-white/50">Supports images, videos, and audio files</p>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Uploaded Files</h3>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <HolographicFileCard
                  key={file.name}
                  file={file}
                  status={fileStatuses[file.name] || { progress: 0, completed: false }}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={onNext}
            disabled={uploadedFiles.length === 0}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrainingDataStep;