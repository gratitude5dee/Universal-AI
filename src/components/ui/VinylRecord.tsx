import React from 'react';
import { motion } from 'framer-motion';

export interface Asset {
  id: string;
  title: string;
  type: "image" | "video" | "audio";
  preview: string;
  chain: string;
  collection: string;
  description: string;
  journey: { date: string; event: string; chain: string }[];
  milestone?: { type: string; message: string };
  views: number;
  likes: number;
  awards: number;
  featured: boolean;
}

interface VinylRecordProps {
  asset: Asset;
  onSelect: (asset: Asset) => void;
}

const VinylRecord: React.FC<VinylRecordProps> = ({ asset, onSelect }) => {
  return (
    <motion.div
      className="vinyl-record-wrapper cursor-pointer relative w-64 h-64 group flex-shrink-0"
      whileHover={{ y: -20, scale: 1.05 }}
      onClick={() => onSelect(asset)}
    >
      <div className="vinyl-sleeve relative w-full h-full overflow-hidden rounded-lg shadow-xl">
        {/* Album Cover */}
        <img 
          src={asset.preview} 
          alt={asset.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:translate-x-8" 
        />
        
        {/* Vinyl Disc - hidden behind cover, slides out on hover */}
        <div className="vinyl-disc absolute top-2 -right-2 w-60 h-60 bg-gradient-to-br from-gray-900 to-black rounded-full shadow-2xl transform transition-transform duration-500 -translate-x-full group-hover:translate-x-0">
          {/* Vinyl record details */}
          <div className="absolute inset-4 rounded-full border-2 border-gray-600">
            <div className="absolute inset-8 rounded-full border border-gray-700">
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gray-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </div>
          
          {/* Record label */}
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-studio-accent rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className="text-white text-xs font-bold text-center">{asset.title.substring(0, 10)}</span>
          </div>
        </div>
        
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transform transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="text-white font-semibold text-sm truncate">{asset.title}</h3>
          <p className="text-white/70 text-xs">{asset.collection}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default VinylRecord;