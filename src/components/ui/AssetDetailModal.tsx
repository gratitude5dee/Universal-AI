import React from 'react';
import { motion } from 'framer-motion';
import { X, Link as LinkIcon, Plus } from 'lucide-react';
import { FaSpotify, FaSoundcloud, FaInstagram, FaTwitter } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { Asset } from './VinylRecord';

interface AssetDetailModalProps {
  asset: Asset | null;
  onClose: () => void;
}

const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose }) => {
  if (!asset) return null;

  const socialLinks = [
    { icon: FaSpotify, href: '#' },
    { icon: FaSoundcloud, href: '#' },
    { icon: FaInstagram, href: '#' },
    { icon: FaTwitter, href: '#' },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="liquid-glass-modal w-full max-w-4xl h-[600px] rounded-2xl flex p-8 text-white relative"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
          <X size={24} />
        </button>
        
        <div className="w-1/2 pr-8 flex flex-col justify-center items-center">
          <motion.img
            src={asset.preview}
            alt={asset.title}
            className="w-full max-w-sm aspect-square object-cover rounded-xl shadow-2xl shadow-black/50"
            layoutId={`asset-image-${asset.id}`}
          />
          <h2 className="text-3xl font-bold mt-4">{asset.title}</h2>
          <p className="text-white/70">{asset.collection}</p>
        </div>

        <div className="w-1/2 pl-8 border-l border-white/10 flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Digital Links</h3>
          <div className="space-y-3 flex-grow overflow-y-auto">
            <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
              <span className="flex items-center"><LinkIcon size={16} className="mr-2"/> Main Asset Link</span>
              <a href="#" className="text-sm text-cyan-400 hover:underline">View</a>
            </div>
             <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
              <span className="flex items-center"><LinkIcon size={16} className="mr-2"/> Video</span>
              <a href="#" className="text-sm text-cyan-400 hover:underline">Watch</a>
            </div>
             <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
              <span className="flex items-center"><LinkIcon size={16} className="mr-2"/> Song</span>
              <a href="#" className="text-sm text-cyan-400 hover:underline">Listen</a>
            </div>
          </div>

          <div className="py-4 border-y border-white/10 my-4">
            <h4 className="text-lg font-semibold mb-3">Share</h4>
             <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    {socialLinks.map((link, index) => (
                      <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">
                        <link.icon size={24} />
                      </a>
                    ))}
                </div>
                 <button className="flex items-center text-sm text-cyan-400 hover:underline">
                    <Plus size={16} className="mr-1"/> Add New Link
                 </button>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG value={`https://universalai.studio/asset/${asset.id}`} size={80} bgColor="#ffffff" fgColor="#000000" />
            </div>
            <div>
                <h4 className="font-semibold">Scan QR Code</h4>
                <p className="text-sm text-white/70">Access this asset on any device.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AssetDetailModal;