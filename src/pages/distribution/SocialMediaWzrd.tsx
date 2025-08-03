
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import DistributionLayout from "@/layouts/distribution-layout";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SocialCalendar } from "@/components/distribution/social/SocialCalendar";
import { CreatePostModal } from "@/components/distribution/social/CreatePostModal";
import { HashtagManager } from "@/components/distribution/social/HashtagManager";
import { mockSocialPosts } from "./mockSocialData";
import { SocialPost } from "./types";

export default function SocialMediaWzrd() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [posts, setPosts] = useState<SocialPost[]>(mockSocialPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);

  const navigateToPrevious = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const navigateToNext = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const handlePostClick = (post: SocialPost) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDateClick = (date: Date) => {
    // Create new post with selected date
    setEditingPost(null);
    setCurrentDate(date);
    setIsModalOpen(true);
  };

  const handleSavePost = (postData: Partial<SocialPost>) => {
    if (editingPost) {
      // Update existing post
      setPosts(prev => prev.map(p => 
        p.id === editingPost.id ? { ...p, ...postData } : p
      ));
    } else {
      // Create new post
      setPosts(prev => [...prev, postData as SocialPost]);
    }
    setEditingPost(null);
  };

  const handleHashtagClick = (hashtag: string) => {
    // This would add the hashtag to the current post being edited
    console.log('Hashtag clicked:', hashtag);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <DistributionLayout title="Social Media WZRD" subtitle="Manage your social media content calendar and strategy">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header Section */}
        <motion.div 
          variants={itemVariants}
          className="glass-card p-6 rounded-xl border border-white/10 backdrop-blur-md relative overflow-hidden"
        >
          {/* Background texture */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')] opacity-30" />
          
          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-studio-accent/20 p-3 rounded-xl">
                  <CalendarIcon className="h-8 w-8 text-studio-accent" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {format(currentDate, 'MMMM yyyy')}
                  </h1>
                  <p className="text-muted-foreground mt-1">Content calendar & strategy</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={navigateToPrevious}
                    className="bg-secondary/20 border-white/10 hover:bg-secondary/30 hover:border-white/20 transition-all duration-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={navigateToNext}
                    className="bg-secondary/20 border-white/10 hover:bg-secondary/30 hover:border-white/20 transition-all duration-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={navigateToToday}
                    className="bg-secondary/20 border-white/10 hover:bg-secondary/30 hover:border-white/20 transition-all duration-200"
                  >
                    Today
                  </Button>
                </motion.div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Enhanced View Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">View:</span>
                <ToggleGroup
                  type="single"
                  value={viewMode}
                  onValueChange={(value) => value && setViewMode(value as 'month' | 'week')}
                  className="bg-white/10 backdrop-blur-md border border-white/10 p-1 rounded-xl shadow-lg"
                >
                  <ToggleGroupItem 
                    value="week" 
                    className="data-[state=on]:bg-studio-accent data-[state=on]:text-white border-none rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10"
                  >
                    Week
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="month"
                    className="data-[state=on]:bg-studio-accent data-[state=on]:text-white border-none rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10"
                  >
                    Month
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => {
                    setEditingPost(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-studio-accent to-purple-600 hover:from-studio-accent/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar */}
          <motion.div variants={itemVariants} className="xl:col-span-3">
            <SocialCalendar
              posts={posts}
              currentDate={currentDate}
              viewMode={viewMode}
              onPostClick={handlePostClick}
              onDateClick={handleDateClick}
            />
          </motion.div>

          {/* Hashtag Manager */}
          <motion.div variants={itemVariants} className="xl:col-span-1">
            <HashtagManager onHashtagClick={handleHashtagClick} />
          </motion.div>
        </div>

        {/* Create/Edit Post Modal */}
        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPost(null);
          }}
          post={editingPost}
          onSave={handleSavePost}
        />
      </motion.div>
    </DistributionLayout>
  );
}
