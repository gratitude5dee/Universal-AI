import React from 'react';
import { motion } from 'framer-motion';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { SocialPost } from '@/pages/distribution/types';
import { SocialPostCard } from './SocialPostCard';

interface SocialCalendarProps {
  posts: SocialPost[];
  currentDate: Date;
  viewMode: 'month' | 'week';
  onPostClick: (post: SocialPost) => void;
  onDateClick: (date: Date) => void;
}

export const SocialCalendar: React.FC<SocialCalendarProps> = ({
  posts,
  currentDate,
  viewMode,
  onPostClick,
  onDateClick
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getPostsForDay = (day: Date) => {
    return posts.filter(post => 
      isSameDay(new Date(post.scheduledAt), day)
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02
      }
    }
  };

  const dayVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  if (viewMode === 'week') {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const weekDaysArray = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <motion.div 
        className="glass-card p-6 rounded-xl border border-white/10 backdrop-blur-md relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-7 gap-4 h-full">
          {weekDaysArray.map((day, index) => {
            const dayPosts = getPostsForDay(day);
            
            return (
              <motion.div
                key={day.toISOString()}
                variants={dayVariants}
                className={`space-y-2 p-3 rounded-lg border transition-all duration-300 cursor-pointer min-h-[400px] ${
                  isToday(day) 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'bg-secondary/5 border-white/5 hover:bg-secondary/10 hover:border-white/10'
                }`}
                onClick={() => onDateClick(day)}
              >
                <div className="text-center space-y-1">
                  <div className="text-xs text-muted-foreground font-medium">
                    {weekDays[index]}
                  </div>
                  <div className={`text-sm font-semibold ${
                    isToday(day) ? 'text-primary' : 'text-foreground'
                  }`}>
                    {format(day, 'd')}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {dayPosts.map((post, postIndex) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: postIndex * 0.1 }
                      }}
                    >
                      <SocialPostCard 
                        post={post} 
                        onClick={() => onPostClick(post)} 
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="glass-card p-6 rounded-xl border border-white/10 backdrop-blur-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-4 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4">
        {calendarDays.map((day, index) => {
          const dayPosts = getPostsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <motion.div
              key={day.toISOString()}
              variants={dayVariants}
              className={`min-h-[120px] p-2 rounded-lg border transition-all duration-300 cursor-pointer ${
                isToday(day) 
                  ? 'bg-primary/10 border-primary/30' 
                  : isCurrentMonth
                    ? 'bg-secondary/5 border-white/5 hover:bg-secondary/10 hover:border-white/10'
                    : 'bg-secondary/2 border-white/2 opacity-50'
              }`}
              onClick={() => onDateClick(day)}
            >
              <div className={`text-sm font-medium mb-2 ${
                isToday(day) 
                  ? 'text-primary' 
                  : isCurrentMonth 
                    ? 'text-foreground' 
                    : 'text-muted-foreground'
              }`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayPosts.slice(0, 3).map((post, postIndex) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      transition: { delay: (index * 0.02) + (postIndex * 0.1) }
                    }}
                  >
                    <SocialPostCard 
                      post={post} 
                      onClick={() => onPostClick(post)} 
                    />
                  </motion.div>
                ))}
                
                {dayPosts.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center py-1">
                    +{dayPosts.length - 3} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};