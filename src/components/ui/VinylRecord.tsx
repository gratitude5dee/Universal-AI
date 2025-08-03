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
      className="vinyl-record-wrapper cursor-pointer"
      whileHover={{ y: -20, scale: 1.05 }}
      onClick={() => onSelect(asset)}
    >
      <div className="vinyl-sleeve">
        <img src={asset.preview} alt={asset.title} className="w-full h-full object-cover" />
        <div className="vinyl-disc" />
      </div>
    </motion.div>
  );
};

export default VinylRecord;