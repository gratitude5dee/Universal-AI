
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Integration } from "./types";
import { Star, ExternalLink, Code, Globe } from "lucide-react";

interface IntegrationCardProps {
  integration: Integration;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ integration }) => {
  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case "free": return "bg-green-500/20 text-green-300";
      case "freemium": return "bg-blue-500/20 text-blue-300";
      case "paid": return "bg-yellow-500/20 text-yellow-300";
      case "subscription": return "bg-purple-500/20 text-purple-300";
      case "enterprise": return "bg-red-500/20 text-red-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <div className="glass-card rounded-xl border border-white/10 backdrop-blur-md p-6 hover:shadow-lg transition-all duration-300 hover:border-white/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-white text-lg">{integration.name}</h3>
            <Badge className={getPricingColor(integration.pricing)}>
              {integration.pricing}
            </Badge>
          </div>
          <p className="text-sm text-white/60 mb-2">by {integration.provider}</p>
          {integration.rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-white/80">{integration.rating}</span>
              <span className="text-sm text-white/60">({integration.reviews} reviews)</span>
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-sm text-white/80 mb-4 line-clamp-3">{integration.description}</p>

      {integration.features.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-white/60 mb-2 flex items-center">
            <Globe className="w-3 h-3 mr-1" />
            KEY FEATURES
          </h4>
          <div className="flex flex-wrap gap-1">
            {integration.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-white/5 text-white/70 border-white/10">
                {feature}
              </Badge>
            ))}
            {integration.features.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-white/5 text-white/70 border-white/10">
                +{integration.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {integration.languages.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-white/60 mb-2 flex items-center">
            <Code className="w-3 h-3 mr-1" />
            LANGUAGES
          </h4>
          <div className="flex flex-wrap gap-1">
            {integration.languages.slice(0, 3).map((language, index) => (
              <Badge key={index} variant="outline" className="text-xs border-white/20 text-white/70">
                {language}
              </Badge>
            ))}
            {integration.languages.length > 3 && (
              <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                +{integration.languages.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1 mb-4">
        {integration.tags.slice(0, 3).map((tag, index) => (
          <Badge key={index} className="text-xs bg-accent-primary/20 text-accent-primary border-accent-primary/30">
            #{tag}
          </Badge>
        ))}
        {integration.tags.length > 3 && (
          <Badge className="text-xs bg-accent-primary/20 text-accent-primary border-accent-primary/30">
            +{integration.tags.length - 3}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
          {integration.category}
        </Badge>
        <Button variant="default" size="sm" className="bg-gradient-to-r from-studio-accent to-blue-500">
          View Details
        </Button>
      </div>
    </div>
  );
};

export default IntegrationCard;
