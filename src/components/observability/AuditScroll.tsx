
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  UserCheck, 
  FileCheck, 
  Shield, 
  Download, 
  Calendar,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type LogType = "access" | "activity" | "security" | "agent" | "all";
type LogSeverity = "info" | "warning" | "critical";

interface LogEntry {
  id: string;
  timestamp: string;
  type: LogType;
  severity: LogSeverity;
  message: string;
  user?: string;
  details?: string;
  expanded?: boolean;
}

export const AuditScroll = () => {
  const [selectedType, setSelectedType] = useState<LogType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: "Today, 10:15 AM",
      type: "access",
      severity: "info",
      message: "User login successful",
      user: "creative_director@example.com",
      details: "Login from recognized device and location (New York, US). IP: 198.51.100.42"
    },
    {
      id: "2",
      timestamp: "Today, 09:32 AM",
      type: "activity",
      severity: "info",
      message: "Asset modified",
      user: "designer@example.com",
      details: "Asset 'Spring Campaign Hero' was edited and saved to the asset library."
    },
    {
      id: "3",
      timestamp: "Today, 08:45 AM",
      type: "security",
      severity: "warning",
      message: "Multiple failed login attempts",
      details: "5 failed login attempts for account 'marketing@example.com'. Account temporarily locked for security."
    },
    {
      id: "4",
      timestamp: "Yesterday, 4:20 PM",
      type: "agent",
      severity: "info",
      message: "AI agent created new content",
      details: "Storyteller agent generated 3 new social media post variations based on campaign brief #2023-05."
    },
    {
      id: "5",
      timestamp: "Yesterday, 3:15 PM",
      type: "security",
      severity: "critical",
      message: "Permission changes detected",
      user: "admin@example.com",
      details: "Admin elevated permissions for user 'developer@example.com' to include contract deployment access."
    },
    {
      id: "6",
      timestamp: "Yesterday, 11:30 AM",
      type: "access",
      severity: "warning",
      message: "Unusual access pattern detected",
      user: "writer@example.com",
      details: "Account accessed from new location (Singapore). User was notified via email for verification."
    },
    {
      id: "7",
      timestamp: "Apr 15, 2023",
      type: "agent",
      severity: "info",
      message: "Agent connected to external API",
      details: "DataWeaver agent established connection to approved data source (Weather API) for creative project 'Seasonal Inspirations'."
    }
  ]);
  
  const downloadAuditLog = () => {
    toast.success("Audit log downloaded", {
      description: "The complete audit history has been saved to your downloads folder"
    });
  };
  
  const toggleExpand = (id: string) => {
    setLogs(prev => 
      prev.map(log => 
        log.id === id ? { ...log, expanded: !log.expanded } : log
      )
    );
  };
  
  const filteredLogs = logs.filter(log => 
    (selectedType === "all" || log.type === selectedType) &&
    (searchQuery === "" || 
     log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
     (log.user && log.user.toLowerCase().includes(searchQuery.toLowerCase())))
  );
  
  const getTypeIcon = (type: LogType) => {
    switch (type) {
      case "access":
        return <UserCheck className="h-4 w-4" />;
      case "activity":
        return <FileCheck className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      case "agent":
        return <svg 
          className="h-4 w-4" 
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM18.81 17.65C17.86 16.91 16.8 16.36 15.66 16.04C15.1 16.59 14.46 17 13.7 17H10.3C9.54 17 8.9 16.59 8.34 16.04C7.2 16.36 6.14 16.91 5.19 17.65C6.83 19.7 9.26 21 12 21C14.74 21 17.17 19.7 18.81 17.65Z" 
            fill="currentColor"
          />
        </svg>;
      default:
        return <ClipboardList className="h-4 w-4" />;
    }
  };
  
  const getSeverityColor = (severity: LogSeverity) => {
    switch (severity) {
      case "info":
        return "bg-blue-100 text-blue-700";
      case "warning":
        return "bg-amber-100 text-amber-700";
      case "critical":
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div>
            <h2 className="text-xl font-medium mb-2 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-studio-accent" />
              Audit Scrolls
            </h2>
            <p className="text-muted-foreground">
              The history of interactions with your creative garden, presented as magical scrolls.
              Each entry captures a moment in your garden's story.
            </p>
          </div>
          
          <Button onClick={downloadAuditLog}>
            <Download className="mr-2 h-4 w-4" />
            Download Full History
          </Button>
        </div>
        
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search audit logs..."
              className="w-full pl-10 pr-4 py-2 border border-studio-sand/50 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-studio-accent/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={selectedType === "all" ? "default" : "outline"} 
              onClick={() => setSelectedType("all")}
              size="sm"
              className="text-xs"
            >
              All
            </Button>
            <Button 
              variant={selectedType === "access" ? "default" : "outline"} 
              onClick={() => setSelectedType("access")}
              size="sm"
              className="text-xs"
            >
              <UserCheck className="mr-1 h-3 w-3" />
              Access
            </Button>
            <Button 
              variant={selectedType === "security" ? "default" : "outline"} 
              onClick={() => setSelectedType("security")}
              size="sm"
              className="text-xs"
            >
              <Shield className="mr-1 h-3 w-3" />
              Security
            </Button>
            <Button 
              variant={selectedType === "agent" ? "default" : "outline"} 
              onClick={() => setSelectedType("agent")}
              size="sm"
              className="text-xs"
            >
              Agent
            </Button>
          </div>
        </div>
        
        {/* Logs */}
        <div className="divide-y divide-studio-sand/30">
          {filteredLogs.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No audit logs matching your search criteria</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-3"
              >
                <div 
                  className="flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer"
                  onClick={() => toggleExpand(log.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-lg mt-0.5 ${
                      log.type === "access" ? "bg-indigo-100" :
                      log.type === "activity" ? "bg-green-100" :
                      log.type === "security" ? "bg-amber-100" :
                      "bg-purple-100"
                    }`}>
                      {getTypeIcon(log.type)}
                    </div>
                    <div>
                      <p className="font-medium">{log.message}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {log.timestamp}
                        </span>
                        {log.user && (
                          <span>{log.user}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                    {log.expanded ? 
                      <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    }
                  </div>
                </div>
                
                {log.expanded && log.details && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 ml-8 p-3 bg-studio-sand/10 rounded-lg text-sm"
                  >
                    {log.details}
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
        
        {filteredLogs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 backdrop-blur-md flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              Showing {filteredLogs.length} of {logs.length} logs
            </span>
            <Button variant="ghost" size="sm">
              Load More
            </Button>
          </div>
        )}
      </div>
      
      {/* Compliance Status */}
      <div className="glass-card p-6 bg-gradient-to-br from-studio-cream to-studio-sand/20">
        <h3 className="text-lg font-medium mb-3">Compliance Garden</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Your creative garden complies with industry standards and regulations.
          Regular audits ensure your garden remains in harmony with:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 glass-card rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-100 p-1.5 rounded-full">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="font-medium">Data Privacy</h4>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-100 h-2 rounded-full">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <span className="text-xs font-medium">100%</span>
            </div>
          </div>
          
          <div className="p-4 glass-card rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-100 p-1.5 rounded-full">
                <UserCheck className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="font-medium">Access Control</h4>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-100 h-2 rounded-full">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <span className="text-xs font-medium">92%</span>
            </div>
          </div>
          
          <div className="p-4 glass-card rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-amber-100 p-1.5 rounded-full">
                <svg className="h-4 w-4 text-amber-600" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L2 7V11.5C2 17.5 6.8 23 12 23C17.2 23 22 17.5 22 11.5V7L12 2ZM15.5 16.5L14.1 17.9L9 12.8L10.4 11.4L15.5 16.5ZM13.5 7.5L14.9 8.9L11.8 12L10.4 10.6L13.5 7.5Z" 
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h4 className="font-medium">AI Safeguards</h4>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-100 h-2 rounded-full">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-xs font-medium">85%</span>
            </div>
          </div>
          
          <div className="p-4 glass-card rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-100 p-1.5 rounded-full">
                <FileCheck className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="font-medium">Documentation</h4>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-100 h-2 rounded-full">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '97%' }}></div>
              </div>
              <span className="text-xs font-medium">97%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
