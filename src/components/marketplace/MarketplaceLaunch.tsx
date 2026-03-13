
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  Clock, CheckCircle2, 
  ListChecks, 
  Store, 
  Globe, 
  PartyPopper, 
  MessageSquare, 
  Wine, 
  Award, 
  Heart,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const COUNTDOWN_TIME = 5; // 5 seconds for demo purposes
const defaultChecklist = [
  { id: "details", text: "Finalize your creation details", completed: false },
  { id: "pricing", text: "Set pricing and revenue splits", completed: false },
  { id: "visibility", text: "Choose marketplace visibility", completed: false },
  { id: "promotion", text: "Prepare promotional materials", completed: false },
  { id: "rights", text: "Review rights management", completed: false },
];

const MarketplaceLaunch = () => {
  const [currentStage, setCurrentStage] = useState<'preparation' | 'countdown' | 'launched' | 'celebration'>('preparation');
  const [checklist, setChecklist] = useState(defaultChecklist);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME);
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [launchId, setLaunchId] = useState<string | null>(null);
  const [loadingLaunch, setLoadingLaunch] = useState(true);
  const [engagementStats, setEngagementStats] = useState({
    views: 0,
    likes: 0,
    comments: 0
  });
  const { toast } = useToast();

  const venues = [
    { id: "global", name: "Global Marketplace", description: "Maximum visibility worldwide", icon: Globe },
    { id: "curated", name: "Curated Gallery", description: "Featured in our editorial selections", icon: Store },
    { id: "exclusive", name: "Exclusive Showcase", description: "Limited audience, premium positioning", icon: Award }
  ];

  useEffect(() => {
    void (async () => {
      setLoadingLaunch(true);
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        setLoadingLaunch(false);
        return;
      }

      setCreatorId(authData.user.id);

      const { data: existingLaunch } = await supabase
        .from("asset_launches")
        .select("id, venue, status")
        .eq("creator_id", authData.user.id)
        .eq("launch_mode", "marketplace")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingLaunch?.id) {
        setLaunchId(existingLaunch.id);
        setSelectedVenue(existingLaunch.venue ?? null);
        if (existingLaunch.status === "published") {
          setCurrentStage("celebration");
        }
        setLoadingLaunch(false);
        return;
      }

      const { data: createdLaunch, error: createError } = await supabase
        .from("asset_launches")
        .insert({
          creator_id: authData.user.id,
          launch_provider: "marketplace",
          launch_mode: "marketplace",
          status: "draft",
          metadata: {},
        })
        .select("id")
        .single();

      if (createError || !createdLaunch) {
        toast({
          title: "Unable to create launch draft",
          description: createError?.message ?? "Unknown launch bootstrap error.",
          variant: "destructive",
        });
        setLoadingLaunch(false);
        return;
      }

      setLaunchId(createdLaunch.id);
      setLoadingLaunch(false);
    })();
  }, [toast]);

  useEffect(() => {
    if (!launchId) return;

    void (async () => {
      const { data, error } = await supabase
        .from("launch_checklists")
        .select("item_key, label, completed")
        .eq("asset_launch_id", launchId)
        .order("created_at", { ascending: true });

      if (error) {
        toast({
          title: "Unable to load checklist",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (!data?.length) {
        setChecklist(defaultChecklist);
        return;
      }

      setChecklist(
        data.map((item) => ({
          id: String(item.item_key),
          text: String(item.label),
          completed: Boolean(item.completed),
        })),
      );
    })();
  }, [launchId, toast]);

  useEffect(() => {
    if (currentStage === 'celebration' && launchId && creatorId) {
      const interval = setInterval(() => {
        setEngagementStats((prev) => {
          const next = {
            views: prev.views + Math.floor(Math.random() * 5),
            likes: prev.likes + (Math.random() > 0.7 ? 1 : 0),
            comments: prev.comments + (Math.random() > 0.9 ? 1 : 0),
          };

          void supabase.from("launch_engagement_snapshots").upsert({
            creator_id: creatorId,
            asset_launch_id: launchId,
            metric_date: new Date().toISOString().slice(0, 10),
            views: next.views,
            likes: next.likes,
            comments: next.comments,
            shares: 0,
            revenue_amount: 0,
            metadata: {},
          }, {
            onConflict: "asset_launch_id,metric_date",
          });

          return next;
        });
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [creatorId, currentStage, launchId]);

  // Countdown timer
  useEffect(() => {
    if (currentStage === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (currentStage === 'countdown' && countdown === 0) {
      void (async () => {
        try {
          if (!launchId || !selectedVenue) {
            throw new Error("Launch draft is missing");
          }

          const { error } = await supabase.functions.invoke("marketplace-publish", {
            body: {
              launchId,
              marketplace: selectedVenue,
              venue: selectedVenue,
              visibility: selectedVenue === "exclusive" ? "exclusive" : "global",
            },
          });

          if (error) {
            throw error;
          }

          setCurrentStage('launched');
          triggerLaunchCelebration();
          setTimeout(() => {
            setCurrentStage('celebration');
          }, 3000);
        } catch (error) {
          toast({
            title: "Launch failed",
            description: error instanceof Error ? error.message : "Unknown marketplace publish error.",
            variant: "destructive",
          });
          setCurrentStage("preparation");
          setCountdown(COUNTDOWN_TIME);
        }
      })();
    }
  }, [countdown, currentStage, launchId, selectedVenue, toast]);

  const handleCheckItem = (id: string) => {
    const updatedChecklist = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item,
    );
    setChecklist(updatedChecklist);
    const toggledItem = updatedChecklist.find((item) => item.id === id);

    if (launchId && toggledItem) {
      void supabase
        .from("launch_checklists")
        .update({
          completed: toggledItem.completed,
          completed_at: toggledItem.completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("asset_launch_id", launchId)
        .eq("item_key", id);
    }
    
    // Show toast for completion
    const item = checklist.find(item => item.id === id);
    if (!item?.completed) {
      toast({
        title: "Task completed!",
        description: `You've completed: ${item?.text}`,
      });
    }
    
    // Check if a milestone is reached (3 items)
    const completedCount = updatedChecklist.filter(item => item.completed).length;
    if (completedCount === 3) {
      toast({
        title: "Milestone reached!",
        description: "You're more than halfway there!",
      });
      
      // Small confetti celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const triggerLaunchCelebration = () => {
    // Big confetti celebration
    confetti({
      particleCount: 200,
      spread: 160,
      origin: { y: 0.6 }
    });
    
    // Champagne toast notification
    toast({
      title: "🍾 Your creation is live!",
      description: "Here's to your success! The world can now experience your work.",
    });
  };

  const startCountdown = () => {
    // Check if all items are completed and venue is selected
    if (checklist.every(item => item.completed) && selectedVenue && launchId) {
      setCurrentStage('countdown');
      setCountdown(COUNTDOWN_TIME);
      
      // Good luck message
      toast({
        title: "Best of luck on your launch!",
        description: "We're excited to see your creation shine in the world.",
      });
    } else {
      toast({
        title: "Not quite ready",
        description: "Please complete all checklist items and select a venue.",
        variant: "destructive"
      });
    }
  };

  const allTasksCompleted = checklist.every(item => item.completed);
  const launchReadiness = (checklist.filter(item => item.completed).length / checklist.length) * 100;

  if (loadingLaunch) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-studio-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {currentStage === 'preparation' && (
          <motion.div 
            key="preparation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2 mb-8">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl font-bold text-studio-charcoal">Prepare for Your Launch</h1>
                <p className="text-studio-clay">Get ready to share your creation with the world</p>
              </motion.div>
            </div>

            <motion.div 
              className="glass-card p-6 space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListChecks className="text-studio-accent" />
                  <h2 className="text-lg font-medium">Launch Checklist</h2>
                </div>
                <div className="text-sm text-studio-clay">
                  {checklist.filter(item => item.completed).length}/{checklist.length} completed
                </div>
              </div>
              
              <Progress value={launchReadiness} className="h-2 bg-studio-sand" />
              
              <div className="space-y-3 pt-2">
                {checklist.map((item) => (
                  <motion.div 
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-studio-sand/10 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleCheckItem(item.id)}
                      className={`rounded-full flex items-center justify-center w-6 h-6 
                        ${item.completed ? 'bg-studio-accent text-white' : 'border-2 border-studio-clay/50'}`}
                    >
                      {item.completed && <CheckCircle2 size={16} />}
                    </motion.button>
                    <span className={item.completed ? 'line-through text-studio-clay' : ''}>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="glass-card p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Store className="text-studio-accent" />
                <h2 className="text-lg font-medium">Choose Your Venue</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {venues.map((venue) => (
                  <motion.div
                    key={venue.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${selectedVenue === venue.id 
                        ? 'border-studio-accent bg-studio-highlight/20' 
                        : 'border-studio-sand/50 hover:border-studio-sand'}`}
                    whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedVenue(venue.id);
                        if (launchId) {
                          void supabase
                            .from("asset_launches")
                            .update({
                              venue: venue.id,
                              updated_at: new Date().toISOString(),
                            })
                            .eq("id", launchId);
                        }
                        toast({
                          title: "Venue selected",
                          description: `You've chosen: ${venue.name}`,
                      });
                    }}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-studio-accent/20 flex items-center justify-center">
                        <venue.icon className="text-studio-accent" />
                      </div>
                      <h3 className="font-medium">{venue.name}</h3>
                      <p className="text-xs text-studio-clay">{venue.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="flex justify-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={startCountdown}
                disabled={!allTasksCompleted || !selectedVenue}
                className="bg-studio-accent hover:bg-studio-accent/90 text-white px-8 py-6"
                size="lg"
              >
                <Rocket className="mr-2" /> Begin Launch Sequence
              </Button>
            </motion.div>
          </motion.div>
        )}

        {currentStage === 'countdown' && (
          <motion.div 
            key="countdown"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="h-[400px] flex flex-col items-center justify-center"
          >
            <motion.div 
              className="text-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock size={80} className="text-studio-accent mx-auto mb-6" />
              <h2 className="text-xl font-medium mb-2">Preparing For Launch</h2>
              <p className="text-studio-clay mb-8">Your creation is being prepared for the world</p>
              
              <motion.div 
                className="text-7xl font-bold text-studio-accent"
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                {countdown}
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {currentStage === 'launched' && (
          <motion.div 
            key="launched"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[400px] flex flex-col items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: [0.8, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 0.8 }}
            >
              <Rocket size={100} className="text-studio-accent mx-auto mb-6" />
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Liftoff!
            </motion.h2>
            
            <motion.p 
              className="text-studio-clay"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your creation is now live on the marketplace
            </motion.p>
          </motion.div>
        )}

        {currentStage === 'celebration' && (
          <motion.div 
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2 mb-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <h1 className="text-3xl font-bold text-studio-charcoal">
                  <span className="inline-block">It's Live!</span> 
                  <motion.span 
                    className="inline-block ml-2"
                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 5, duration: 1 }}
                  >
                    🎉
                  </motion.span>
                </h1>
                <p className="text-studio-clay">Let's celebrate your successful launch</p>
              </motion.div>
            </div>
            
            <motion.div
              className="glass-card p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <PartyPopper className="text-studio-accent" />
                <h2 className="text-lg font-medium">Launch Celebration</h2>
              </div>
              
              <div className="flex items-center justify-center py-4">
                <motion.button
                  className="bg-studio-highlight/20 p-6 rounded-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    confetti({
                      particleCount: 100,
                      spread: 70,
                      origin: { y: 0.6 }
                    });
                    
                    toast({
                      title: "Virtual Toast! 🥂",
                      description: "Here's to your creative success!",
                    });
                  }}
                >
                  <Wine size={48} className="text-studio-accent" />
                </motion.button>
              </div>
              
              <div className="text-center">
                <p>Click the glass for a celebratory toast!</p>
              </div>
            </motion.div>
            
            <motion.div
              className="glass-card p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Eye className="text-studio-accent" />
                <h2 className="text-lg font-medium">Initial Reception</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  className="text-center p-4 rounded-xl bg-studio-sand/20"
                  whileHover={{ y: -5 }}
                >
                  <Eye className="h-6 w-6 mx-auto mb-2 text-studio-charcoal/70" />
                  <div className="text-2xl font-bold">{engagementStats.views}</div>
                  <div className="text-xs text-studio-clay">Views</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-4 rounded-xl bg-studio-sand/20"
                  whileHover={{ y: -5 }}
                >
                  <Heart className="h-6 w-6 mx-auto mb-2 text-studio-charcoal/70" />
                  <div className="text-2xl font-bold">{engagementStats.likes}</div>
                  <div className="text-xs text-studio-clay">Appreciations</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-4 rounded-xl bg-studio-sand/20"
                  whileHover={{ y: -5 }}
                >
                  <MessageSquare className="h-6 w-6 mx-auto mb-2 text-studio-charcoal/70" />
                  <div className="text-2xl font-bold">{engagementStats.comments}</div>
                  <div className="text-xs text-studio-clay">Conversations</div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              className="flex justify-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                onClick={() => {
                  setCurrentStage('preparation');
                  setCountdown(COUNTDOWN_TIME);
                  setEngagementStats({ views: 0, likes: 0, comments: 0 });
                }}
                className="bg-studio-accent hover:bg-studio-accent/90 text-white"
              >
                Start New Launch
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketplaceLaunch;
