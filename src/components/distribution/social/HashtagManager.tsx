import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, TrendingUp, Star, Music, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';

interface HashtagCategory {
  name: string;
  icon: React.ReactNode;
  hashtags: Array<{
    tag: string;
    usage: number;
    trending?: boolean;
  }>;
}

const hashtagCategories: HashtagCategory[] = [
  {
    name: "Brand",
    icon: <Star className="w-4 h-4" />,
    hashtags: [
      { tag: "#mysticmusic", usage: 45, trending: true },
      { tag: "#officialmusic", usage: 32 },
      { tag: "#originalcontent", usage: 28 },
      { tag: "#musicproducer", usage: 24 }
    ]
  },
  {
    name: "Music",
    icon: <Music className="w-4 h-4" />,
    hashtags: [
      { tag: "#newmusic", usage: 89, trending: true },
      { tag: "#studio", usage: 67 },
      { tag: "#recording", usage: 45 },
      { tag: "#producer", usage: 41 },
      { tag: "#beats", usage: 38 },
      { tag: "#songwriting", usage: 33 }
    ]
  },
  {
    name: "Trending",
    icon: <TrendingUp className="w-4 h-4" />,
    hashtags: [
      { tag: "#viralmusic", usage: 156, trending: true },
      { tag: "#musicchallenge", usage: 134, trending: true },
      { tag: "#weekendvibes", usage: 89 },
      { tag: "#musicmonday", usage: 67 },
      { tag: "#throwbacktrack", usage: 54 }
    ]
  },
  {
    name: "Events",
    icon: <Calendar className="w-4 h-4" />,
    hashtags: [
      { tag: "#livemusic", usage: 78 },
      { tag: "#concert", usage: 65 },
      { tag: "#musicfestival", usage: 43 },
      { tag: "#gig", usage: 38 },
      { tag: "#performance", usage: 35 }
    ]
  },
  {
    name: "Community",
    icon: <Users className="w-4 h-4" />,
    hashtags: [
      { tag: "#musiclover", usage: 92 },
      { tag: "#fanart", usage: 56 },
      { tag: "#musiccommunity", usage: 47 },
      { tag: "#grateful", usage: 34 },
      { tag: "#thankyou", usage: 29 }
    ]
  }
];

interface HashtagManagerProps {
  onHashtagClick?: (hashtag: string) => void;
}

export const HashtagManager: React.FC<HashtagManagerProps> = ({ onHashtagClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customHashtag, setCustomHashtag] = useState('');

  const filteredCategories = hashtagCategories.map(category => ({
    ...category,
    hashtags: category.hashtags.filter(h => 
      h.tag.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.hashtags.length > 0);

  const handleHashtagClick = (hashtag: string) => {
    if (onHashtagClick) {
      onHashtagClick(hashtag);
    }
  };

  const addCustomHashtag = () => {
    if (customHashtag.trim() && onHashtagClick) {
      const formattedTag = customHashtag.startsWith('#') ? customHashtag : `#${customHashtag}`;
      onHashtagClick(formattedTag);
      setCustomHashtag('');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-80"
    >
      <Card className="glass-card border border-white/10 backdrop-blur-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hash className="w-5 h-5 text-primary" />
            Hashtag Library
          </CardTitle>
          
          {/* Search */}
          <Input
            placeholder="Search hashtags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-secondary/10 border-white/10"
          />

          {/* Add Custom Hashtag */}
          <div className="flex gap-2">
            <Input
              placeholder="Add custom hashtag"
              value={customHashtag}
              onChange={(e) => setCustomHashtag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomHashtag()}
              className="bg-secondary/10 border-white/10"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addCustomHashtag}
              className="px-3 py-2 bg-primary/20 text-primary rounded-md border border-primary/30 hover:bg-primary/30 transition-colors"
            >
              Add
            </motion.button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Accordion type="multiple" defaultValue={["Brand", "Music", "Trending"]}>
            {filteredCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.name}
                variants={itemVariants}
              >
                <AccordionItem value={category.name} className="border-white/10">
                  <AccordionTrigger className="text-sm font-medium hover:text-primary transition-colors">
                    <div className="flex items-center gap-2">
                      {category.icon}
                      {category.name}
                      <Badge variant="secondary" className="ml-auto bg-secondary/30">
                        {category.hashtags.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 gap-2 pt-2">
                      {category.hashtags.map((hashtagData, index) => (
                        <motion.div
                          key={hashtagData.tag}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            transition: { delay: index * 0.05 }
                          }}
                          whileHover={{ x: 4 }}
                          onClick={() => handleHashtagClick(hashtagData.tag)}
                          className="flex items-center justify-between p-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 cursor-pointer transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-primary group-hover:text-primary/80">
                              {hashtagData.tag}
                            </span>
                            {hashtagData.trending && (
                              <TrendingUp className="w-3 h-3 text-orange-400" />
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className="text-xs px-2 py-0.5 bg-secondary/20 border-white/10"
                          >
                            {hashtagData.usage}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
};