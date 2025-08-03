
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, Clock, Calendar, CheckCircle, AlertTriangle, ArrowUpCircle, Sparkles, Download, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface BackupItemProps {
  id: string;
  name: string;
  type: "automatic" | "manual";
  date: string;
  size: string;
  status: "complete" | "in-progress" | "failed";
}

export const BackupSanctuary = () => {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backups, setBackups] = useState<BackupItemProps[]>([
    {
      id: "1",
      name: "Daily Creative Assets",
      type: "automatic",
      date: "Today, 03:15 AM",
      size: "2.4 GB",
      status: "complete"
    },
    {
      id: "2",
      name: "Weekly Full System",
      type: "automatic",
      date: "Sunday, 12:00 AM",
      size: "18.7 GB",
      status: "complete"
    },
    {
      id: "3",
      name: "Pre-Update Snapshot",
      type: "manual",
      date: "Apr 15, 2023",
      size: "15.3 GB",
      status: "complete"
    },
    {
      id: "4",
      name: "Project Milestones",
      type: "manual",
      date: "Apr 10, 2023",
      size: "4.8 GB",
      status: "complete"
    }
  ]);
  
  const createBackup = () => {
    setIsCreatingBackup(true);
    setBackupProgress(0);
    
    const timer = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsCreatingBackup(false);
          
          // Add new backup to the list
          const newBackup: BackupItemProps = {
            id: String(backups.length + 1),
            name: "Manual Backup",
            type: "manual",
            date: "Just now",
            size: "12.8 GB",
            status: "complete"
          };
          
          setBackups(prev => [newBackup, ...prev]);
          
          toast.success("Backup created successfully", {
            description: "Your creative assets are now safely stored"
          });
          
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  const restoreBackup = (backupId: string) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 3000);
      }),
      {
        loading: "Restoring your creative garden...",
        success: "Garden restored successfully!",
        error: "Restoration encountered an issue"
      }
    );
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0 w-32 h-32 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-dashed border-studio-accent/20"
              />
              <div className="w-20 h-20 bg-studio-accent/10 rounded-full flex items-center justify-center">
                <Save className="h-8 w-8 text-studio-accent" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-medium mb-2">Backup Sanctuary</h2>
            <p className="text-muted-foreground max-w-xl">
              Your creative work is precious. The Backup Sanctuary preserves snapshots of your digital garden,
              allowing you to return to previous flourishing states if needed.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
              <Button 
                onClick={createBackup} 
                disabled={isCreatingBackup}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <ArrowUpCircle className="mr-2 h-4 w-4" />
                Create New Backup
              </Button>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Backup Settings
              </Button>
            </div>
          </div>
        </div>
        
        {isCreatingBackup && (
          <div className="mt-6 p-4 bg-studio-accent/10 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-studio-accent animate-pulse" />
                <span className="font-medium">Creating backup...</span>
              </div>
              <span className="text-sm">{backupProgress}%</span>
            </div>
            <Progress value={backupProgress} />
            <p className="text-xs text-muted-foreground mt-2">
              Please don't close this window until the backup is complete.
            </p>
          </div>
        )}
      </div>
      
      {/* Backup History */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Backup History</h3>
          <Button variant="ghost" size="sm">
            View All <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {backups.map((backup) => (
            <motion.div 
              key={backup.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 glass-card border border-white/10 backdrop-blur-md rounded-lg hover:bg-studio-sand/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="bg-studio-accent/10 p-2 rounded-full">
                  {backup.type === "automatic" ? 
                    <Clock className="h-4 w-4 text-studio-accent" /> : 
                    <Save className="h-4 w-4 text-studio-accent" />
                  }
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{backup.name}</h4>
                    {getStatusIcon(backup.status)}
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                    <span>{backup.date}</span>
                    <span>{backup.size}</span>
                    <span className="capitalize">{backup.type}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3 sm:mt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => restoreBackup(backup.id)}
                  className="text-xs"
                >
                  <Download className="mr-1 h-3 w-3" />
                  Restore
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Recovery Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-studio-accent" />
            Backup Schedule
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-studio-sand/10 rounded-lg">
              <div>
                <h4 className="font-medium">Daily Backup</h4>
                <p className="text-sm text-muted-foreground">Creative assets only</p>
              </div>
              <div className="text-sm">3:00 AM</div>
            </div>
            <div className="flex justify-between items-center p-3 bg-studio-sand/10 rounded-lg">
              <div>
                <h4 className="font-medium">Weekly Backup</h4>
                <p className="text-sm text-muted-foreground">Full system</p>
              </div>
              <div className="text-sm">Sunday, 12:00 AM</div>
            </div>
            <div className="flex justify-between items-center p-3 bg-studio-sand/10 rounded-lg">
              <div>
                <h4 className="font-medium">Monthly Archive</h4>
                <p className="text-sm text-muted-foreground">Long-term storage</p>
              </div>
              <div className="text-sm">1st of month</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-3">Recovery Guide</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Restoring your garden is simple. Choose the point in time you wish to return to,
            and the system will carefully rebuild your creative space.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-studio-accent/10 p-1.5 rounded-full">
                <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-studio-accent">1</span>
              </div>
              <div>
                <h4 className="text-sm font-medium">Select a Backup Point</h4>
                <p className="text-xs text-muted-foreground">Choose the backup you wish to restore from the list</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-studio-accent/10 p-1.5 rounded-full">
                <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-studio-accent">2</span>
              </div>
              <div>
                <h4 className="text-sm font-medium">Choose Restore Options</h4>
                <p className="text-xs text-muted-foreground">Decide whether to restore everything or select specific components</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-studio-accent/10 p-1.5 rounded-full">
                <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-studio-accent">3</span>
              </div>
              <div>
                <h4 className="text-sm font-medium">Confirm and Wait</h4>
                <p className="text-xs text-muted-foreground">The system will carefully restore your creative garden</p>
              </div>
            </div>
          </div>
          <Button className="mt-4 w-full">
            View Complete Restoration Guide
          </Button>
        </div>
      </div>
    </div>
  );
};
