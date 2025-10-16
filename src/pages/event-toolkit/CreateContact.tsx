import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";

const CreateContact = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-8 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with glassmorphic styling */}
        <div className="space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/event-toolkit/contacts")}
            className="group text-foreground/70 hover:text-foreground transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Contacts
          </Button>
          
          <div className="glass-card p-8 border-white/10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))] flex items-center justify-center">
                <User className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Add New Contact</h1>
                <p className="text-foreground/60 text-lg mt-1">Build and grow your professional network</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic & Company Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="glass-card p-8 border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--accent-purple))]/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-[hsl(var(--accent-purple))]" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Basic Information</h3>
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-foreground/80 font-medium">First Name</Label>
                      <Input id="first-name" placeholder="John" className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-purple))]/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-foreground/80 font-medium">Last Name</Label>
                      <Input id="last-name" placeholder="Doe" className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-purple))]/50 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground/80 font-medium">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-purple))]/50 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground/80 font-medium">Phone Number</Label>
                    <Input id="phone" placeholder="+1 (555) 123-4567" className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-purple))]/50 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-type" className="text-foreground/80 font-medium">Contact Type</Label>
                    <Select>
                      <SelectTrigger className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-purple))]/50 transition-colors">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="venue">Venue Manager</SelectItem>
                        <SelectItem value="promoter">Promoter</SelectItem>
                        <SelectItem value="booking-agent">Booking Agent</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Company & Social */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card p-8 border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--accent-blue))]/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-[hsl(var(--accent-blue))]" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Company & Social</h3>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-foreground/80 font-medium">Company/Venue</Label>
                    <Input id="company" placeholder="Company name" className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-blue))]/50 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-foreground/80 font-medium">Position/Title</Label>
                    <Input id="position" placeholder="Event Manager" className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-blue))]/50 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-foreground/80 font-medium">Website</Label>
                    <Input id="website" placeholder="https://example.com" className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-blue))]/50 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-foreground/80 font-medium">Instagram</Label>
                      <Input id="instagram" placeholder="@username" className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-blue))]/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="text-foreground/80 font-medium">LinkedIn</Label>
                      <Input id="linkedin" placeholder="linkedin.com/in/username" className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-blue))]/50 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Additional Info & Preview */}
          <div className="space-y-6">
            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="glass-card p-8 border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--accent-cyan))]/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-[hsl(var(--accent-cyan))]" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Additional Info</h3>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-foreground/80 font-medium">Address</Label>
                    <Textarea id="address" placeholder="Street address, city, state, zip" rows={3} className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-cyan))]/50 transition-colors resize-none" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferred-contact" className="text-foreground/80 font-medium">Preferred Contact</Label>
                    <Select>
                      <SelectTrigger className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-cyan))]/50 transition-colors">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="text">Text Message</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-foreground/80 font-medium">Time Zone</Label>
                    <Select>
                      <SelectTrigger className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-cyan))]/50 transition-colors">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pst">Pacific Standard Time</SelectItem>
                        <SelectItem value="mst">Mountain Standard Time</SelectItem>
                        <SelectItem value="cst">Central Standard Time</SelectItem>
                        <SelectItem value="est">Eastern Standard Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-foreground/80 font-medium">Notes</Label>
                    <Textarea id="notes" placeholder="Additional notes about this contact..." rows={4} className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-cyan))]/50 transition-colors resize-none" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="glass-card p-8 border-white/10 bg-gradient-to-br from-[hsl(var(--accent-purple))]/10 to-[hsl(var(--accent-blue))]/10">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-[hsl(var(--accent-purple))]" />
                  </div>
                  Live Preview
                </h3>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))] flex items-center justify-center ring-4 ring-white/10">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-foreground mb-1">Contact Name</p>
                    <p className="text-sm text-foreground/60 mb-2">Position at Company</p>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground/70">contact@email.com</p>
                      <p className="text-xs text-foreground/50 bg-white/5 px-2 py-1 rounded-md inline-block">Type: Not specified</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Actions */}
        <motion.div 
          className="flex gap-4 glass-card p-6 border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))] hover:opacity-90 transition-opacity shadow-lg shadow-[hsl(var(--accent-purple))]/30 px-8"
          >
            <User className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/event-toolkit/contacts")}
            className="border-white/20 hover:bg-white/10 transition-colors"
          >
            Cancel
          </Button>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default CreateContact;