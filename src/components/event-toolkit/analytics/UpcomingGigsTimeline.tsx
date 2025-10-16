import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Gig {
  id: string;
  title: string;
  date: string;
  venue_id: string | null;
  status: string;
}

export const UpcomingGigsTimeline = () => {
  const [upcomingGigs, setUpcomingGigs] = useState<Gig[]>([]);
  const [stats, setStats] = useState({ next7Days: 0, next30Days: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUpcomingGigs();
  }, []);

  const fetchUpcomingGigs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const { data: gigs } = await supabase
        .from('gigs')
        .select('id, title, date, venue_id, status')
        .eq('user_id', user.id)
        .gte('date', now.toISOString())
        .order('date', { ascending: true })
        .limit(5);

      if (!gigs) return;

      // Calculate stats
      const sevenDaysFromNow = new Date(now);
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      const thirtyDaysFromNow = new Date(now);
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const next7Days = gigs.filter(g => 
        new Date(g.date) <= sevenDaysFromNow
      ).length;

      const next30Days = gigs.filter(g => 
        new Date(g.date) <= thirtyDaysFromNow
      ).length;

      setStats({ next7Days, next30Days });
      setUpcomingGigs(gigs);
    } catch (error) {
      console.error('Error fetching upcoming gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      day: date.getDate(),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      weekday: date.toLocaleString('default', { weekday: 'short' })
    };
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'hsl(38 92% 50%)',     // Yellow
      confirmed: 'hsl(217 91% 60%)',   // Blue
      contracted: 'hsl(189 94% 43%)',  // Cyan
      paid: 'hsl(158 64% 52%)'         // Green
    };
    return colors[status] || 'hsl(var(--text-tertiary))';
  };

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-[hsl(var(--accent-cyan))]/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[hsl(var(--accent-cyan))]" />
            <h3 className="text-white font-semibold">Upcoming Gigs</h3>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-20 bg-white/10 rounded" />
            <div className="h-32 bg-white/10 rounded" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-white">{stats.next7Days}</div>
                <div className="text-xs text-white/70">Next 7 days</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-white">{stats.next30Days}</div>
                <div className="text-xs text-white/70">Next 30 days</div>
              </div>
            </div>

            {upcomingGigs.length > 0 ? (
              <div className="space-y-3">
                {upcomingGigs.map((gig) => {
                  const dateInfo = formatDate(gig.date);
                  return (
                    <div
                      key={gig.id}
                      onClick={() => navigate('/event-toolkit/gigs')}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-12 text-center">
                        <div className="text-xs text-white/60">{dateInfo.month}</div>
                        <div className="text-xl font-bold text-white">{dateInfo.day}</div>
                        <div className="text-xs text-white/60">{dateInfo.weekday}</div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">{gig.title}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {dateInfo.time}
                          </div>
                          <div
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${getStatusColor(gig.status)}20`,
                              color: getStatusColor(gig.status)
                            }}
                          >
                            {gig.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-white/50">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No upcoming gigs scheduled</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
