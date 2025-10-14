import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, User } from "lucide-react";
import { motion } from "framer-motion";

interface AvatarUploadProps {
  avatar: string | null;
  setAvatar: (avatar: string | null) => void;
}

const defaultAvatars = [
  "🤖", "🎨", "💼", "🔧", "📱", "🎵", "📊", "✨"
];

const AvatarUpload: React.FC<AvatarUploadProps> = ({ avatar, setAvatar }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(avatar);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  }, [setAvatar]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    maxFiles: 1,
    maxSize: 5242880 // 5MB
  });

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-[hsl(var(--text-primary))]">
        Agent Avatar
      </label>

      <div className="flex items-center gap-6">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`flex-1 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${
            isDragActive
              ? 'border-[hsl(var(--accent-purple))] bg-[hsl(var(--accent-purple))]/10'
              : 'border-white/20 hover:border-white/40 bg-white/5'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-center">
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Avatar preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-[hsl(var(--accent-purple))]"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewUrl(null);
                    setAvatar(null);
                  }}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-[hsl(var(--text-secondary))] mb-2" />
                <p className="text-sm text-[hsl(var(--text-primary))] mb-1">
                  Drop an image here, or click to select
                </p>
                <p className="text-xs text-[hsl(var(--text-tertiary))]">
                  PNG, JPG, GIF up to 5MB
                </p>
              </>
            )}
          </div>
        </div>

        {/* OR Divider */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-20 w-px bg-white/20" />
          <span className="text-xs text-[hsl(var(--text-tertiary))]">or</span>
          <div className="h-20 w-px bg-white/20" />
        </div>

        {/* Default Avatars */}
        <div className="flex-1">
          <p className="text-xs text-[hsl(var(--text-secondary))] mb-3">Choose a default:</p>
          <div className="grid grid-cols-4 gap-2">
            {defaultAvatars.map((emoji) => (
              <motion.button
                key={emoji}
                onClick={() => {
                  setAvatar(emoji);
                  setPreviewUrl(emoji);
                }}
                className={`aspect-square flex items-center justify-center text-3xl rounded-lg border-2 transition-all ${
                  previewUrl === emoji
                    ? 'border-[hsl(var(--accent-purple))] bg-[hsl(var(--accent-purple))]/10'
                    : 'border-white/10 hover:border-white/30 bg-white/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
