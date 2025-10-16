import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  TrendingUp,
  MoreVertical,
  MessageSquare,
  Clock,
  CheckCircle2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  organization?: string;
  location?: string;
  tags?: string[];
  lastContact?: string;
  nextFollowup?: string;
  totalBookings?: number;
  avgPaymentTime?: number;
  notes?: string;
}

interface SmartContactCardProps {
  contact: Contact;
  onEmail?: (contactId: string) => void;
  onCall?: (contactId: string) => void;
  onSchedule?: (contactId: string) => void;
  onEdit?: (contactId: string) => void;
  onDelete?: (contactId: string) => void;
  onSelect?: (contactId: string) => void;
  isSelected?: boolean;
}

export const SmartContactCard: React.FC<SmartContactCardProps> = ({
  contact,
  onEmail,
  onCall,
  onSchedule,
  onEdit,
  onDelete,
  onSelect,
  isSelected = false
}) => {
  const [showNotes, setShowNotes] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getRoleColor = (role?: string) => {
    const colors: Record<string, string> = {
      venue: 'hsl(var(--accent-purple))',
      promoter: 'hsl(var(--accent-blue))',
      agent: 'hsl(var(--accent-cyan))',
      artist: 'hsl(var(--success))',
      manager: 'hsl(var(--warning))'
    };
    return colors[role?.toLowerCase() || ''] || 'hsl(var(--text-tertiary))';
  };

  return (
    <Card 
      className={`bg-white/5 backdrop-blur-md border transition-all duration-300 hover:border-white/30 ${
        isSelected ? 'border-[hsl(var(--accent-blue))] ring-2 ring-[hsl(var(--accent-blue))]/30' : 'border-white/10'
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar/Checkbox */}
          <div className="flex-shrink-0">
            {onSelect ? (
              <div
                onClick={() => onSelect(contact.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-[hsl(var(--accent-blue))] text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {isSelected ? <CheckCircle2 className="h-6 w-6" /> : getInitials(contact.name)}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">
                {getInitials(contact.name)}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate mb-1">
                  {contact.name}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {contact.role && (
                    <Badge 
                      variant="outline"
                      className="text-xs border-0"
                      style={{
                        backgroundColor: `${getRoleColor(contact.role)}20`,
                        color: getRoleColor(contact.role)
                      }}
                    >
                      {contact.role}
                    </Badge>
                  )}
                  {contact.organization && (
                    <span className="text-sm text-white/60">{contact.organization}</span>
                  )}
                </div>
              </div>

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/70 hover:text-white">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[hsl(var(--bg-elevated))] border-white/10">
                  {onEdit && (
                    <DropdownMenuItem 
                      onClick={() => onEdit(contact.id)}
                      className="text-white/90 focus:bg-white/10 focus:text-white"
                    >
                      Edit Contact
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(contact.id)}
                      className="text-[hsl(var(--error))] focus:bg-[hsl(var(--error))]/10 focus:text-[hsl(var(--error))]"
                    >
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              {contact.email && (
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.location && (
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{contact.location}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            {(contact.totalBookings || contact.avgPaymentTime) && (
              <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10 mb-4">
                {contact.totalBookings !== undefined && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[hsl(var(--success))]" />
                    <div>
                      <div className="text-sm font-medium text-white">{contact.totalBookings}</div>
                      <div className="text-xs text-white/60">Bookings</div>
                    </div>
                  </div>
                )}
                {contact.avgPaymentTime !== undefined && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[hsl(var(--accent-blue))]" />
                    <div>
                      <div className="text-sm font-medium text-white">{contact.avgPaymentTime}d</div>
                      <div className="text-xs text-white/60">Avg Payment</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-2 mb-4 text-xs">
              {contact.lastContact && (
                <div className="flex items-center gap-2 text-white/60">
                  <MessageSquare className="h-3 w-3" />
                  <span>Last contact: {formatDate(contact.lastContact)}</span>
                </div>
              )}
              {contact.nextFollowup && (
                <div className="flex items-center gap-2 text-[hsl(var(--warning))]">
                  <Calendar className="h-3 w-3" />
                  <span>Follow-up: {formatDate(contact.nextFollowup)}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {contact.tags && contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {contact.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs bg-white/5 border-white/20 text-white/70"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {onEmail && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEmail(contact.id)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
              )}
              {onCall && contact.phone && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCall(contact.id)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
              )}
              {onSchedule && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSchedule(contact.id)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule
                </Button>
              )}
            </div>

            {/* Notes Preview */}
            {contact.notes && (
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowNotes(!showNotes)}
                  className="text-white/60 hover:text-white text-xs p-0 h-auto"
                >
                  {showNotes ? 'Hide' : 'Show'} notes
                </Button>
                {showNotes && (
                  <p className="mt-2 text-sm text-white/70 p-3 rounded-lg bg-white/5 border border-white/10">
                    {contact.notes}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
