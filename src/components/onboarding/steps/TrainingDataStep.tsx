import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, UploadCloud, File, Video, Mic, CheckCircle } from 'lucide-react';
import { useOnboarding } from '@/context/OnboardingContext';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface TrainingDataStepProps {
  onNext: () => void;
  onBack: () => void;
}

const TrainingDataStep: React.FC<TrainingDataStepProps> = ({ onNext, onBack }) => {
  const { uploadedFiles, addUploadedFile } = useOnboarding();
  // Store progress and completion status separately
  const [fileStatuses, setFileStatuses] = useState<{[key: string]: { progress: number, completed: boolean }}>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const type = file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'voice';
      
      // Initialize status for the new file
      setFileStatuses(prev => ({...prev, [file.name]: { progress: 0, completed: false }}));
      addUploadedFile({ type, name: file.name }); // Add to context immediately

      // Simulate upload progress
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10; // Simulate 10% progress every 100ms
        if (currentProgress <= 100) {
          setFileStatuses(prev => ({
            ...prev,
            [file.name]: { ...prev[file.name], progress: currentProgress }
          }));
        } else {
          clearInterval(interval);
          setFileStatuses(prev => ({
            ...prev,
            [file.name]: { ...prev[file.name], progress: 100, completed: true }
          }));
        }
      }, 100); // Adjust timing for desired simulation speed (e.g., 1 sec total)
    });
  }, [addUploadedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*':[], 'video/*':[], 'audio/*':[]}
  });

  const getFileIcon = (type: 'image' | 'video' | 'voice') => {
    if (type === 'image') return <File className="h-5 w-5 mr-3 text-sky-400"/>;
    if (type === 'video') return <Video className="h-5 w-5 mr-3 text-purple-400"/>;
    if (type === 'voice') return <Mic className="h-5 w-5 mr-3 text-orange-400"/>;
    return <File className="h-5 w-5 mr-3 text-slate-400"/>;
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700 rounded-lg max-w-3xl mx-auto p-8 shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Weaving the Persona</h2>
        <p className="text-slate-400">Infuse your AI with your unique voice, likeness, and style.</p>
      </div>
      
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200 ${
          isDragActive ? 'border-cyan-500 bg-cyan-500/10 scale-105' : 'border-slate-600 hover:border-cyan-400'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className={`h-12 w-12 mx-auto mb-4 ${isDragActive ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`}/>
        <p className="font-semibold text-slate-200">Drag & drop files here, or click to select</p>
        <p className="text-xs text-slate-500 mt-1">Upload images, videos, and voice samples for training.</p>
        <p className="text-xs text-slate-600 mt-3 font-semibold">Powered by Vapi & Tavus</p>
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {uploadedFiles.map((file, index) => {
            const status = fileStatuses[file.name] || { progress: 0, completed: false };
            return (
              <motion.div
                key={index}
                className="flex items-center bg-slate-700/50 p-3 rounded-lg border border-slate-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {getFileIcon(file.type as 'image' | 'video' | 'voice')}
                <span className="text-sm text-slate-300 flex-1 truncate mr-3">{file.name}</span>
                {!status.completed ? (
                  <Progress value={status.progress} className="w-24 h-2 bg-slate-600 [&>div]:bg-cyan-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-cyan-400"/>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={onNext} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TrainingDataStep;