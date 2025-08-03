import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";

const TourCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

  // Mock events data
  const events = [
    {
      id: 1,
      title: "Live at The Blue Note",
      date: new Date(2024, 2, 15),
      type: "show",
      venue: "The Blue Note",
      city: "New York, NY",
      status: "confirmed"
    },
    {
      id: 2,
      title: "Sound Check",
      date: new Date(2024, 2, 15),
      type: "rehearsal",
      venue: "The Blue Note",
      city: "New York, NY",
      status: "confirmed"
    },
    {
      id: 3,
      title: "Travel Day - NYC to Boston",
      date: new Date(2024, 2, 16),
      type: "travel",
      venue: "Transportation",
      city: "NYC → Boston",
      status: "confirmed"
    },
    {
      id: 4,
      title: "House of Blues Show",
      date: new Date(2024, 2, 18),
      type: "show",
      venue: "House of Blues",
      city: "Boston, MA",
      status: "pending"
    }
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'show': return 'bg-studio-accent/20 text-studio-accent border-studio-accent/30';
      case 'travel': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'rehearsal': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'promo': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Tour Calendar
            </CardTitle>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'month' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('month')}
                  className={viewMode === 'month' ? 'bg-studio-accent hover:bg-studio-accent/80' : 'text-white hover:bg-white/10'}
                >
                  Month
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-studio-accent hover:bg-studio-accent/80' : 'text-white hover:bg-white/10'}
                >
                  List
                </Button>
              </div>
              
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              
              <Button size="sm" className="bg-studio-accent hover:bg-studio-accent/80">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {viewMode === 'month' ? (
        /* Monthly Calendar View */
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentDate(new Date())}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Today
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-white/70">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentDay = isToday(day);
                
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`
                      min-h-[100px] p-2 rounded-lg border transition-all duration-200 cursor-pointer
                      ${isCurrentDay 
                        ? 'bg-studio-accent/20 border-studio-accent/50' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }
                    `}
                  >
                    <div className={`text-sm font-medium mb-1 ${isCurrentDay ? 'text-studio-accent' : 'text-white'}`}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)} truncate`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-white/50">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* List View */
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                    {event.type === 'show' && <Calendar className="h-4 w-4" />}
                    {event.type === 'travel' && <MapPin className="h-4 w-4" />}
                    {event.type === 'rehearsal' && <Clock className="h-4 w-4" />}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-medium">{event.title}</h3>
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                  <p className="text-white/70 text-sm">
                    {event.venue} • {event.city}
                  </p>
                  <p className="text-white/50 text-xs">
                    {format(event.date, 'PPP')}
                  </p>
                </div>
                
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Edit
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TourCalendar;