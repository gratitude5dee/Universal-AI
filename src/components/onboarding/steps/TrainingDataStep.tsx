import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, UploadCloud, File, Video, Mic, CheckCircle, Sparkles, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { GlassPanel } from '@/components/ui/glass-components';

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

        <div className="relative z-10 flex items-center">
          {getFileIcon(file.type)}
          <span className="text-sm text-white/90 flex-1 truncate mr-3">{file.name}</span>

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
      
      setFileStatuses(prev => ({...prev, [file.name]: { progress: 0, completed: false }}));
      setUploadedFiles(prev => {
        const existingFileIndex = prev.findIndex(f => f.name === file.name);
        if (existingFileIndex !== -1) {
          const updatedFiles = [...prev];
          updatedFiles[existingFileIndex] = { type, name: file.name };
          return updatedFiles;
        }
        return [...prev, { type, name: file.name }];
      });

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        if (currentProgress <= 100) {
          setFileStatuses(prev => ({
            ...prev,
            [file.name]: { ...(prev[file.name] || {}), progress: currentProgress }
          }));
        } else {
          clearInterval(interval);
          setFileStatuses(prev => ({
            ...prev,
            [file.name]: { ...(prev[file.name] || {}), progress: 100, completed: true }
          }));
        }
      }, 200);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*':[], 'video/*':[], 'audio/*':[]}
  });

  const handleMouseMove = (e) => {
    if (!dropzoneRef.current) return;
    const rect = dropzoneRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <div className="relative">
      <LiquidGlassBackground />
      
      <GlassPanel className="glass-panel-premium max-w-3xl mx-auto p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              Weaving the Persona
              <Zap className="h-6 w-6 text-yellow-400" />
            </h2>
            <p className="text-white/70">Infuse your AI with your unique voice, likeness, and style</p>
          </motion.div>
        </div>

        {/* Dropzone with liquid effect */}
        <motion.div
          ref={dropzoneRef}
          {...getRootProps()}
          onMouseMove={handleMouseMove}
          className={`relative p-12 rounded-2xl cursor-pointer transition-all duration-500 overflow-hidden ${
            isDragActive ? 'scale-105' : 'scale-100'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input {...getInputProps()} />

          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: useTransform(
                [gradientX, gradientY],
                ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(120, 119, 198, 0.3), rgba(255, 119, 198, 0.1), transparent 50%)`
              ),
              filter: "blur(40px)",
            }}
          />

          <div className="absolute inset-0 rounded-2xl p-[2px]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-hue-rotate" />
          </div>

          <div className="relative z-10 backdrop-blur-xl bg-black/20 rounded-2xl h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20">
            <motion.div
              animate={{
                y: isDragActive ? -10 : 0,
                scale: isDragActive ? 1.1 : 1,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <UploadCloud className={`h-16 w-16 mx-auto mb-4 ${isDragActive ? 'text-cyan-400' : 'text-white/50'}`}/>
            </motion.div>

            <p className="font-semibold text-white text-lg mb-1">
              {isDragActive ? "Drop your files here" : "Drag & drop files here, or click to select"}
            </p>
            <p className="text-xs text-white/50">Upload images, videos, and voice samples for training</p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex items-center gap-2 text-xs"
            >
              <Sparkles className="h-3 w-3 text-purple-400" />
              <span className="text-white/40 font-medium">Powered by Vapi & Tavus</span>
            </motion.div>
          </div>
        </motion.div>

        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white/80 font-medium">Uploaded Files</h3>
              <span className="text-xs text-white/50">{uploadedFiles.length} files</span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <AnimatePresence>
                {uploadedFiles.map((file, index) => {
                  const status = fileStatuses[file.name] || { progress: 0, completed: false };
                  return (
                    <HolographicFileCard
                      key={file.name + '-' + index}
                      file={file}
                      status={status}
                      index={index}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

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
            className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 shadow-lg shadow-purple-500/25"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
};

export default TrainingDataStep;