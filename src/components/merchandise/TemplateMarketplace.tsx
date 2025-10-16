import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTemplates, DesignTemplate, TemplateFilters } from '@/hooks/useTemplates';
import { Search, Star, Download, Sparkles, DollarSign } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface TemplateMarketplaceProps {
  onSelectTemplate: (template: DesignTemplate) => void;
}

export const TemplateMarketplace: React.FC<TemplateMarketplaceProps> = ({
  onSelectTemplate,
}) => {
  const [filters, setFilters] = useState<TemplateFilters>({
    sortBy: 'popular',
  });

  const { templates, isLoading, useTemplate } = useTemplates(filters);

  const handleUseTemplate = async (template: DesignTemplate) => {
    await useTemplate.mutateAsync(template.id);
    onSelectTemplate(template);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'music-bands', label: 'Music & Bands' },
    { value: 'streetwear', label: 'Streetwear' },
    { value: 'vintage-retro', label: 'Vintage & Retro' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'typography', label: 'Typography' },
    { value: 'abstract-art', label: 'Abstract Art' },
    { value: 'nature-outdoors', label: 'Nature & Outdoors' },
  ];

  const priceRanges = [
    { value: 'all', label: 'Any Price' },
    { value: 'free', label: 'Free' },
    { value: 'under10', label: 'Under $10' },
    { value: '10-25', label: '$10-$25' },
    { value: 'premium', label: 'Premium ($25+)' },
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ];

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Template Marketplace
        </CardTitle>
        <CardDescription className="text-white/70">
          Professional design templates to jumpstart your creativity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search templates..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => setFilters({ ...filters, category: value === 'all' ? undefined : value })}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.priceRange || 'all'}
            onValueChange={(value) => setFilters({ ...filters, priceRange: value === 'all' ? undefined : value as any })}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy || 'popular'}
            onValueChange={(value) => setFilters({ ...filters, sortBy: value as any })}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Template Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates?.map((template) => (
              <Card
                key={template.id}
                className="group cursor-pointer transition-all hover:scale-105 bg-white/10 backdrop-blur-md border-white/20"
              >
                <CardContent className="p-4 space-y-3">
                  {/* Thumbnail */}
                  {template.thumbnail_url && (
                    <div className="aspect-square rounded-lg overflow-hidden bg-white/5">
                      <img
                        src={template.thumbnail_url}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-semibold text-white line-clamp-1">
                      {template.name}
                    </h3>
                    <p className="text-xs text-white/70 line-clamp-2">
                      {template.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {template.tags?.slice(0, 3).map((tag, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs bg-white/10 text-white hover:bg-white/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{template.rating.toFixed(1)}</span>
                      <span>({template.review_count})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span>{template.downloads}</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1 text-white font-bold">
                      {template.price === 0 ? (
                        <span className="text-green-400">Free</span>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4" />
                          <span>{template.price}</span>
                        </>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleUseTemplate(template)}
                      disabled={useTemplate.isPending}
                      className="bg-studio-accent hover:bg-studio-accent/90 text-white"
                    >
                      {useTemplate.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Use'
                      )}
                    </Button>
                  </div>

                  {template.is_featured && (
                    <Badge className="absolute top-2 right-2 bg-studio-accent text-white">
                      Featured
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {templates && templates.length === 0 && (
          <div className="text-center py-12 text-white/70">
            No templates found. Try adjusting your filters.
          </div>
        )}
      </CardContent>
    </Card>
  );
};