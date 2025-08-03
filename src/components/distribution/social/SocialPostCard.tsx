import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Eye, Image, Video, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SocialPost, SocialPlatform } from '@/pages/distribution/types';

interface SocialPostCardProps {
  post: SocialPost;
  onClick?: () => void;
  isDragging?: boolean;
}

const platformIcons: Record<SocialPlatform, string> = {
  Instagram: "📷",
  Facebook: "📘",
  Twitter: "🐦",
  YouTube: "📺",
  LinkedIn: "💼",
  TikTok: "🎵",
  Pinterest: "📌"
};

const statusColors = {
  Draft: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  Pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Approved: "bg-green-500/20 text-green-300 border-green-500/30",
  Scheduled: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Published: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Failed: "bg-red-500/20 text-red-300 border-red-500/30"
};

export const SocialPostCard: React.FC<SocialPostCardProps> = ({ post, onClick, isDragging }) => {
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { 
      scale: 1.02,
      y: -2,
      transition: { duration: 0.2 }
    },
    drag: {
      scale: 1.05,
      rotate: 2,
      zIndex: 50
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileDrag="drag"
      drag
      dragMomentum={false}
      className="cursor-move"
      layout
    >
      <Card 
        className={`glass-card border border-white/10 backdrop-blur-md transition-all duration-300 ${
          isDragging ? 'shadow-2xl shadow-primary/20' : 'hover:shadow-lg hover:shadow-primary/10'
        } cursor-pointer`}
        onClick={onClick}
      >
        <CardContent className="p-3 space-y-2">
          {/* Media Thumbnail */}
          {post.media.length > 0 && (
            <div className="relative w-full h-20 rounded-md overflow-hidden bg-secondary/20">
              <img 
                src={post.media[0].url} 
                alt="Post media"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                {post.media[0].type === 'video' ? 
                  <Video className="w-4 h-4 text-white" /> : 
                  <Image className="w-4 h-4 text-white" />
                }
              </div>
            </div>
          )}

          {/* Content Preview */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {post.content}
            </p>

            {/* Platforms */}
            {post.platforms.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.platforms.map((platform) => (
                  <span key={platform} className="text-xs" title={platform}>
                    {platformIcons[platform]}
                  </span>
                ))}
              </div>
            )}

            {/* Schedule Time */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{format(post.scheduledAt, 'HH:mm')}</span>
            </div>

            {/* Status & Category */}
            <div className="flex items-center justify-between gap-2">
              <Badge 
                variant="outline" 
                className={`text-xs px-2 py-0.5 ${statusColors[post.status]}`}
              >
                {post.status}
              </Badge>
              
              {post.category && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-secondary/30">
                  {post.category}
                </Badge>
              )}
            </div>

            {/* Hashtags */}
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.hashtags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="text-xs text-primary">
                    {tag}
                  </span>
                ))}
                {post.hashtags.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{post.hashtags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};