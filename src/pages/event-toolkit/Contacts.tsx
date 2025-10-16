import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, 
  Plus, 
  UserPlus, 
  Star,
  Mail,
  Tag,
  Trash2,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Enhanced Components
import { SmartContactCard } from "@/components/event-toolkit/contacts/SmartContactCard";
import { ContactsFilter } from "@/components/event-toolkit/contacts/ContactsFilter";
import { NetworkAnalytics } from "@/components/event-toolkit/contacts/NetworkAnalytics";
import { BulkActionsBar } from "@/components/event-toolkit/contacts/BulkActionsBar";

const Contacts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    tags: [] as string[],
    location: 'all'
  });

  // Mock data - in production, this would come from database
  const mockContacts = [
    {
      id: '1',
      name: 'Blue Note Jazz Club',
      email: 'booking@bluenote.com',
      phone: '+1 (555) 123-4567',
      role: 'venue',
      organization: 'Blue Note Entertainment',
      location: 'New York, NY',
      tags: ['Responsive', 'High-value', 'Jazz'],
      lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      nextFollowup: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      totalBookings: 5,
      avgPaymentTime: 15,
      notes: 'Excellent venue with great acoustics. Always professional and pays on time.'
    },
    {
      id: '2',
      name: 'Sarah Martinez',
      email: 'sarah@cityevents.com',
      phone: '+1 (555) 234-5678',
      role: 'promoter',
      organization: 'City Events',
      location: 'Los Angeles, CA',
      tags: ['New Contact', 'Festival'],
      lastContact: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      totalBookings: 2,
      avgPaymentTime: 30,
      notes: 'Connected at SXSW. Interested in summer festival lineup.'
    },
    {
      id: '3',
      name: 'The Velvet Room',
      email: 'info@velvetroom.com',
      phone: '+1 (555) 345-6789',
      role: 'venue',
      organization: 'Velvet Room LLC',
      location: 'Chicago, IL',
      tags: ['Needs follow-up', 'Electronic'],
      lastContact: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      nextFollowup: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      totalBookings: 3,
      avgPaymentTime: 20,
      notes: 'Great for electronic/house shows. Contact about spring dates.'
    }
  ];

  // Filter contacts
  const filteredContacts = mockContacts.filter(contact => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchLower) ||
        contact.email?.toLowerCase().includes(searchLower) ||
        contact.organization?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Role filter
    if (filters.role !== 'all' && contact.role !== filters.role) {
      return false;
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const hasTag = filters.tags.some(tag => contact.tags?.includes(tag));
      if (!hasTag) return false;
    }

    return true;
  });

  // Calculate network stats
  const networkStats = {
    totalContacts: mockContacts.length,
    venues: mockContacts.filter(c => c.role === 'venue').length,
    promoters: mockContacts.filter(c => c.role === 'promoter').length,
    newThisMonth: 1,
    emailsSent: 12,
    phoneCallsMade: 8
  };

  // Get available tags
  const availableTags = Array.from(
    new Set(mockContacts.flatMap(c => c.tags || []))
  );

  // Handle bulk selection
  const toggleContactSelection = (contactId: string) => {
    const newSelection = new Set(selectedContacts);
    if (newSelection.has(contactId)) {
      newSelection.delete(contactId);
    } else {
      newSelection.add(contactId);
    }
    setSelectedContacts(newSelection);
  };

  const selectAllContacts = () => {
    if (selectedContacts.size === filteredContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map(c => c.id)));
    }
  };

  const clearSelection = () => {
    setSelectedContacts(new Set());
  };

  // Handle contact actions
  const handleEmail = (contactId: string) => {
    const contact = mockContacts.find(c => c.id === contactId);
    toast({
      title: "Email Composer",
      description: `Opening email to ${contact?.name}...`,
    });
  };

  const handleCall = (contactId: string) => {
    const contact = mockContacts.find(c => c.id === contactId);
    window.location.href = `tel:${contact?.phone}`;
  };

  const handleSchedule = (contactId: string) => {
    toast({
      title: "Schedule Meeting",
      description: "Calendar integration coming soon...",
    });
  };

  const handleEdit = (contactId: string) => {
    navigate(`/event-toolkit/contacts/${contactId}/edit`);
  };

  const handleDelete = (contactId: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      toast({
        title: "Contact Deleted",
        description: "The contact has been removed from your network.",
      });
    }
  };

  const handleBulkEmail = () => {
    toast({
      title: "Bulk Email",
      description: `Composing email to ${selectedContacts.size} contacts...`,
    });
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedContacts.size} contacts?`)) {
      toast({
        title: "Contacts Deleted",
        description: `${selectedContacts.size} contacts have been removed.`,
      });
      clearSelection();
    }
  };

  const handleExport = () => {
    toast({
      title: "Exporting Contacts",
      description: `Exporting ${selectedContacts.size} contacts to CSV...`,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-white mr-3" />
              <h1 className="text-2xl font-bold text-white">Professional Network</h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedContacts.size > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkEmail}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Selected
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllContacts}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {selectedContacts.size === filteredContacts.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </>
              )}
              <Button
                onClick={() => navigate("/event-toolkit/contacts/create")}
                className="bg-[hsl(var(--accent-purple))] hover:bg-[hsl(var(--accent-purple-light))] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>
          <p className="text-blue-lightest/70">Manage your venues, promoters, and industry connections</p>
        </div>

        {/* Network Analytics */}
        <div className="mb-8">
          <NetworkAnalytics stats={networkStats} />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardContent className="p-6">
              <ContactsFilter
                filters={filters}
                onFilterChange={setFilters}
                availableTags={availableTags}
              />
            </CardContent>
          </Card>
        </div>

        {/* Contacts Grid */}
        <AnimatePresence>
          {filteredContacts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-2"
                >
                  <Checkbox
                    checked={selectedContacts.has(contact.id)}
                    onCheckedChange={() => toggleContactSelection(contact.id)}
                    className="mt-3 border-white/30 data-[state=checked]:bg-[hsl(var(--accent-blue))] data-[state=checked]:border-[hsl(var(--accent-blue))]"
                  />
                  <div className="flex-1">
                    <SmartContactCard
                      contact={contact}
                      onEmail={handleEmail}
                      onCall={handleCall}
                      onSchedule={handleSchedule}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isSelected={selectedContacts.has(contact.id)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-lg bg-[hsl(var(--accent-purple))]/20 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-[hsl(var(--accent-purple))]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {mockContacts.length === 0 ? 'No contacts yet' : 'No matching contacts'}
                </h3>
                <p className="text-blue-lightest/70 mb-6">
                  {mockContacts.length === 0
                    ? 'Start building your professional network by adding your first contact'
                    : 'Try adjusting your filters or add a new contact'}
                </p>
                <Button 
                  onClick={() => navigate("/event-toolkit/contacts/create")}
                  className="bg-blue-primary hover:bg-blue-primary/80 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {mockContacts.length === 0 ? 'Add Your First Contact' : 'Add New Contact'}
                </Button>
              </CardContent>
            </Card>
          )}
        </AnimatePresence>

        {/* Bulk Actions Bar */}
        <BulkActionsBar
          selectedCount={selectedContacts.size}
          onEmailAll={handleBulkEmail}
          onDeleteAll={handleBulkDelete}
          onExport={handleExport}
          onClearSelection={clearSelection}
        />
      </div>
    </DashboardLayout>
  );
};

export default Contacts;