import React from "react";
import { motion } from "framer-motion";

interface VinylRecordProps {
  asset: {
    id: string;
    title: string;
    artist: string;
    image: string;
  };
  onSelect: () => void;
}

const VinylRecord: React.FC<VinylRecordProps> = ({ asset, onSelect }) => {
  return (
    <motion.div
      className="group relative w-full aspect-[1/1] cursor-pointer"
      whileHover="hover"
      onClick={onSelect}
    >
      {/* Vinyl Record - Behind the sleeve */}
      <motion.div
        className="absolute inset-0 top-[-5px] left-[5px] w-[95%] h-[95%] bg-black rounded-full flex items-center justify-center z-0"
        variants={{
          hover: { x: 30, y: -25, rotate: 10 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <div className="w-[30%] h-[30%] rounded-full" style={{ backgroundImage: `url(${asset.image})`, backgroundSize: 'cover' }}/>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.3)_70%)] opacity-20" />
      </motion.div>

      {/* Vinyl Sleeve - In front of the record */}
      <motion.div
        className="absolute inset-0 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center overflow-hidden border-2 border-gray-700 z-10"
        variants={{
          hover: { y: -20, rotate: -3 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <img src={asset.image} alt={asset.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-bold text-lg text-shadow-md">{asset.title}</h3>
          <p className="text-sm opacity-80 text-shadow-sm">{asset.artist}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VinylRecord;