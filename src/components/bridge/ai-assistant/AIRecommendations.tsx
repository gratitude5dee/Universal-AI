import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, DollarSign, Target, Zap, BarChart3, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";

export const AIRecommendations = () => {
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const recommendations = [
    {
      id: "minting-strategy",
      title: "Optimal Minting Strategy",
      icon: Target,
      priority: "high",
      impact: "High Revenue Impact",
      findings: [
        "Editions sell 3x faster than 1-of-1s in your portfolio",
        "Optimal price point: $0.05 - $0.15 ETH based on historical data",
        "Best posting time: Tuesdays, 2-4 PM PST (45% higher engagement)",
        "Zora collectors convert 45% higher than OpenSea for your style"
      ],
      recommendation: {
        action: "Mint 100 editions on Zora (Base)",
        price: "0.01 ETH (~$16.40)",
        timing: "Next Tuesday at 2:00 PM PST",
        expectedRevenue: "$1,230 - $1,640",
        confidence: 87
      }
    },
    {
      id: "cost-optimization",
      title: "Cost Optimization Alert",
      icon: DollarSign,
      priority: "medium",
      impact: "80% Cost Reduction",
      findings: [
        "Current spending: $85/month on Ethereum gas fees",
        "Potential savings: $68/month (80% reduction)",
        "Alternative chains available with similar collector base",
        "No impact on sale velocity based on market analysis"
      ],
      recommendation: {
        action: "Switch to Zora on Base for primary drops",
        savings: "$68/month",
        alternativeChains: ["Base", "Solana"],
        confidence: 92
      }
    },
    {
      id: "audience-growth",
      title: "Audience Growth Opportunity",
      icon: Users,
      priority: "high",
      impact: "3x Collector Reach",
      findings: [
        "Your current collectors are 67% on Ethereum",
        "Untapped audience on Solana (23% market share)",
        "Farcaster community shows high engagement with your content type",
        "Cross-platform collectors spend 2.4x more on average"
      ],
      recommendation: {
        action: "Launch simultaneous drops on 3 platforms",
        platforms: ["OpenSea (Ethereum)", "Magic Eden (Solana)", "Zora (Base)"],
        expectedGrowth: "180% increase in unique collectors",
        confidence: 79
      }
    },
    {
      id: "pricing-optimization",
      title: "Dynamic Pricing Strategy",
      icon: TrendingUp,
      priority: "medium",
      impact: "Medium Revenue Impact",
      findings: [
        "Your 1-of-1s are underpriced by ~40% compared to similar creators",
        "Edition collectors willing to pay 15-20% more for limited supplies",
        "Secondary market shows 2.3x markup on your work",
        "Floor price increased 45% in last 30 days"
      ],
      recommendation: {
        action: "Increase 1-of-1 pricing to 2.5 ETH",
        currentPrice: "1.5 ETH",
        recommendedPrice: "2.5 ETH",
        reasoning: "Market data supports higher valuation",
        confidence: 84
      }
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30";
      case "medium": return "bg-[#F97316]/20 text-[#F97316] border-[#F97316]/30";
      case "low": return "bg-[#0EA5E9]/20 text-[#0EA5E9] border-[#0EA5E9]/30";
      default: return "bg-white/20 text-white border-white/30";
    }
  };

  return (
    <div className="space-y-4">
      {recommendations.map((rec, idx) => {
        const Icon = rec.icon;
        const isExpanded = showDetails === rec.id;
        
        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="backdrop-blur-md bg-gradient-to-br from-[#9b87f5]/10 to-[#7E69AB]/5 border border-[#9b87f5]/30 p-6 shadow-card-glow hover:shadow-glow transition-all">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-[#9b87f5]/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#9b87f5]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white text-shadow-sm">{rec.title}</h3>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#9b87f5] font-medium">{rec.impact}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(isExpanded ? null : rec.id)}
                    className="text-white hover:bg-white/10"
                  >
                    {isExpanded ? "Hide Details" : "View Details"}
                  </Button>
                </div>

                {/* Quick Summary */}
                {!isExpanded && (
                  <div className="pl-16">
                    <p className="text-white/80 text-shadow-sm text-sm">
                      {rec.recommendation.action}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Sparkles className="w-4 h-4 text-[#9b87f5]" />
                      <span className="text-xs text-white/60">
                        {rec.recommendation.confidence}% confidence based on your data
                      </span>
                    </div>
                  </div>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pl-16"
                  >
                    {/* Findings */}
                    <div>
                      <h4 className="font-semibold text-white text-shadow-sm mb-2 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[#9b87f5]" />
                        Analysis Findings
                      </h4>
                      <ul className="space-y-1">
                        {rec.findings.map((finding, i) => (
                          <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                            <span className="text-[#9b87f5] mt-1">•</span>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendation Details */}
                    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-4">
                      <h4 className="font-semibold text-white text-shadow-sm mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#F97316]" />
                        Recommended Action
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Action:</span>
                          <span className="text-white font-medium">{rec.recommendation.action}</span>
                        </div>
                        {rec.recommendation.price && (
                          <div className="flex justify-between">
                            <span className="text-white/70">Price:</span>
                            <span className="text-white font-medium">{rec.recommendation.price}</span>
                          </div>
                        )}
                        {rec.recommendation.expectedRevenue && (
                          <div className="flex justify-between">
                            <span className="text-white/70">Expected Revenue:</span>
                            <span className="text-[#10B981] font-medium">{rec.recommendation.expectedRevenue}</span>
                          </div>
                        )}
                        {rec.recommendation.savings && (
                          <div className="flex justify-between">
                            <span className="text-white/70">Monthly Savings:</span>
                            <span className="text-[#10B981] font-medium">{rec.recommendation.savings}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-white/10">
                          <span className="text-white/70">Confidence:</span>
                          <span className="text-white font-medium">{rec.recommendation.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
                        Apply Recommendation
                      </Button>
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Customize
                      </Button>
                      <Button variant="ghost" className="text-white/70 hover:bg-white/10">
                        Ignore
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
