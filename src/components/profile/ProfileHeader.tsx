import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Share2, Edit, ExternalLink, Award, Users } from 'lucide-react';

const ProfileHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="glass-card p-8"
  >
    {/* Main Profile Content */}
    <div className="flex flex-col lg:flex-row items-start gap-8">
      {/* Avatar Section */}
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        className="relative flex-shrink-0"
      >
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=300&h=300&fit=crop"
            alt="Artist Avatar"
            className="w-40 h-40 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
          />
          <div className="absolute inset-0 rounded-2xl border-2 border-studio-accent/50 animate-pulse" />
          <div className="absolute -bottom-2 -right-2 bg-studio-accent text-white p-2 rounded-full shadow-lg">
            <Award size={20} />
          </div>
        </div>
      </motion.div>

      {/* Profile Info */}
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <motion.h1 
              className="text-4xl font-bold text-studio-charcoal mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Gratitud3.eth
            </motion.h1>
            <motion.p 
              className="text-studio-muted text-lg mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Multidisciplinary Artist | Producer | Storyteller
            </motion.p>
            
            {/* Quick Stats */}
            <motion.div 
              className="flex gap-6 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <Users size={16} className="text-studio-accent" />
                <span className="text-studio-muted">1.2K Followers</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-studio-accent" />
                <span className="text-studio-muted">15 Awards</span>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink size={16} className="text-studio-accent" />
                <span className="text-studio-muted">8 Platforms</span>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div 
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              variant="outline" 
              className="bg-white/80 border-studio-sand/50 text-studio-charcoal hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <Share2 size={16} className="mr-2" />
              Share Profile
            </Button>
            <Button className="bg-studio-accent hover:bg-studio-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Edit size={16} className="mr-2" />
              Edit Profile
            </Button>
          </motion.div>
        </div>
      </div>
    </div>

    {/* Profile Status Bar */}
    <motion.div 
      className="mt-6 pt-6 border-t border-studio-sand/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-studio-muted">Profile Active</span>
          </div>
          <div className="text-sm text-studio-muted">
            Last updated: Today
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <span className="px-3 py-1 bg-studio-accent/10 text-studio-accent rounded-full font-medium">
            Verified Artist
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
            85% Complete
          </span>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default ProfileHeader;