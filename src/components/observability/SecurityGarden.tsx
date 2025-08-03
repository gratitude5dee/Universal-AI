
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, HelpCircle, Lock, ExternalLink } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type SecurityThreatLevel = "low" | "medium" | "high";
type SecurityItemStatus = "secure" | "warning" | "critical" | "unknown";

interface SecurityItemProps {
  name: string;
  description: string;
  status: SecurityItemStatus;
  lastUpdated: string;
  actionRequired?: string;
}

interface SecuritySectionProps {
  title: string;
  description: string;
  items: SecurityItemProps[];
}

export const SecurityGarden = () => {
  const [securityScore, setSecurityScore] = useState(78);
  const [threatLevel, setThreatLevel] = useState<SecurityThreatLevel>("low");
  
  const runSecurityScan = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setSecurityScore(prev => Math.min(prev + Math.floor(Math.random() * 10), 100));
          setThreatLevel("low");
          resolve(true);
        }, 2000);
      }),
      {
        loading: "Running security scan...",
        success: "Security scan completed successfully!",
        error: "Security scan failed. Please try again."
      }
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };
  
  const getScoreText = (score: number) => {
    if (score >= 80) return "Strong";
    if (score >= 60) return "Moderate";
    return "Needs attention";
  };

  const securitySections: SecuritySectionProps[] = [
    {
      title: "Access Control",
      description: "Who can access your creative garden",
      items: [
        {
          name: "Authentication",
          description: "Two-factor authentication is enabled",
          status: "secure",
          lastUpdated: "2 days ago"
        },
        {
          name: "Agent Permissions",
          description: "AI agents have appropriate access limits",
          status: "warning",
          lastUpdated: "5 days ago",
          actionRequired: "Review permission boundaries"
        }
      ]
    },
    {
      title: "Data Protection",
      description: "How your creative works are protected",
      items: [
        {
          name: "Encryption",
          description: "End-to-end encryption for all creative assets",
          status: "secure",
          lastUpdated: "1 day ago"
        },
        {
          name: "Asset Storage",
          description: "Regular security audits of storage systems",
          status: "secure",
          lastUpdated: "3 days ago"
        }
      ]
    },
    {
      title: "Smart Contract Security",
      description: "Protection for your blockchain interactions",
      items: [
        {
          name: "Contract Audits",
          description: "Smart contracts reviewed by security experts",
          status: "warning",
          lastUpdated: "14 days ago",
          actionRequired: "Schedule new audit"
        },
        {
          name: "Transaction Monitoring",
          description: "Unusual transaction patterns are flagged",
          status: "secure",
          lastUpdated: "Today"
        }
      ]
    }
  ];
  
  const getStatusIcon = (status: SecurityItemStatus) => {
    switch (status) {
      case "secure":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Security Score Overview */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl font-bold text-center">
                  <span className={getScoreColor(securityScore)}>{securityScore}</span>
                </div>
              </div>
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  stroke="#eee"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  stroke={securityScore >= 80 ? "#10b981" : securityScore >= 60 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="2"
                  strokeDasharray={`${securityScore}, 100`}
                  fill="none"
                />
              </svg>
            </div>
            <div className="mt-2 text-center">
              <h3 className="font-medium">Security Score</h3>
              <p className={`text-sm ${getScoreColor(securityScore)}`}>{getScoreText(securityScore)}</p>
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-medium mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-studio-accent" />
              Security Garden
            </h2>
            <p className="text-muted-foreground mb-5">
              Your creative security status is visualized as a garden. Healthy, secure systems appear as flourishing plants,
              while potential issues appear as areas needing attention.
            </p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Threat Level</span>
                  <span className={
                    threatLevel === "low" ? "text-green-600" : 
                    threatLevel === "medium" ? "text-amber-500" : 
                    "text-red-500"
                  }>
                    {threatLevel.charAt(0).toUpperCase() + threatLevel.slice(1)}
                  </span>
                </div>
                <Progress 
                  value={threatLevel === "low" ? 25 : threatLevel === "medium" ? 60 : 90} 
                  indicatorClassName={
                    threatLevel === "low" ? "bg-green-500" : 
                    threatLevel === "medium" ? "bg-amber-500" : 
                    "bg-red-500"
                  }
                />
              </div>
              <Button onClick={runSecurityScan}>
                <Shield className="mr-2 h-4 w-4" />
                Run Security Scan
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Security Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securitySections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-medium mb-1">{section.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
            
            <div className="space-y-4">
              {section.items.map((item) => (
                <div key={item.name} className="glass-card border border-white/10 backdrop-blur-md rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <h4 className="font-medium">{item.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      {item.actionRequired && (
                        <p className="text-sm text-amber-600 mt-1">{item.actionRequired}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Last updated: {item.lastUpdated}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-white/10 backdrop-blur-md">
              <Button variant="ghost" size="sm" className="text-sm w-full">
                View All <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Educational Section */}
      <div className="glass-card-dark p-6 bg-gradient-to-br from-studio-accent/20 to-studio-charcoal/90">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-full">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-medium text-white">Security Wisdom</h3>
        </div>
        <p className="text-white/80 text-sm">
          Security is like tending to a garden. Regular care and attention keeps your creative ecosystem thriving 
          and protected. Schedule regular security scans and review access permissions monthly to maintain
          a flourishing digital garden.
        </p>
        <Button variant="outline" className="mt-4 bg-white/10 text-white border-white/20 hover:bg-white/20">
          Learn Security Basics
        </Button>
      </div>
    </div>
  );
};
