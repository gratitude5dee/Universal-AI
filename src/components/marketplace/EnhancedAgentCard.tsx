import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Download, ExternalLink, Sparkles } from 'lucide-react';
import { MarketplaceListing } from '@/types/marketplace';
import { useNavigate } from 'react-router-dom';

interface EnhancedAgentCardProps {
  listing: MarketplaceListing;
}

const EnhancedAgentCard: React.FC<EnhancedAgentCardProps> = ({ listing }) => {
  const navigate = useNavigate();

  const getPriceDisplay = () => {
    switch (listing.pricing.model) {
      case 'free':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">Free</Badge>;
      case 'freemium':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Freemium</Badge>;
      case 'paid':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">${listing.pricing.price}</Badge>;
      case 'subscription':
        return <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">${listing.pricing.price}/mo</Badge>;
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div 
            className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden"
            onClick={() => navigate(`/marketplace/agents/${listing.id}`)}
          >
            {listing.screenshots[0] ? (
              <img src={listing.screenshots[0]} alt={listing.name} className="w-full h-full object-cover" />
            ) : (
              <Sparkles className="w-8 h-8 text-primary" />
            )}
          </div>
          {getPriceDisplay()}
        </div>

        <div onClick={() => navigate(`/marketplace/agents/${listing.id}`)}>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {listing.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Avatar className="w-5 h-5">
              <AvatarImage src={listing.creator.avatar} />
              <AvatarFallback>{listing.creator.name[0]}</AvatarFallback>
            </Avatar>
            <span>by {listing.creator.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{listing.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({listing.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Download className="w-4 h-4" />
            <span>{listing.installCount >= 1000 ? `${(listing.installCount / 1000).toFixed(1)}K` : listing.installCount}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4" onClick={() => navigate(`/marketplace/agents/${listing.id}`)}>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {listing.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {listing.category.slice(0, 3).map((cat) => (
            <Badge key={cat} variant="outline" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>

        <div className="space-y-1">
          {listing.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-primary mt-0.5">✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border/50 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => navigate(`/marketplace/agents/${listing.id}`)}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Learn More
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/marketplace/agents/${listing.id}/install`);
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          Install
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EnhancedAgentCard;
