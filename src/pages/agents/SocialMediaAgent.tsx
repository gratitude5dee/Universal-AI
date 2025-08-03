import React, { useState } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { motion } from 'framer-motion';
import { Instagram, Twitter, MessageSquare, BarChart2, Check, Edit, Trash2, Bot, Calendar, Hash, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SocialMediaAgent = () => {
    const [activeTab, setActiveTab] = useState("queue");

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 mb-10">
                {/* Enhanced Header */}
                <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-studio-accent/20 p-3 rounded-full">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <MessageSquare className="h-6 w-6 text-studio-accent" />
                            </motion.div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold text-studio-charcoal">AI Social Media Agent</h1>
                            <p className="text-studio-muted mt-1">Your automated content planner and publisher with intelligent engagement</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div 
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <StatsCard title="Posts Scheduled" value="12" icon={Calendar} accent="blue" />
                    <StatsCard title="Engagement Rate" value="4.2%" icon={BarChart2} trend="up" trendValue="+0.5%" accent="green" />
                    <StatsCard title="New Followers (7d)" value="248" icon={Twitter} accent="purple" />
                    <StatsCard title="Content Queue" value="35" icon={Instagram} accent="orange" />
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Content Management */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card className="glass-card hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Bot className="text-studio-accent" size={20} />
                                            Content Queue (Requires Approval)
                                        </CardTitle>
                                        <Button className="bg-studio-accent hover:bg-studio-accent/90 text-white">
                                            Generate Content
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                        <ContentQueueItem 
                                            platform="Twitter" 
                                            content="Behind the scenes of the new track 'Ethereal Echoes'. The creative process never stops! 🎵 #musicproduction #newmusic #creative"
                                            scheduledTime="Today 2:00 PM"
                                            engagement={95}
                                        />
                                        <ContentQueueItem 
                                            platform="Instagram" 
                                            content="Studio vibes today. Something special is coming... ✨ Can't wait to share this journey with you all!"
                                            scheduledTime="Tomorrow 6:00 PM"
                                            engagement={88}
                                        />
                                        <ContentQueueItem 
                                            platform="Twitter" 
                                            content="Who's ready for the weekend? Dropping a new mix on SoundCloud at 6 PM EST. Set those notifications! 🔥"
                                            scheduledTime="Friday 4:00 PM"
                                            engagement={92}
                                        />
                                        <ContentQueueItem 
                                            platform="Instagram" 
                                            content="Grateful for reaching 10K followers! This community means everything. Here's to the next milestone! 🙏"
                                            scheduledTime="Saturday 12:00 PM"
                                            engagement={97}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card className="glass-card hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Hash className="text-studio-accent" size={20} />
                                        Trending Hashtags & Topics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-medium text-studio-charcoal mb-3">Trending Now</h4>
                                            <div className="space-y-2">
                                                <HashtagItem tag="#electronicmusic" trend="up" engagement="12.5K" />
                                                <HashtagItem tag="#newmusic" trend="up" engagement="8.3K" />
                                                <HashtagItem tag="#synthwave" trend="stable" engagement="6.1K" />
                                                <HashtagItem tag="#musicproducer" trend="up" engagement="4.8K" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-studio-charcoal mb-3">Your Top Tags</h4>
                                            <div className="space-y-2">
                                                <HashtagItem tag="#gratitud3" trend="up" engagement="2.1K" personal />
                                                <HashtagItem tag="#thetape" trend="stable" engagement="1.8K" personal />
                                                <HashtagItem tag="#cosmic" trend="up" engagement="1.5K" personal />
                                                <HashtagItem tag="#dreamstate" trend="down" engagement="980" personal />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right Column - Strategy & Controls */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Card className="glass-card hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart2 className="text-studio-accent" size={20} />
                                        Content Strategy
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <StrategyItem 
                                        title="Promote 'The Tape' Release" 
                                        progress={75} 
                                        active={true}
                                        target="10K impressions"
                                    />
                                    <StrategyItem 
                                        title="Increase Instagram Engagement" 
                                        progress={40} 
                                        active={true}
                                        target="5% engagement rate"
                                    />
                                    <StrategyItem 
                                        title="Announce Fall Tour Dates" 
                                        progress={10} 
                                        active={false}
                                        target="Launch next week"
                                    />
                                    <StrategyItem 
                                        title="Build Community" 
                                        progress={65} 
                                        active={true}
                                        target="15K followers"
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <Card className="glass-card hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="text-studio-accent" size={20} />
                                        Agent Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                                        <div>
                                            <Label className="font-medium text-studio-charcoal">Auto-Post Approved Content</Label>
                                            <p className="text-xs text-studio-muted mt-1">Automatically publish approved posts</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                                        <div>
                                            <Label className="font-medium text-studio-charcoal">Smart Hashtag Suggestions</Label>
                                            <p className="text-xs text-studio-muted mt-1">AI-powered hashtag recommendations</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-medium text-studio-charcoal">Posting Frequency</Label>
                                        <select className="w-full glass-card border border-white/10 rounded-lg p-3 text-studio-charcoal backdrop-blur-md">
                                            <option value="conservative">Conservative (2-3 posts/day)</option>
                                            <option value="moderate" selected>Moderate (4-5 posts/day)</option>
                                            <option value="aggressive">Aggressive (6+ posts/day)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-medium text-studio-charcoal">Content Tone</Label>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-studio-accent/20 text-studio-accent text-xs px-3 py-1 rounded-full">Professional</span>
                                            <span className="bg-studio-accent/20 text-studio-accent text-xs px-3 py-1 rounded-full">Creative</span>
                                            <span className="bg-studio-sand/50 text-studio-muted text-xs px-3 py-1 rounded-full">+ Add Tone</span>
                                        </div>
                                    </div>

                                    <Button className="w-full bg-studio-accent hover:bg-studio-accent/90 shadow-lg">
                                        Update Settings
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, accent = "studio-accent" }: {
    title: string; value: string; icon: any; trend?: string; trendValue?: string; accent?: string;
}) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="glass-card p-6 hover:shadow-xl transition-all duration-300"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-studio-muted">{title}</p>
                <p className="text-2xl font-bold text-studio-charcoal mt-1">{value}</p>
                {trend && (
                    <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {trendValue} from last week
                    </p>
                )}
            </div>
            <div className={`bg-${accent}-500/20 p-3 rounded-full`}>
                <Icon className={`text-${accent}-600`} size={20} />
            </div>
        </div>
    </motion.div>
);

const ContentQueueItem = ({ platform, content, scheduledTime, engagement }) => (
    <motion.div 
        whileHover={{ scale: 1.01 }}
        className="p-4 glass-card border border-white/10 rounded-xl backdrop-blur-md hover:shadow-lg transition-all duration-300"
    >
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
                {platform === 'Twitter' ? 
                    <Twitter size={20} className="text-blue-500"/> : 
                    <Instagram size={20} className="text-pink-500"/>
                }
                <div>
                    <p className="text-sm font-medium text-studio-charcoal">{platform}</p>
                    <p className="text-xs text-studio-muted">{scheduledTime}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                    engagement >= 95 ? 'bg-green-100 text-green-700' :
                    engagement >= 90 ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                }`}>
                    {engagement}% Engagement Score
                </span>
            </div>
        </div>
        
        <p className="text-sm text-studio-charcoal mb-4 leading-relaxed">{content}</p>
        
        <div className="flex gap-2">
            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                <Check size={16} className="mr-1" /> Approve
            </Button>
            <Button size="sm" variant="outline" className="glass-card border border-white/10 backdrop-blur-md">
                <Edit size={16} className="mr-1" /> Edit
            </Button>
            <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50">
                <Trash2 size={16} />
            </Button>
        </div>
    </motion.div>
);

const HashtagItem = ({ tag, trend, engagement, personal = false }) => (
    <div className={`flex items-center justify-between p-2 rounded-lg ${
        personal ? 'bg-studio-accent/10' : 'bg-white/50'
    }`}>
        <span className={`text-sm font-medium ${
            personal ? 'text-studio-accent' : 'text-studio-charcoal'
        }`}>
            {tag}
        </span>
        <div className="flex items-center gap-2">
            <span className="text-xs text-studio-muted">{engagement}</span>
            <div className={`w-2 h-2 rounded-full ${
                trend === 'up' ? 'bg-green-500' :
                trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
        </div>
    </div>
);

const StrategyItem = ({ title, progress, active, target }) => (
    <motion.div 
        whileHover={{ scale: 1.02 }}
        className={`p-4 rounded-xl border transition-all duration-300 ${
            active ? 'bg-white/50 border-studio-accent/30' : 'bg-gray-50 border-gray-200 opacity-60'
        }`}
    >
        <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-medium text-studio-charcoal">{title}</h4>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                active ? 'bg-green-500/20 text-green-700' : 'bg-gray-500/20 text-gray-700'
            }`}>
                {active ? 'Active' : 'Paused'}
            </span>
        </div>
        <p className="text-xs text-studio-muted mb-3">{target}</p>
        <div className="space-y-2">
            <div className="flex justify-between text-xs">
                <span className="text-studio-muted">Progress</span>
                <span className="font-medium text-studio-accent">{progress}%</span>
            </div>
            <div className="w-full bg-studio-sand/30 rounded-full h-2">
                <motion.div 
                    className="bg-studio-accent rounded-full h-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                />
            </div>
        </div>
    </motion.div>
);

export default SocialMediaAgent;