import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FilterState } from '@/types/marketplace';

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const categories = ['Creative', 'Business', 'Technical', 'Communication', 'Research'];
const priceModels = [
  { value: 'free', label: 'Free' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'paid', label: 'Paid' },
  { value: 'subscription', label: 'Subscription' }
];

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange }) => {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilter('categories', newCategories);
  };

  const togglePriceModel = (model: string) => {
    const newModels = filters.priceModel.includes(model as any)
      ? filters.priceModel.filter(m => m !== model)
      : [...filters.priceModel, model as any];
    updateFilter('priceModel', newModels);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      categories: [],
      priceModel: [],
      minRating: 0,
      sortBy: 'popularity'
    });
  };

  const activeFilterCount = filters.categories.length + filters.priceModel.length + (filters.minRating > 0 ? 1 : 0);

  return (
    <div className="space-y-4 flex-1">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search agents..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-studio-accent text-white">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 backdrop-blur-md bg-background/95 border-white/20" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white">Filters</h4>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-white/70 hover:text-white">
                  Clear all
                </Button>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-white">Categories</Label>
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm cursor-pointer text-white/80"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-white">Price Model</Label>
                {priceModels.map((model) => (
                  <div key={model.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`price-${model.value}`}
                      checked={filters.priceModel.includes(model.value as any)}
                      onCheckedChange={() => togglePriceModel(model.value)}
                    />
                    <label
                      htmlFor={`price-${model.value}`}
                      className="text-sm cursor-pointer text-white/80"
                    >
                      {model.label}
                    </label>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-white">Minimum Rating</Label>
                <Select 
                  value={filters.minRating.toString()} 
                  onValueChange={(v) => updateFilter('minRating', parseInt(v))}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Ratings</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Select value={filters.sortBy} onValueChange={(v) => updateFilter('sortBy', v)}>
          <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="recent">Recently Added</SelectItem>
            <SelectItem value="alphabetical">A-Z</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(filters.categories.length > 0 || filters.priceModel.length > 0) && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {filters.categories.map((category) => (
            <Badge key={category} className="gap-1 bg-studio-accent/20 text-studio-accent border-studio-accent/30">
              {category}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-white" 
                onClick={() => toggleCategory(category)}
              />
            </Badge>
          ))}
          {filters.priceModel.map((model) => (
            <Badge key={model} className="gap-1 bg-purple-500/20 text-purple-400 border-purple-500/30">
              {model}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-white" 
                onClick={() => togglePriceModel(model)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
