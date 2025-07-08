import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, UploadCloud, File, Video, Mic, CheckCircle } from 'lucide-react';
import { useOnboarding } from '@/context/OnboardingContext';
import { Progress } from '@/components/ui/progress';

interface TrainingDataStepProps {
  onNext: () => void;
  onBack: () => void;
}

const TrainingDataStep: React.FC<TrainingDataStepProps> = ({ onNext, onBack }) => {
  const { uploadedFiles, addUploadedFile } = useOnboarding();
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const type = file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'voice';
      
      setUploadProgress(prev => ({...prev, [file.name]: 0}));

      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(prev => ({...prev, [file.name]: progress}));
        }
      };
      reader.onloadend = () => {
        setUploadProgress(prev => ({...prev, [file.name]: 100}));
        addUploadedFile({ type, name: file.name });
      };
      reader.readAsArrayBuffer(file);
    });
  }, [addUploadedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*':[], 'video/*':[], 'audio/*':[]} });

  return (
    <div className="bg-background/20 backdrop-blur-sm border border-border rounded-lg max-w-3xl mx-auto p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Weaving the Persona</h2>
        <p className="text-muted-foreground">Infuse your AI with your unique voice, likeness, and style.</p>
      </div>
      
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
        <p className="font-semibold">Drag & drop files here, or click to select</p>
        <p className="text-xs text-muted-foreground mt-1">Upload images, videos, and voice samples for training.</p>
        <p className="text-xs text-muted-foreground mt-2">Powered by Vapi & Tavus</p>
      </div>
      
      <div className="mt-6 space-y-3 max-h-48 overflow-y-auto pr-2">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="flex items-center bg-muted/10 p-3 rounded-lg">
            {file.type === 'image' && <File className="h-5 w-5 mr-3 text-cyan-400"/>}
            {file.type === 'video' && <Video className="h-5 w-5 mr-3 text-purple-400"/>}
            {file.type === 'voice' && <Mic className="h-5 w-5 mr-3 text-orange-400"/>}
            <span className="text-sm flex-1 truncate">{file.name}</span>
            {uploadProgress[file.name] < 100 ? (
               <Progress value={uploadProgress[file.name]} className="w-24 h-1.5" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500"/>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-border">
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