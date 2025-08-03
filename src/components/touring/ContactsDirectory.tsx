import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Plus, Mail, Phone, Building, Tag, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Contact {
  id: string;
  name: string;
  company?: string;
  role?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  notes?: string;
  last_contacted?: string;
}

const ContactsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Fetch contacts data
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['tour_contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_contacts')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Get all unique tags
  const allTags = Array.from(
    new Set(contacts.flatMap(contact => contact.tags || []))
  );

  // Filter contacts based on search and tags
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchQuery === "" || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => contact.tags?.includes(tag));

    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getRoleColor = (role?: string) => {
    if (!role) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    
    switch (role.toLowerCase()) {
      case 'venue manager': return 'bg-studio-accent/20 text-studio-accent border-studio-accent/30';
      case 'promoter': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'booking agent': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'sound engineer': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contacts Directory
            </CardTitle>
            
            <Button className="bg-studio-accent hover:bg-studio-accent/80">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts, companies, roles..."
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-white/70">Filter by tags:</p>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-studio-accent/20 text-studio-accent border-studio-accent/50'
                        : 'border-white/20 text-white/70 hover:bg-white/10'
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contacts Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredContacts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-white/70">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No contacts found</p>
            <p className="text-sm">Add your first contact to get started</p>
          </div>
        ) : (
          filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow hover:shadow-lg hover:shadow-studio-accent/20 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white">{contact.name}</CardTitle>
                      {contact.company && (
                        <p className="text-sm text-white/70 flex items-center gap-1 mt-1">
                          <Building className="h-3 w-3" />
                          {contact.company}
                        </p>
                      )}
                      {contact.role && (
                        <Badge className={`${getRoleColor(contact.role)} mt-2`}>
                          {contact.role}
                        </Badge>
                      )}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black/90 border-white/20">
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    {contact.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-white/50" />
                        <span className="text-white/70 truncate">{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-white/50" />
                        <span className="text-white/70">{contact.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs border-white/20 text-white/60">
                          {tag}
                        </Badge>
                      ))}
                      {contact.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                          +{contact.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Last Contact */}
                  {contact.last_contacted && (
                    <p className="text-xs text-white/50">
                      Last contacted: {format(new Date(contact.last_contacted), 'MMM dd, yyyy')}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {contact.email && (
                      <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                    )}
                    {contact.phone && (
                      <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default ContactsDirectory;