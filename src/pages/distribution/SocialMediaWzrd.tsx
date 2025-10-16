import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Globe,
  Star,
  TrendingUp,
  Heart,
  MessageCircle,
  Share,
  Eye,
  Zap,
  BarChart3
} from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SocialCalendar } from "@/components/distribution/social/SocialCalendar";
import { CreatePostModal } from "@/components/distribution/social/CreatePostModal";
import { HashtagManager } from "@/components/distribution/social/HashtagManager";
import { NotificationCenter } from "@/components/on-chain/shared/NotificationCenter";
import { Toaster } from "sonner";
import { mockSocialPosts } from "./mockSocialData";
import { SocialPost } from "./types";

export default function SocialMediaWzrd() {
  const navigate = useNavigate();
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
    setEditingPost(null);
    setCurrentDate(date);
    setIsModalOpen(true);
  };

  const handleSavePost = (postData: Partial<SocialPost>) => {
    if (editingPost) {
      setPosts(prev => prev.map(p => 
        p.id === editingPost.id ? { ...p, ...postData } : p
      ));
    } else {
      setPosts(prev => [...prev, postData as SocialPost]);
    }
    setEditingPost(null);
  };

  const handleHashtagClick = (hashtag: string) => {
    console.log('Hashtag clicked:', hashtag);
  };

  const QuickActions = () => (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <Zap className="h-5 w-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => {
            setEditingPost(null);
            setIsModalOpen(true);
          }}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Plus className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Create Post</h3>
              <p className="text-blue-lightest/70 text-sm">New content</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
                <CalendarIcon className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Schedule</h3>
              <p className="text-blue-lightest/70 text-sm">Plan ahead</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Analytics</h3>
              <p className="text-blue-lightest/70 text-sm">View insights</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                <Globe className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Platforms</h3>
              <p className="text-blue-lightest/70 text-sm">Manage channels</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  const PerformanceMetrics = () => (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <TrendingUp className="h-5 w-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Performance Metrics</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Reach</h3>
              <Eye className="h-5 w-5 text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">12.5K</div>
              <div className="text-sm text-green-400">+15% this week</div>
              <div className="text-xs text-blue-lightest/70">All platforms</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Engagement</h3>
              <Heart className="h-5 w-5 text-red-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">8.2%</div>
              <div className="text-sm text-green-400">Above average</div>
              <div className="text-xs text-blue-lightest/70">Last 7 days</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Posts</h3>
              <MessageCircle className="h-5 w-5 text-purple-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">47</div>
              <div className="text-sm text-green-400">This month</div>
              <div className="text-xs text-blue-lightest/70">Scheduled</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Shares</h3>
              <Share className="h-5 w-5 text-orange-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">1.2K</div>
              <div className="text-sm text-green-400">+22% growth</div>
              <div className="text-xs text-blue-lightest/70">This month</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      <Toaster position="top-right" richColors />
      <DashboardLayout>
        <div className="p-6 relative">
          {/* Notification Center - Top Right */}
          <div className="absolute top-4 right-4 z-50">
            <NotificationCenter />
          </div>
          
          {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Star className="h-6 w-6 text-white mr-3" />
            <h1 className="text-2xl font-bold text-white">Social Media WZRD</h1>
          </div>
          <p className="text-blue-lightest/70">AI-powered social media content creation and management</p>
        </div>


        <QuickActions />
        <PerformanceMetrics />

        {/* Calendar Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-primary/20 p-3 rounded-xl">
                      <CalendarIcon className="h-8 w-8 text-blue-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {format(currentDate, 'MMMM yyyy')}
                      </h2>
                      <p className="text-blue-lightest/70">Content calendar & strategy</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={navigateToPrevious}
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={navigateToNext}
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={navigateToToday}
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    >
                      Today
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-blue-lightest/70">View:</span>
                    <ToggleGroup
                      type="single"
                      value={viewMode}
                      onValueChange={(value) => value && setViewMode(value as 'month' | 'week')}
                      className="bg-white/10 backdrop-blur-md border border-white/10 p-1 rounded-xl"
                    >
                      <ToggleGroupItem 
                        value="week" 
                        className="data-[state=on]:bg-blue-primary data-[state=on]:text-white border-none rounded-lg px-4 py-2 text-sm font-medium text-white/70"
                      >
                        Week
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="month"
                        className="data-[state=on]:bg-blue-primary data-[state=on]:text-white border-none rounded-lg px-4 py-2 text-sm font-medium text-white/70"
                      >
                        Month
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  <Button
                    onClick={() => {
                      setEditingPost(null);
                      setIsModalOpen(true);
                    }}
                    className="bg-blue-primary hover:bg-blue-primary/80 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-3"
          >
            <SocialCalendar
              posts={posts}
              currentDate={currentDate}
              viewMode={viewMode}
              onPostClick={handlePostClick}
              onDateClick={handleDateClick}
            />
          </motion.div>

          {/* Hashtag Manager */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-1"
          >
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
      </div>
    </DashboardLayout>
    </>
  );
}