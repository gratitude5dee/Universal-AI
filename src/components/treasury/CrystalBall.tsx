
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Gem, TrendingUp, TrendingDown, AlertCircle, ArrowRight, Calendar, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Forecast {
  id: string;
  name: string;
  token: string;
  currentValue: number;
  predictedValue: number;
  change: number;
  likelihood: number;
  description: string;
  timeline: string;
  data: Array<{ name: string; value: number }>;
  color: string;
}

const forecasts: Forecast[] = [
  {
    id: "eth-bull",
    name: "Ethereal Gold Prosperity",
    token: "ETH",
    currentValue: 3245.67,
    predictedValue: 5500.89,
    change: 69.5,
    likelihood: 72,
    description: "The mystical forces suggest a strong upward trajectory for Ethereal Gold as adoption increases across the realms.",
    timeline: "3-6 months",
    data: [
      { name: "Now", value: 3245 },
      { name: "1m", value: 3400 },
      { name: "2m", value: 3600 },
      { name: "3m", value: 4100 },
      { name: "4m", value: 4800 },
      { name: "5m", value: 5200 },
      { name: "6m", value: 5500 },
    ],
    color: "#FDA92D",
  },
  {
    id: "sol-rise",
    name: "Solar Crystal Illumination",
    token: "SOL",
    currentValue: 142.35,
    predictedValue: 210.75,
    change: 48.1,
    likelihood: 65,
    description: "The solar alignments indicate increased power flowing to the Solar Crystals, bringing illumination and growth.",
    timeline: "2-4 months",
    data: [
      { name: "Now", value: 142 },
      { name: "0.5m", value: 150 },
      { name: "1m", value: 162 },
      { name: "1.5m", value: 175 },
      { name: "2m", value: 185 },
      { name: "3m", value: 200 },
      { name: "4m", value: 210 },
    ],
    color: "#14F195",
  },
  {
    id: "avax-caution",
    name: "Avalanche Ruby Instability",
    token: "AVAX",
    currentValue: 35.75,
    predictedValue: 24.82,
    change: -30.6,
    likelihood: 58,
    description: "The crystal shows potential turbulence ahead for Avalanche Rubies, suggesting caution until the magical storms pass.",
    timeline: "1-2 months",
    data: [
      { name: "Now", value: 35 },
      { name: "0.25m", value: 33 },
      { name: "0.5m", value: 31 },
      { name: "0.75m", value: 29 },
      { name: "1m", value: 27 },
      { name: "1.5m", value: 25 },
      { name: "2m", value: 24 },
    ],
    color: "#E84142",
  },
];

const CrystalBall = () => {
  const [selectedForecast, setSelectedForecast] = useState<Forecast | null>(null);
  const [isScrying, setIsScrying] = useState(false);

  const handleForecastClick = (forecast: Forecast) => {
    setSelectedForecast(forecast);
  };

  const performScrying = () => {
    setIsScrying(true);
    
    // Play magical sound
    const audio = new Audio("/crystal-ball.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {
      console.log("Audio playback failed");
    });
    
    // Simulate scrying into the crystal ball
    setTimeout(() => {
      setIsScrying(false);
      toast("Vision Revealed!", {
        description: "The crystal ball has shown you a glimpse of possible futures.",
        icon: <Eye className="h-5 w-5 text-purple-500" />,
      });
    }, 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Forecasts List */}
      <div className="lg:col-span-2 glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Gem className="w-5 h-5 mr-2 text-studio-accent" />
            Magical Prophecies
          </h2>
          <Button size="sm" onClick={performScrying} disabled={isScrying}>
            {isScrying ? "Scrying..." : "Peer Into the Future"}
          </Button>
        </div>

        <div className="space-y-4">
          {forecasts.map((forecast) => {
            const isPositive = forecast.change >= 0;
            const TrendIcon = isPositive ? TrendingUp : TrendingDown;
            
            return (
              <motion.div
                key={forecast.id}
                className={`glass-card rounded-xl p-4 cursor-pointer hover:shadow-md transition-all border border-white/10 backdrop-blur-md ${
                  selectedForecast?.id === forecast.id ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{ 
                  ...(selectedForecast?.id === forecast.id ? { 
                    boxShadow: `0 0 0 2px ${forecast.color}`
                  } : {})
                }}
                whileHover={{ y: -3 }}
                onClick={() => handleForecastClick(forecast)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3 mt-1"
                      style={{ backgroundColor: `${forecast.color}20` }}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-5 h-5" style={{ color: forecast.color }} />
                      ) : (
                        <TrendingDown className="w-5 h-5" style={{ color: forecast.color }} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{forecast.name}</h3>
                      <div className="flex items-center text-sm">
                        <span className="text-muted-foreground">{forecast.token} •</span>
                        <span className="ml-1 text-muted-foreground">{forecast.timeline}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{forecast.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{forecast.change}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {forecast.likelihood}% likelihood
                    </div>
                  </div>
                </div>
                
                {/* Mini chart */}
                <div className="h-16 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={forecast.data}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id={`gradientArea-${forecast.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={forecast.color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={forecast.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={forecast.color}
                        fillOpacity={1}
                        fill={`url(#gradientArea-${forecast.id})`}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Forecast Details */}
      <div className="glass-card p-6 relative overflow-hidden">
        {selectedForecast ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Crystal Visions</h2>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${selectedForecast.color}20` }}
              >
                <Gem className="w-5 h-5" style={{ color: selectedForecast.color }} />
              </div>
            </div>
            
            <div 
              className="rounded-xl p-4 mb-4"
              style={{ background: `linear-gradient(135deg, white 0%, ${selectedForecast.color}15 100%)` }}
            >
              <h3 className="text-2xl font-bold">{selectedForecast.name}</h3>
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="font-medium">{selectedForecast.token}</span>
                <ArrowRight className="w-3 h-3" />
                <span className="bg-studio-sand/20 px-2 py-0.5 rounded-full text-xs">
                  {selectedForecast.timeline}
                </span>
              </div>
              
              <div className="mt-3">
                <p className="text-muted-foreground text-sm">{selectedForecast.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Current Value</p>
                  <p className="font-bold">${selectedForecast.currentValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Predicted Value</p>
                  <p className="font-bold">${selectedForecast.predictedValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Potential Change</p>
                  <p className={`font-bold ${selectedForecast.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedForecast.change >= 0 ? '+' : ''}{selectedForecast.change}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vision Clarity</p>
                  <p className="font-bold">{selectedForecast.likelihood}%</p>
                </div>
              </div>
            </div>
            
            {/* Detailed chart */}
            <div className="glass-card rounded-xl p-4 mb-4 border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Magical Trajectory</h4>
                <div className="flex items-center text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{selectedForecast.timeline}</span>
                </div>
              </div>
              
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={selectedForecast.data}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="detailGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedForecast.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={selectedForecast.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={30}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border border-gray-100 shadow-md rounded-md text-xs">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm font-bold">${payload[0].value}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={selectedForecast.color}
                      fillOpacity={1}
                      fill="url(#detailGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Risk assessment */}
            {selectedForecast.change < 0 && (
              <div className="bg-red-50 rounded-xl p-3 mb-4 border border-red-100">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-red-700">Caution Advised</h4>
                    <p className="text-xs text-red-600">
                      The crystal visions show potential losses ahead. Consider protective enchantments for your treasury.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-auto">
              <Button className="w-full">
                Prepare for This Future
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="relative mb-6">
              <motion.div
                animate={{ 
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4
                }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-200 to-blue-200"
              />
              <Gem className="h-12 w-12 text-studio-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              <motion.div
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  delay: 1,
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-purple-100"
              />
            </div>
            <h3 className="text-xl font-medium mb-2">Select a Prophecy</h3>
            <p className="text-muted-foreground text-sm">
              Choose a magical forecast to peer deeper into the crystal ball
            </p>
          </div>
        )}
        
        {/* Decorative sparkles */}
        <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-30">
          <Sparkles className="h-6 w-6 text-purple-500" />
        </div>
      </div>
    </div>
  );
};

export default CrystalBall;
