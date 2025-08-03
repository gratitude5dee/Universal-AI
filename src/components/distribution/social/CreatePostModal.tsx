import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Calendar as CalendarIcon, Hash, Image, Video } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SocialPost, SocialPlatform, SocialPostStatus } from '@/pages/distribution/types';
import { cn } from '@/lib/utils';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: SocialPost | null;
  onSave: (post: Partial<SocialPost>) => void;
}

const platformOptions: SocialPlatform[] = ['Instagram', 'Facebook', 'Twitter', 'YouTube', 'LinkedIn', 'TikTok', 'Pinterest'];
const statusOptions: SocialPostStatus[] = ['Draft', 'Pending', 'Approved', 'Scheduled'];

const platformIcons: Record<SocialPlatform, string> = {
  Instagram: "📷",
  Facebook: "📘",
  Twitter: "🐦",
  YouTube: "📺",
  LinkedIn: "💼",
  TikTok: "🎵",
  Pinterest: "📌"
};

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  post,
  onSave
}) => {
  const [content, setContent] = useState(post?.content || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(post?.platforms || []);
  const [status, setStatus] = useState<SocialPostStatus>(post?.status || 'Draft');
  const [scheduledDate, setScheduledDate] = useState<Date>(post?.scheduledAt || new Date());
  const [scheduledTime, setScheduledTime] = useState(
    post?.scheduledAt ? format(post.scheduledAt, 'HH:mm') : '12:00'
  );
  const [category, setCategory] = useState(post?.category || '');
  const [hashtags, setHashtags] = useState(post?.hashtags?.join(' ') || '');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const handleSave = (actionType: 'draft' | 'schedule' | 'approve') => {
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const finalDate = new Date(scheduledDate);
    finalDate.setHours(hours, minutes);

    const postData: Partial<SocialPost> = {
      id: post?.id || `post-${Date.now()}`,
      content,
      platforms: selectedPlatforms,
      status: actionType === 'draft' ? 'Draft' : actionType === 'schedule' ? 'Scheduled' : 'Pending',
      scheduledAt: finalDate,
      category: category || undefined,
      hashtags: hashtags ? hashtags.split(' ').filter(tag => tag.trim()) : undefined,
      media: post?.media || [] // Keep existing media for now
    };

    onSave(postData);
    onClose();
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 backdrop-blur-md">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-foreground">
                  {post ? 'Edit Post' : 'Create New Post'}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium">
                    Post Content
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[120px] bg-secondary/10 border-white/10"
                    maxLength={2200}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {content.length}/2200
                  </div>
                </div>

                {/* Media Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Media</Label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/30 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop images or videos, or click to browse
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          setMediaFiles(Array.from(e.target.files));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Platforms */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Platforms</Label>
                  <ToggleGroup
                    type="multiple"
                    value={selectedPlatforms}
                    onValueChange={(value: string[]) => setSelectedPlatforms(value as SocialPlatform[])}
                    className="flex flex-wrap gap-2"
                  >
                    {platformOptions.map((platform) => (
                      <ToggleGroupItem
                        key={platform}
                        value={platform}
                        className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary border border-white/10"
                      >
                        <span className="mr-2">{platformIcons[platform]}</span>
                        {platform}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Schedule Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-secondary/10 border-white/10",
                            !scheduledDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduledDate ? format(scheduledDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={(date) => date && setScheduledDate(date)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm font-medium">
                      Schedule Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="bg-secondary/10 border-white/10"
                    />
                  </div>
                </div>

                {/* Status & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <Select value={status} onValueChange={(value: SocialPostStatus) => setStatus(value)}>
                      <SelectTrigger className="bg-secondary/10 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((statusOption) => (
                          <SelectItem key={statusOption} value={statusOption}>
                            {statusOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category
                    </Label>
                    <Input
                      id="category"
                      placeholder="e.g., Music Release, Behind the Scenes"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-secondary/10 border-white/10"
                    />
                  </div>
                </div>

                {/* Hashtags */}
                <div className="space-y-2">
                  <Label htmlFor="hashtags" className="text-sm font-medium">
                    <Hash className="inline w-4 h-4 mr-1" />
                    Hashtags
                  </Label>
                  <Input
                    id="hashtags"
                    placeholder="#music #studio #newrelease"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    className="bg-secondary/10 border-white/10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate hashtags with spaces
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleSave('draft')}
                    className="bg-secondary/20"
                  >
                    Save Draft
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={() => handleSave('schedule')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Schedule Post
                  </Button>
                  <Button 
                    onClick={() => handleSave('approve')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Send for Approval
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};