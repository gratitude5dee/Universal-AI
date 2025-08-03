import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";

const Contacts = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
            <p className="text-muted-foreground">Manage your event contacts and relationships</p>
          </div>
          <Button onClick={() => navigate("/event-toolkit/contacts/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Contact
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search contacts..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="md:max-w-sm">
                <SelectValue placeholder="Contact Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="venue">Venue Manager</SelectItem>
                <SelectItem value="promoter">Promoter</SelectItem>
                <SelectItem value="booking-agent">Booking Agent</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Content */}
        <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Users className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No contacts yet</h3>
            <p className="text-muted-foreground mb-6">Add your first contact to start building your network</p>
            <Button onClick={() => navigate("/event-toolkit/contacts/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Contact
            </Button>
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default Contacts;