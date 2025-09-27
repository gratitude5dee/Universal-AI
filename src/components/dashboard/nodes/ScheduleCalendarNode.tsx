import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ScheduleCalendarNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={380} minHeight={380} />
      <div className="glass-card p-8 w-full h-full overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 pointer-events-none rounded-[2.5rem]"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6 text-white">
            <div className="p-2 glass-card-tertiary rounded-2xl">
              <Calendar className="text-orange-400" size={20} />
            </div>
            Schedule & Calendar
          </h2>
          <Tabs defaultValue="schedule">
            <TabsList className="grid w-full grid-cols-2 glass-card-secondary p-1 mb-6">
              <TabsTrigger value="schedule" className="data-[state=active]:glass-card-tertiary data-[state=active]:text-white rounded-2xl py-3 font-semibold transition-all duration-200">Schedule</TabsTrigger>
              <TabsTrigger value="calendar" className="data-[state=active]:glass-card-tertiary data-[state=active]:text-white rounded-2xl py-3 font-semibold transition-all duration-200">Calendar</TabsTrigger>
            </TabsList>
            <TabsContent value="schedule">
              <div className="space-y-4">
                <motion.div 
                  className="glass-card-secondary p-5 group/item"
                  whileHover={{ x: 4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 glass-card-tertiary rounded-xl group-hover/item:scale-110 transition-transform">
                      <Calendar className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white mb-1">Studio Session</p>
                      <p className="text-sm text-white/70">2:00 PM - 5:00 PM</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  className="glass-card-secondary p-5 group/item"
                  whileHover={{ x: 4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 glass-card-tertiary rounded-xl group-hover/item:scale-110 transition-transform">
                      <Calendar className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white mb-1">Travel to Denver</p>
                      <p className="text-sm text-white/70">Next Week</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  className="glass-card-secondary p-5 group/item"
                  whileHover={{ x: 4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 glass-card-tertiary rounded-xl group-hover/item:scale-110 transition-transform">
                      <Calendar className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white mb-1">Album Review</p>
                      <p className="text-sm text-white/70">Friday 3:00 PM</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </TabsContent>
            <TabsContent value="calendar">
              <div className="glass-card-secondary p-8 text-center">
                <div className="p-4 glass-card-tertiary rounded-3xl w-fit mx-auto mb-6">
                  <Calendar className="h-12 w-12 text-orange-400" />
                </div>
                <p className="text-lg font-semibold text-white mb-2">Interactive Calendar</p>
                <p className="text-sm text-white/70">Full calendar integration coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
});

ScheduleCalendarNode.displayName = 'ScheduleCalendarNode';

export default ScheduleCalendarNode;