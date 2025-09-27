import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ScheduleCalendarNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={350} minHeight={350} />
      <div className="glass-card p-6 w-full h-full border border-white/10 backdrop-blur-md rounded-lg flex flex-col">
        <h2 className="text-xl font-medium flex items-center gap-2 mb-4 flex-shrink-0">
          <Calendar className="text-[#9b87f5]" size={20} />
          Schedule & Calendar
        </h2>
        <Tabs defaultValue="schedule" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 glass-card border border-white/10 backdrop-blur-md flex-shrink-0">
            <TabsTrigger value="schedule" className="data-[state=active]:glass-card">Schedule</TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:glass-card">Calendar</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule" className="flex-1">
            <ScrollArea className="h-full">
              <div className="mt-4 space-y-3">
                <motion.div 
                  className="flex items-center p-3 glass-card border border-white/10 backdrop-blur-md rounded-lg hover:bg-white/5"
                  whileHover={{ x: 3 }}
                >
                  <Calendar className="h-4 w-4 text-[#33C3F0] mr-3" />
                  <div>
                    <p className="text-sm font-medium text-studio-charcoal">Studio Session</p>
                    <p className="text-xs text-studio-clay">2:00 PM - 5:00 PM</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center p-3 glass-card border border-white/10 backdrop-blur-md rounded-lg hover:bg-white/5"
                  whileHover={{ x: 3 }}
                >
                  <Calendar className="h-4 w-4 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-studio-charcoal">Travel to Denver</p>
                    <p className="text-xs text-studio-clay">Next Week</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center p-3 glass-card border border-white/10 backdrop-blur-md rounded-lg hover:bg-white/5"
                  whileHover={{ x: 3 }}
                >
                  <Calendar className="h-4 w-4 text-[#9b87f5] mr-3" />
                  <div>
                    <p className="text-sm font-medium text-studio-charcoal">Album Review</p>
                    <p className="text-xs text-studio-clay">Friday 3:00 PM</p>
                  </div>
                </motion.div>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="calendar" className="flex-1">
            <ScrollArea className="h-full">
              <div className="mt-4 p-8 glass-card border border-white/10 backdrop-blur-md rounded-lg text-center">
                <Calendar className="h-12 w-12 text-studio-clay mx-auto mb-4" />
                <p className="text-sm text-studio-clay">Interactive calendar widget goes here</p>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
});

ScheduleCalendarNode.displayName = 'ScheduleCalendarNode';

export default ScheduleCalendarNode;