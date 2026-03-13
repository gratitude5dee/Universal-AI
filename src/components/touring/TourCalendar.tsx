import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Filter, Plus, Route } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTouringCalendarEvents } from "@/hooks/useTouringWorkspace";

const TourCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(() => startOfDay(new Date()));
  const [viewMode, setViewMode] = useState<"month" | "list">("month");
  const { data: events = [], isLoading } = useTouringCalendarEvents();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const eventSummary = useMemo(
    () => ({
      shows: events.filter((event) => event.type === "show").length,
      routes: events.filter((event) => event.type === "route").length,
    }),
    [events],
  );

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "show":
        return "bg-studio-accent/20 text-studio-accent border-studio-accent/30";
      case "route":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getEventsForDay = (day: Date) =>
    events.filter((event) => isSameDay(new Date(event.date), day));

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border border-white/20 bg-white/10 backdrop-blur-md shadow-card-glow">
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-white">
                <Calendar className="h-5 w-5" />
                Tour Calendar
              </CardTitle>
              <p className="mt-2 text-sm text-white/60">
                {eventSummary.shows} show dates and {eventSummary.routes} route plans currently persisted.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/5 p-1">
                <Button
                  size="sm"
                  variant={viewMode === "month" ? "default" : "ghost"}
                  onClick={() => setViewMode("month")}
                  className={viewMode === "month" ? "bg-studio-accent hover:bg-studio-accent/80" : "text-white hover:bg-white/10"}
                >
                  Month
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-studio-accent hover:bg-studio-accent/80" : "text-white hover:bg-white/10"}
                >
                  List
                </Button>
              </div>

              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => navigate("/touring?tab=gigs")}>
                <Filter className="mr-2 h-4 w-4" />
                Open Gigs
              </Button>

              <Button size="sm" className="bg-studio-accent hover:bg-studio-accent/80" onClick={() => navigate("/event-toolkit/gigs/create")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {viewMode === "month" ? (
        <Card className="border border-white/20 bg-white/10 backdrop-blur-md shadow-card-glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{format(currentDate, "MMMM yyyy")}</h2>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Previous
                </Button>
                <Button size="sm" variant="outline" onClick={() => setCurrentDate(new Date())} className="border-white/20 text-white hover:bg-white/10">
                  Today
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-white/70">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentDay = isToday(day);

                return (
                  <motion.div
                    key={day.toISOString()}
                    whileHover={{ scale: 1.02 }}
                    className={`min-h-[100px] cursor-pointer rounded-lg border p-2 transition-all duration-200 ${
                      isCurrentDay ? "border-studio-accent/50 bg-studio-accent/20" : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className={`mb-1 text-sm font-medium ${isCurrentDay ? "text-studio-accent" : "text-white"}`}>{format(day, "d")}</div>

                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div key={event.id} className={`truncate rounded border p-1 text-xs ${getEventTypeColor(event.type)}`}>
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 ? <div className="text-xs text-white/50">+{dayEvents.length - 2} more</div> : null}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-white/20 bg-white/10 backdrop-blur-md shadow-card-glow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.length === 0 ? (
              <div className="py-8 text-center text-white/70">
                <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>No touring events scheduled</p>
                <p className="text-sm">Create a gig or add route planning to populate the calendar.</p>
              </div>
            ) : (
              events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="flex items-center space-x-4 rounded-lg border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10"
                >
                  <div className={`rounded-lg p-2 ${getEventTypeColor(event.type)}`}>
                    {event.type === "show" ? <Calendar className="h-4 w-4" /> : <Route className="h-4 w-4" />}
                  </div>

                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="font-medium text-white">{event.title}</h3>
                      <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                    </div>
                    <p className="text-sm text-white/70">
                      {event.venue} • {event.city}
                    </p>
                    <p className="text-xs text-white/50">{format(new Date(event.date), "PPP")}</p>
                  </div>

                  <div className="flex items-center gap-2 text-white/50">
                    <MapPin className="h-4 w-4" />
                    <Clock className="h-4 w-4" />
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TourCalendar;
