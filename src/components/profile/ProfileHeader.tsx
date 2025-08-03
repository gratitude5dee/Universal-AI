import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Share2, Edit } from 'lucide-react';

const ProfileHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col md:flex-row items-center gap-6 mb-8"
  >
    <motion.div whileHover={{ scale: 1.05 }} className="relative">
      <img
        src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=300&h=300&fit=crop"
        alt="Artist Avatar"
        className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-lg"
      />
      <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-pulse" />
    </motion.div>
    <div className="text-center md:text-left">
      <h1 className="text-4xl font-bold text-white text-shadow-lg">Gratitud3.eth</h1>
      <p className="text-white/80 mt-2 text-shadow-sm">Multidisciplinary Artist | Producer | Storyteller</p>
    </div>
    <div className="md:ml-auto flex gap-3">
      <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
        <Share2 size={16} className="mr-2" />
        Share Profile
      </Button>
      <Button className="bg-studio-accent hover:bg-studio-accent/90 text-white">
        <Edit size={16} className="mr-2" />
        Edit Profile
      </Button>
    </div>
  </motion.div>
);

export default ProfileHeader;