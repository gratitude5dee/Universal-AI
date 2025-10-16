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
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Free</Badge>;
      case 'freemium':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Freemium</Badge>;
      case 'paid':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">${listing.pricing.price}</Badge>;
      case 'subscription':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">${listing.pricing.price}/mo</Badge>;
    }
  };

  return (
    <Card className="group backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/15 hover:shadow-card-glow hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-studio-accent/30 to-purple-500/30 flex items-center justify-center overflow-hidden border border-white/20 shadow-lg"
            onClick={() => navigate(`/marketplace/agents/${listing.id}`)}
          >
            {listing.screenshots[0] ? (
              <img src={listing.screenshots[0]} alt={listing.name} className="w-full h-full object-cover" />
            ) : (
              <Sparkles className="w-8 h-8 text-studio-accent" />
            )}
          </div>
          {getPriceDisplay()}
        </div>

        <div onClick={() => navigate(`/marketplace/agents/${listing.id}`)} className="space-y-2">
          <h3 className="font-semibold text-xl text-white group-hover:text-studio-accent transition-colors">
            {listing.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Avatar className="w-5 h-5 border border-white/20">
              <AvatarImage src={listing.creator.avatar} />
              <AvatarFallback className="text-xs">{listing.creator.name[0]}</AvatarFallback>
            </Avatar>
            <span>by {listing.creator.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm pt-2">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-white">{listing.rating.toFixed(1)}</span>
            <span className="text-white/60">({listing.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/70">
            <Download className="w-4 h-4" />
            <span>{listing.installCount >= 1000 ? `${(listing.installCount / 1000).toFixed(1)}K` : listing.installCount}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4 space-y-4" onClick={() => navigate(`/marketplace/agents/${listing.id}`)}>
        <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">
          {listing.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {listing.category.slice(0, 2).map((cat) => (
            <Badge 
              key={cat} 
              variant="outline" 
              className="text-xs bg-white/5 border-white/20 text-white/90"
            >
              {cat}
            </Badge>
          ))}
        </div>

        <div className="space-y-1.5 pt-2 border-t border-white/10">
          {listing.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-white/80">
              <span className="text-studio-accent mt-0.5 text-sm">✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-white/20 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/marketplace/agents/${listing.id}`);
          }}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Details
        </Button>
        <Button 
          size="sm" 
          className="flex-1 bg-studio-accent hover:bg-studio-accent/90 text-white"
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
