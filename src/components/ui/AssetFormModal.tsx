import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Image, Video, Music } from 'lucide-react';
import { Asset } from './VinylRecord';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Partial<Asset>) => void;
  asset?: Asset | null;
  mode: 'create' | 'edit';
}

const AssetFormModal: React.FC<AssetFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  asset,
  mode
}) => {
  const [formData, setFormData] = useState({
    title: asset?.title || '',
    type: asset?.type || 'image' as 'image' | 'video' | 'audio',
    collection: asset?.collection || '',
    description: asset?.description || '',
    chain: asset?.chain || 'Ethereum',
    preview: asset?.preview || ''
  });

  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ 
          ...prev, 
          preview: event.target?.result as string,
          type: file.type.startsWith('video/') ? 'video' : 
                file.type.startsWith('audio/') ? 'audio' : 'image'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAsset: Partial<Asset> = {
      ...formData,
      id: asset?.id || `asset-${Date.now()}`,
      views: asset?.views || 0,
      likes: asset?.likes || 0,
      awards: asset?.awards || 0,
      featured: asset?.featured || false,
      journey: asset?.journey || [
        { date: new Date().toISOString().split('T')[0], event: 'Created', chain: formData.chain }
      ]
    };
    
    onSave(newAsset);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-studio-sand/30">
          <h2 className="text-2xl font-bold text-studio-charcoal">
            {mode === 'create' ? 'Create New Asset' : 'Edit Asset'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-studio-sand/20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-studio-charcoal" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-studio-accent bg-studio-accent/5' 
                  : formData.preview 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-studio-sand hover:border-studio-accent/50 hover:bg-studio-sand/10'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              {formData.preview ? (
                <div className="space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden">
                    {formData.type === 'video' ? (
                      <video src={formData.preview} className="w-full h-full object-cover" />
                    ) : (
                      <img src={formData.preview} alt="Preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <p className="text-green-600 font-medium">File uploaded successfully!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-studio-accent/10 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-studio-accent" />
                  </div>
                  <div>
                    <p className="text-studio-charcoal font-medium">Drop your file here or click to browse</p>
                    <p className="text-studio-muted text-sm mt-1">Supports images, videos, and audio files</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*,video/*,audio/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        preview: event.target?.result as string,
                        type: file.type.startsWith('video/') ? 'video' : 
                              file.type.startsWith('audio/') ? 'audio' : 'image'
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>

            {/* Asset Type */}
            <div>
              <label className="block text-sm font-medium text-studio-charcoal mb-3">Asset Type</label>
              <div className="flex gap-3">
                {[
                  { type: 'image', icon: Image, label: 'Image' },
                  { type: 'video', icon: Video, label: 'Video' },
                  { type: 'audio', icon: Music, label: 'Audio' }
                ].map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange('type', type)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                      formData.type === type
                        ? 'border-studio-accent bg-studio-accent/10 text-studio-accent'
                        : 'border-studio-sand/50 hover:border-studio-accent/30 text-studio-charcoal'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-studio-charcoal mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-studio-sand/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-studio-accent/20 focus:border-studio-accent transition-colors"
                placeholder="Enter asset title..."
                required
              />
            </div>

            {/* Collection & Chain */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-studio-charcoal mb-2">Collection</label>
                <input
                  type="text"
                  value={formData.collection}
                  onChange={(e) => handleInputChange('collection', e.target.value)}
                  className="w-full px-4 py-3 border border-studio-sand/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-studio-accent/20 focus:border-studio-accent transition-colors"
                  placeholder="Collection name..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-studio-charcoal mb-2">Blockchain</label>
                <select
                  value={formData.chain}
                  onChange={(e) => handleInputChange('chain', e.target.value)}
                  className="w-full px-4 py-3 border border-studio-sand/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-studio-accent/20 focus:border-studio-accent transition-colors"
                >
                  <option value="Ethereum">Ethereum</option>
                  <option value="Polygon">Polygon</option>
                  <option value="Solana">Solana</option>
                  <option value="Arbitrum">Arbitrum</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-studio-charcoal mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-studio-sand/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-studio-accent/20 focus:border-studio-accent transition-colors resize-none"
                placeholder="Describe your asset..."
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 border-t border-studio-sand/30 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-studio-sand/50 text-studio-charcoal rounded-xl hover:bg-studio-sand/20 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-studio-accent text-white rounded-xl hover:bg-studio-accent/90 transition-colors font-medium shadow-sm"
            >
              {mode === 'create' ? 'Create Asset' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AssetFormModal;