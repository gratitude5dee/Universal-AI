
import React from "react";
import DistributionLayout from "@/layouts/distribution-layout";
import StatsCard from "@/components/ui/stats-card";
import { 
  Share2,
  Globe, 
  Link, 
  Tv, 
  User, 
  Music,
  BarChart3,
  TrendingUp,
  Play
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const DistributionOverview = () => {
  return (
    <DistributionLayout 
      title="Distribution Dashboard" 
      subtitle="Monitor and manage your music distribution across all channels"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Streams"
          value="2.4M"
          description="Last 30 days"
          icon={Play}
          trend="up"
          trendValue="12.5%"
          delay={0}
        />
        <StatsCard
          title="Revenue"
          value="$18,294"
          description="Last 30 days"
          icon={TrendingUp}
          trend="up"
          trendValue="8.3%"
          delay={1}
        />
        <StatsCard
          title="Active Channels"
          value="14"
          description="Across all platforms"
          icon={Share2}
          delay={2}
        />
      </div>

      <div className="glass-card p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Distribution Channels</h2>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Channels</TabsTrigger>
            <TabsTrigger value="streaming">Streaming</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="sync">Sync & Licensing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ChannelCard 
                name="Spotify" 
                icon={<img src="/placeholder.svg" className="w-10 h-10 rounded-md" alt="Spotify" />}
                listeners="845K"
                growth="+5.2%"
                color="bg-green-100"
              />
              <ChannelCard 
                name="Apple Music" 
                icon={<img src="/placeholder.svg" className="w-10 h-10 rounded-md" alt="Apple Music" />}
                listeners="412K"
                growth="+3.8%"
                color="bg-purple-100"
              />
              <ChannelCard 
                name="TikTok" 
                icon={<img src="/placeholder.svg" className="w-10 h-10 rounded-md" alt="TikTok" />}
                listeners="1.2M"
                growth="+24.5%"
                color="bg-blue-100"
              />
              <ChannelCard 
                name="YouTube" 
                icon={<img src="/placeholder.svg" className="w-10 h-10 rounded-md" alt="YouTube" />}
                listeners="530K"
                growth="+7.1%"
                color="bg-red-100"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="streaming" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ChannelCard 
                name="Spotify" 
                icon={<img src="/placeholder.svg" className="w-10 h-10 rounded-md" alt="Spotify" />}
                listeners="845K"
                growth="+5.2%"
                color="bg-green-100"
              />
              <ChannelCard 
                name="Apple Music" 
                icon={<img src="/placeholder.svg" className="w-10 h-10 rounded-md" alt="Apple Music" />}
                listeners="412K"
                growth="+3.8%"
                color="bg-purple-100"
              />
              <ChannelCard 
                name="Amazon Music" 
                icon={<img src="/placeholder.svg" className="w-10 h-10 rounded-md" alt="Amazon Music" />}
                listeners="215K"
                growth="+2.3%"
                color="bg-orange-100"
              />
              <ChannelCard 
                name="SoundCloud" 
                icon={<img src="/placeholder.svg" className="w-10 h-10 rounded-md" alt="SoundCloud" />}
                listeners="183K"
                growth="+1.9%"
                color="bg-yellow-100"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ChannelCard 
                name="TikTok" 
                icon={<img src="/placeholder.svg" className="w-10 h-10 rounded-md" alt="TikTok" />}
                listeners="1.2M"
                growth="+24.5%"
                color="bg-blue-100"
              />
              <ChannelCard 
                name="Instagram" 
                icon={<img src="/placeholder.svg" className="w-10 h-10 rounded-md" alt="Instagram" />}
                listeners="895K"
                growth="+12.3%"
                color="bg-pink-100"
              />
              <ChannelCard 
                name="YouTube" 
                icon={<img src="/placeholder.svg" className="w-10 h-10 rounded-md" alt="YouTube" />}
                listeners="530K"
                growth="+7.1%"
                color="bg-red-100"
              />
              <ChannelCard 
                name="Twitter" 
                icon={<img src="/placeholder.svg" className="w-10 h-10 rounded-md" alt="Twitter" />}
                listeners="210K"
                growth="+5.7%"
                color="bg-blue-100"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="sync" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ChannelCard 
                name="Film & TV" 
                icon={<Tv className="w-10 h-10 p-2 rounded-md bg-indigo-100 text-indigo-500" />}
                listeners="24"
                growth="+3"
                color="bg-indigo-100"
                suffix="placements"
              />
              <ChannelCard 
                name="Commercials" 
                icon={<Music className="w-10 h-10 p-2 rounded-md bg-orange-100 text-orange-500" />}
                listeners="8"
                growth="+2"
                color="bg-orange-100"
                suffix="usages"
              />
              <ChannelCard 
                name="Games" 
                icon={<img src="/placeholder.svg" className="w-10 h-10 rounded-md" alt="Games" />}
                listeners="5"
                growth="+1"
                color="bg-purple-100"
                suffix="integrations"
              />
              <ChannelCard 
                name="NFT Projects" 
                icon={<Link className="w-10 h-10 p-2 rounded-md bg-teal-100 text-teal-500" />}
                listeners="12"
                growth="+7"
                color="bg-teal-100"
                suffix="projects"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="glass-card p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Recent Releases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReleaseCard 
            title="Summer Waves"
            artist="Ocean Sound"
            image="/placeholder.svg"
            date="Aug 15, 2023"
            streams="548K"
          />
          <ReleaseCard 
            title="Midnight Dreams"
            artist="Luna & The Stars"
            image="/placeholder.svg"
            date="Jul 22, 2023"
            streams="423K"
          />
          <ReleaseCard 
            title="Mountain Echo"
            artist="The Wilderness"
            image="/placeholder.svg"
            date="Jun 30, 2023"
            streams="352K"
          />
        </div>
      </div>
    </DistributionLayout>
  );
};

// Channel Card Component
interface ChannelCardProps {
  name: string;
  icon: React.ReactNode;
  listeners: string;
  growth: string;
  color: string;
  suffix?: string;
}

const ChannelCard = ({ name, icon, listeners, growth, color, suffix = "listeners" }: ChannelCardProps) => (
  <div className="glass-card rounded-xl border border-white/10 backdrop-blur-md p-4 hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div className="flex items-center">
        {icon}
        <div className="ml-3">
          <h3 className="font-medium">{name}</h3>
          <div className="flex items-baseline mt-1">
            <span className="text-lg font-semibold">{listeners}</span>
            <span className="text-xs text-muted-foreground ml-1">{suffix}</span>
          </div>
        </div>
      </div>
      <span className="text-xs text-green-500 font-medium">{growth}</span>
    </div>
  </div>
);

// Release Card Component
interface ReleaseCardProps {
  title: string;
  artist: string;
  image: string;
  date: string;
  streams: string;
}

const ReleaseCard = ({ title, artist, image, date, streams }: ReleaseCardProps) => (
  <div className="glass-card rounded-xl border border-white/10 backdrop-blur-md overflow-hidden hover:shadow-md transition-all">
    <div className="aspect-square bg-studio-sand/20 relative">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-4">
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="text-muted-foreground">{artist}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-muted-foreground">{date}</span>
        <div className="flex items-center">
          <Play className="h-3 w-3 text-studio-accent mr-1" />
          <span className="text-sm font-medium">{streams}</span>
        </div>
      </div>
    </div>
  </div>
);

export default DistributionOverview;
