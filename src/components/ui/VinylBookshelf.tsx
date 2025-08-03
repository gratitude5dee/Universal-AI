import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import VinylRecord, { Asset } from './VinylRecord';

interface VinylBookshelfProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  onAddAsset?: () => void;
  title?: string;
}

const VinylBookshelf: React.FC<VinylBookshelfProps> = ({ 
  assets, 
  onSelectAsset, 
  onAddAsset,
  title 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="vinyl-bookshelf-wrapper">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-studio-charcoal">{title}</h3>
          {onAddAsset && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddAsset}
              className="flex items-center gap-2 px-4 py-2 bg-studio-accent text-white rounded-xl text-sm font-medium hover:bg-studio-accent/90 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Asset
            </motion.button>
          )}
        </div>
      )}
      
      <div 
        ref={scrollContainerRef}
        className="bookshelf-container overflow-x-auto scrollbar-hide pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex space-x-8 px-4 min-w-max">
          {assets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <VinylRecord asset={asset} onSelect={onSelectAsset} />
            </motion.div>
          ))}
          
          {/* Add New Asset Card */}
          {onAddAsset && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: assets.length * 0.1 }}
              className="flex-shrink-0"
            >
              <motion.div
                whileHover={{ y: -20, scale: 1.05 }}
                onClick={onAddAsset}
                className="w-64 h-64 bg-gradient-to-br from-studio-sand/30 to-studio-accent/20 border-2 border-dashed border-studio-accent/40 rounded-lg cursor-pointer flex flex-col items-center justify-center group hover:border-studio-accent/60 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-studio-accent/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-studio-accent/30 transition-colors">
                  <Plus className="h-8 w-8 text-studio-accent" />
                </div>
                <span className="text-studio-accent font-medium text-sm">Add New Asset</span>
                <span className="text-studio-muted text-xs mt-1">Click to create</span>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2 text-xs text-studio-muted">
          <div className="w-4 h-4 border border-studio-muted/30 rounded flex items-center justify-center">
            <div className="w-1 h-1 bg-studio-muted/50 rounded-full"></div>
          </div>
          <span>Scroll horizontally to view more</span>
        </div>
      </div>
    </div>
  );
};

export default VinylBookshelf;