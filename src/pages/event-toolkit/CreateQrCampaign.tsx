import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, QrCode, Image, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";

const CreateQrCampaign = () => {
  const navigate = useNavigate();
  const [photosEnabled, setPhotosEnabled] = useState(true);
  const [videosEnabled, setVideosEnabled] = useState(true);

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/event-toolkit/qr-upload")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to QR Campaigns
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create QR Campaign</h1>
            <p className="text-muted-foreground">Set up a new campaign for fan content collection</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Campaign Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input id="campaign-name" placeholder="Summer Festival 2024" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-name">Event Name</Label>
                  <Input id="event-name" placeholder="DJ Night at Club XYZ" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Share your photos and videos from tonight's show!" 
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Event Date</Label>
                    <Input id="event-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry-date">Campaign Expiry</Label>
                    <Input id="expiry-date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue/Location</Label>
                  <Input id="venue" placeholder="Club XYZ, Los Angeles" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="privacy">Privacy Settings</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select privacy level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can view uploads</SelectItem>
                      <SelectItem value="private">Private - Only you can view uploads</SelectItem>
                      <SelectItem value="unlisted">Unlisted - Link required to view</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* File Types */}
                <div className="space-y-4">
                  <Label>Allowed File Types</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Image className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Photos</p>
                          <p className="text-sm text-muted-foreground">JPEG, PNG, HEIC</p>
                        </div>
                      </div>
                      <Switch checked={photosEnabled} onCheckedChange={setPhotosEnabled} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Video className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Videos</p>
                          <p className="text-sm text-muted-foreground">MP4, MOV, up to 100MB</p>
                        </div>
                      </div>
                      <Switch checked={videosEnabled} onCheckedChange={setVideosEnabled} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Preview & Info Section */}
          <div className="space-y-6">
            {/* Preview */}
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Preview</h3>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-32 h-32 bg-background border-2 border-border rounded-lg flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h4 className="font-semibold">Campaign Name</h4>
                  <p className="text-sm text-muted-foreground">Share your photos and videos!</p>
                  <p className="text-xs text-muted-foreground">Scan to upload content</p>
                </div>
              </div>
            </Card>

            {/* How it Works */}
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">How it Works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-sm">Display QR Code</p>
                    <p className="text-xs text-muted-foreground">Show at your event</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm">Fans Scan</p>
                    <p className="text-xs text-muted-foreground">Using their phone camera</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm">Upload Content</p>
                    <p className="text-xs text-muted-foreground">Photos and videos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-sm">Collect & Organize</p>
                    <p className="text-xs text-muted-foreground">View all submissions</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            Create Campaign
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/event-toolkit/qr-upload")}
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default CreateQrCampaign;