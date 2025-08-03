
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
          className="glass-card p-6 rounded-xl border border-white/10 backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">
                {format(currentDate, 'MMMM yyyy')}
              </h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={navigateToPrevious}
                  className="bg-secondary/20 border-white/10 hover:bg-secondary/30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={navigateToNext}
                  className="bg-secondary/20 border-white/10 hover:bg-secondary/30"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={navigateToToday}
                  className="bg-secondary/20 border-white/10 hover:bg-secondary/30"
                >
                  Today
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={(value) => value && setViewMode(value as 'month' | 'week')}
                className="bg-secondary/20 p-1 rounded-lg"
              >
                <ToggleGroupItem 
                  value="week" 
                  className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary border-none"
                >
                  Week
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="month"
                  className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary border-none"
                >
                  Month
                </ToggleGroupItem>
              </ToggleGroup>

              <Button
                onClick={() => {
                  setEditingPost(null);
                  setIsModalOpen(true);
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
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
