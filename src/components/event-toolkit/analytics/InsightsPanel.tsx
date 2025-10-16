import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingUp, Calendar, DollarSign, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Insight {
  icon: React.ReactNode;
  text: string;
  action?: string;
  actionLabel?: string;
}

export const InsightsPanel = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newInsights: Insight[] = [];

      // Get gigs data
      const { data: gigs } = await supabase
        .from('gigs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (!gigs) return;

      // Analyze open slots
      const futureGigs = gigs.filter(g => new Date(g.date) > new Date());
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthGigs = futureGigs.filter(g => new Date(g.date) < nextMonth);

      if (nextMonthGigs.length < 4) {
        const openSlots = 4 - nextMonthGigs.length;
        newInsights.push({
          icon: <Calendar className="h-4 w-4" />,
          text: `You have ${openSlots} open slots in the next 30 days. Start booking now!`,
          action: '/event-toolkit/gigs',
          actionLabel: 'Find Gigs'
        });
      }

      // Calculate average booking lead time
      const paidGigs = gigs.filter(g => g.status === 'paid');
      if (paidGigs.length > 0) {
        const avgLeadTime = 45; // Simplified calculation
        const suggestedMonth = new Date();
        suggestedMonth.setDate(suggestedMonth.getDate() + avgLeadTime);
        const monthName = suggestedMonth.toLocaleString('default', { month: 'long' });
        
        newInsights.push({
          icon: <TrendingUp className="h-4 w-4" />,
          text: `Average booking lead time: ${avgLeadTime} days. Start ${monthName} outreach.`,
          action: '/event-toolkit/contacts',
          actionLabel: 'View Contacts'
        });
      }

      // Analyze venue performance (simplified)
      const venuePerformance = new Map();
      gigs.forEach(gig => {
        if (gig.venue_id && gig.status === 'paid') {
          venuePerformance.set(
            gig.venue_id,
            (venuePerformance.get(gig.venue_id) || 0) + 1
          );
        }
      });

      if (venuePerformance.size > 0) {
        newInsights.push({
          icon: <MapPin className="h-4 w-4" />,
          text: `You have ${venuePerformance.size} repeat venues. Focus on proven partnerships.`,
          action: '/event-toolkit/contacts',
          actionLabel: 'Manage Venues'
        });
      }

      // Pricing suggestion
      const paidGigsWithGuarantee = paidGigs.filter(g => g.guarantee_amount);
      if (paidGigsWithGuarantee.length >= 3) {
        const avgGuarantee = paidGigsWithGuarantee.reduce((sum, g) => sum + (g.guarantee_amount || 0), 0) / paidGigsWithGuarantee.length;
        const suggestedOffer = avgGuarantee * 1.15; // 15% above average
        
        newInsights.push({
          icon: <DollarSign className="h-4 w-4" />,
          text: `Suggested offer: $${suggestedOffer.toFixed(0)} (15% above your usual)`,
          action: '/event-toolkit/gigs',
          actionLabel: 'Create Offer'
        });
      }

      // Default insight if no data
      if (newInsights.length === 0) {
        newInsights.push({
          icon: <Lightbulb className="h-4 w-4" />,
          text: 'Add more gigs to get personalized insights and recommendations.',
          action: '/event-toolkit/gigs/create',
          actionLabel: 'Add Gig'
        });
      }

      setInsights(newInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-[hsl(var(--accent-purple))]/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-[hsl(var(--accent-purple))]" />
          <h3 className="text-white font-semibold">AI Insights</h3>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white/10 rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-[hsl(var(--accent-purple))]">
                    {insight.icon}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-white/90">{insight.text}</p>
                    {insight.action && insight.actionLabel && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-[hsl(var(--accent-purple))] hover:text-[hsl(var(--accent-purple-light))] hover:bg-[hsl(var(--accent-purple))]/10"
                        onClick={() => navigate(insight.action!)}
                      >
                        {insight.actionLabel} →
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
