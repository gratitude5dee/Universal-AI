import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter } from 'lucide-react';

interface FilterOptions {
  search: string;
  role: string;
  tags: string[];
  location: string;
}

interface ContactsFilterProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  availableTags?: string[];
}

export const ContactsFilter: React.FC<ContactsFilterProps> = ({
  filters,
  onFilterChange,
  availableTags = []
}) => {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleRoleChange = (value: string) => {
    onFilterChange({ ...filters, role: value });
  };

  const handleLocationChange = (value: string) => {
    onFilterChange({ ...filters, location: value });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFilterChange({ ...filters, tags: newTags });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      role: 'all',
      tags: [],
      location: 'all'
    });
  };

  const hasActiveFilters = filters.search || filters.role !== 'all' || filters.tags.length > 0 || filters.location !== 'all';

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
        <Input
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search contacts by name, email, or organization..."
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-[hsl(var(--accent-blue))]"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>

        {/* Role Filter */}
        <Select value={filters.role} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[150px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent className="bg-[hsl(var(--bg-elevated))] border-white/10">
            <SelectItem value="all" className="text-white focus:bg-white/10 focus:text-white">All Roles</SelectItem>
            <SelectItem value="venue" className="text-white focus:bg-white/10 focus:text-white">Venue</SelectItem>
            <SelectItem value="promoter" className="text-white focus:bg-white/10 focus:text-white">Promoter</SelectItem>
            <SelectItem value="agent" className="text-white focus:bg-white/10 focus:text-white">Agent</SelectItem>
            <SelectItem value="artist" className="text-white focus:bg-white/10 focus:text-white">Artist</SelectItem>
            <SelectItem value="manager" className="text-white focus:bg-white/10 focus:text-white">Manager</SelectItem>
          </SelectContent>
        </Select>

        {/* Location Filter */}
        <Select value={filters.location} onValueChange={handleLocationChange}>
          <SelectTrigger className="w-[150px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent className="bg-[hsl(var(--bg-elevated))] border-white/10">
            <SelectItem value="all" className="text-white focus:bg-white/10 focus:text-white">All Locations</SelectItem>
            <SelectItem value="local" className="text-white focus:bg-white/10 focus:text-white">Local</SelectItem>
            <SelectItem value="regional" className="text-white focus:bg-white/10 focus:text-white">Regional</SelectItem>
            <SelectItem value="national" className="text-white focus:bg-white/10 focus:text-white">National</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            onClick={clearFilters}
            className="text-white/70 hover:text-white"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Tag Filter */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <Badge
              key={tag}
              variant="outline"
              onClick={() => toggleTag(tag)}
              className={`cursor-pointer transition-all duration-200 ${
                filters.tags.includes(tag)
                  ? 'bg-[hsl(var(--accent-blue))]/20 border-[hsl(var(--accent-blue))] text-[hsl(var(--accent-blue))]'
                  : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
              }`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          <span className="text-xs text-white/50">Active filters:</span>
          {filters.role !== 'all' && (
            <Badge variant="outline" className="bg-[hsl(var(--accent-purple))]/20 border-[hsl(var(--accent-purple))]/30 text-[hsl(var(--accent-purple))]">
              Role: {filters.role}
            </Badge>
          )}
          {filters.location !== 'all' && (
            <Badge variant="outline" className="bg-[hsl(var(--accent-cyan))]/20 border-[hsl(var(--accent-cyan))]/30 text-[hsl(var(--accent-cyan))]">
              Location: {filters.location}
            </Badge>
          )}
          {filters.tags.map(tag => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-[hsl(var(--accent-blue))]/20 border-[hsl(var(--accent-blue))]/30 text-[hsl(var(--accent-blue))]"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
