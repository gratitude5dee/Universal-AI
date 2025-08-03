import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Map, ArrowRight, Send, FileCheck, Users, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Journey {
  id: string;
  title: string;
  from: string;
  to: string;
  amount: number;
  token: string;
  status: "preparing" | "in-transit" | "completed";
  date: string;
  eta?: string;
  steps: number;
  currentStep: number;
}

const journeys: Journey[] = [
  {
    id: "j1",
    title: "Castle Funding",
    from: "Main Treasury",
    to: "Builder's Guild",
    amount: 5000,
    token: "ETH",
    status: "in-transit",
    date: "June 2, 2023",
    eta: "June 5, 2023",
    steps: 5,
    currentStep: 3,
  },
  {
    id: "j2",
    title: "Monthly Provisions",
    from: "Trading Post",
    to: "Supply Vault",
    amount: 2500,
    token: "SOL",
    status: "completed",
    date: "May 28, 2023",
    steps: 4,
    currentStep: 4,
  },
  {
    id: "j3",
    title: "Spell Research",
    from: "Knowledge Repository",
    to: "Arcane Laboratory",
    amount: 1800,
    token: "AVAX",
    status: "preparing",
    date: "June 7, 2023",
    eta: "June 10, 2023",
    steps: 6,
    currentStep: 0,
  },
];

const statusColors = {
  "preparing": "bg-yellow-100 text-yellow-800",
  "in-transit": "bg-blue-100 text-blue-800",
  "completed": "bg-green-100 text-green-800",
};

const statusIcons = {
  "preparing": Clock,
  "in-transit": Send,
  "completed": FileCheck,
};

const TreasureJourney = () => {
  const [showJourneyDetails, setShowJourneyDetails] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [journeyProgress, setJourneyProgress] = useState<Journey[]>(journeys);

  useEffect(() => {
    const interval = setInterval(() => {
      setJourneyProgress(current => 
        current.map(journey => {
          if (journey.status === "in-transit" && journey.currentStep < journey.steps) {
            const newStep = journey.currentStep + 1;
            const newStatus = newStep >= journey.steps ? "completed" : "in-transit";
            
            if (newStatus === "completed" && journey.status === "in-transit") {
              toast("Journey Completed!", {
                description: `${journey.title} has arrived at ${journey.to}`,
                icon: <Star className="h-5 w-5 text-yellow-400" />,
              });
              
              const audio = new Audio("/journey-complete.mp3");
              audio.volume = 0.3;
              audio.play().catch(() => {
                console.log("Audio playback failed");
              });
            }
            
            return {
              ...journey,
              currentStep: newStep,
              status: newStatus
            };
          }
          return journey;
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleJourneyClick = (journey: Journey) => {
    setSelectedJourney(journey);
    setShowJourneyDetails(true);
  };

  const createNewJourney = () => {
    toast("New Journey Started!", {
      description: "Your treasures are embarking on a magical adventure.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Map className="w-5 h-5 mr-2 text-studio-accent" />
            Token Journeys
          </h2>
          <Button onClick={createNewJourney} size="sm">Start New Journey</Button>
        </div>

        <div className="space-y-4">
          {journeyProgress.map((journey) => {
            const StatusIcon = statusIcons[journey.status];
            return (
              <motion.div
                key={journey.id}
                className="glass-card rounded-xl p-4 cursor-pointer hover:shadow-md transition-all border border-white/10 backdrop-blur-md"
                whileHover={{ x: 5 }}
                onClick={() => handleJourneyClick(journey)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-studio-highlight p-2 rounded-lg mr-3">
                      <StatusIcon className="w-5 h-5 text-studio-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium">{journey.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{journey.from}</span>
                        <ArrowRight className="w-3 h-3 mx-1" />
                        <span>{journey.to}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{journey.amount} {journey.token}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[journey.status]}`}>
                      {journey.status === "preparing" ? "Preparing" : 
                       journey.status === "in-transit" ? "In Transit" : "Completed"}
                    </span>
                  </div>
                </div>
                
                {journey.status === "in-transit" && (
                  <div className="mt-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-studio-accent"
                        initial={{ width: `${(journey.currentStep / journey.steps) * 100}%` }}
                        animate={{ width: `${(journey.currentStep / journey.steps) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>{journey.from}</span>
                      <span>{journey.currentStep} of {journey.steps} waypoints</span>
                      <span>{journey.to}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="glass-card p-6">
        {selectedJourney ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Journey Details</h2>
              <div className={`px-2 py-1 rounded-full text-xs ${statusColors[selectedJourney.status]}`}>
                {selectedJourney.status === "preparing" ? "Preparing" : 
                 selectedJourney.status === "in-transit" ? "In Transit" : "Completed"}
              </div>
            </div>
            
            <div className="bg-studio-sand/10 rounded-xl p-4 mb-4">
              <h3 className="text-lg font-bold mb-1">{selectedJourney.title}</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="font-medium">{selectedJourney.from}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">To</p>
                  <p className="font-medium">{selectedJourney.to}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-medium">{selectedJourney.amount} {selectedJourney.token}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedJourney.date}</p>
                </div>
                {selectedJourney.eta && (
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated Arrival</p>
                    <p className="font-medium">{selectedJourney.eta}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-4 mb-4 border border-white/10 backdrop-blur-md">
              <h4 className="text-sm font-medium mb-3">Journey Path</h4>
              <div className="relative py-2">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {[...Array(selectedJourney.steps)].map((_, index) => {
                  const isCompleted = index < selectedJourney.currentStep;
                  const isCurrent = index === selectedJourney.currentStep - 1;
                  
                  return (
                    <div key={index} className="flex items-center mb-4 relative">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          isCompleted 
                            ? 'bg-green-100 text-green-600' 
                            : isCurrent 
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <FileCheck className="w-4 h-4" />
                        ) : (
                          <span className="text-xs">{index + 1}</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <p className={`text-sm ${isCompleted ? 'font-medium' : 'text-muted-foreground'}`}>
                          {index === 0 
                            ? `Departed from ${selectedJourney.from}`
                            : index === selectedJourney.steps - 1
                              ? `Arrived at ${selectedJourney.to}`
                              : `Waypoint ${index}`}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-blue-600">Currently here</p>
                        )}
                      </div>
                      
                      {isCompleted && (
                        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 z-0">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.5, 1] }}
                            transition={{ duration: 0.5 }}
                            className="w-10 h-10 bg-green-100 rounded-full opacity-30"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-auto">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setSelectedJourney(null)}
                >
                  Back to Journeys
                </Button>
                {selectedJourney.status === "preparing" && (
                  <Button className="w-full">Start Journey</Button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <Map className="h-12 w-12 text-studio-sand mb-4" />
            <h3 className="text-xl font-medium mb-2">Select a Journey</h3>
            <p className="text-muted-foreground text-sm">
              Click on any journey to view its magical path and progress
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreasureJourney;
