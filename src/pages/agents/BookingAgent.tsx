import React, { useState } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { motion } from 'framer-motion';
import { Bot, Calendar, MapPin, TrendingUp, Mail, DollarSign, Check, X, Settings, Activity, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BookingAgent = () => {
    const [activeTab, setActiveTab] = useState("overview");

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
                                <Bot className="h-6 w-6 text-studio-accent" />
                            </motion.div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold text-studio-charcoal">AI Booking Agent</h1>
                            <p className="text-studio-muted mt-1">Automate your gig scheduling and venue outreach with intelligent negotiations</p>
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
                    <StatsCard title="Open Negotiations" value="3" icon={Mail} accent="cyan" />
                    <StatsCard title="Confirmed Gigs" value="5" icon={Calendar} trend="up" trendValue="+2" accent="green" />
                    <StatsCard title="Venues Scouted" value="28" icon={MapPin} accent="purple" />
                    <StatsCard title="Response Rate" value="78%" icon={TrendingUp} trend="up" trendValue="+5%" accent="orange" />
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
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
                                            <Calendar className="text-studio-accent" size={20} />
                                            Pending Booking Requests
                                        </CardTitle>
                                        <Button variant="outline" size="sm" className="bg-white/50 border-studio-sand/50">
                                            View All
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <BookingRequestCard 
                                        venue="The Fillmore" 
                                        date="Nov 15, 2024" 
                                        offer="$2,500"
                                        status="negotiating"
                                    />
                                    <BookingRequestCard 
                                        venue="Brooklyn Steel" 
                                        date="Dec 2, 2024" 
                                        offer="$3,000"
                                        status="pending"
                                    />
                                    <BookingRequestCard 
                                        venue="The Anthem" 
                                        date="Dec 9, 2024" 
                                        offer="$2,800"
                                        status="countered"
                                    />
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
                                        <Target className="text-studio-accent" size={20} />
                                        Agent's Watchlist: Potential Venues
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <VenueCard 
                                        name="9:30 Club" 
                                        location="Washington, D.C." 
                                        capacity={1200} 
                                        match="92%" 
                                        genre="Electronic"
                                    />
                                    <VenueCard 
                                        name="Red Rocks" 
                                        location="Morrison, CO" 
                                        capacity={9525} 
                                        match="85%" 
                                        genre="Multi-Genre"
                                    />
                                    <VenueCard 
                                        name="House of Blues" 
                                        location="Chicago, IL" 
                                        capacity={1800} 
                                        match="88%" 
                                        genre="Electronic"
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right Column - Settings & Controls */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Card className="glass-card hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings className="text-studio-accent" size={20} />
                                        Agent Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                                        <div>
                                            <Label className="font-medium text-studio-charcoal">Auto-Negotiate Offers</Label>
                                            <p className="text-xs text-studio-muted mt-1">Let AI handle initial negotiations</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <Label className="font-medium text-studio-charcoal">Minimum Offer ($)</Label>
                                        <div className="relative">
                                            <input 
                                                type="range" 
                                                min="500" 
                                                max="5000" 
                                                defaultValue="2000" 
                                                className="w-full h-2 bg-studio-sand/30 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                            <div className="flex justify-between text-xs text-studio-muted mt-2">
                                                <span>$500</span>
                                                <span className="font-medium text-studio-accent">$2,000</span>
                                                <span>$5,000</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <Label className="font-medium text-studio-charcoal">Preferred Regions</Label>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-studio-accent/20 text-studio-accent text-xs px-3 py-1 rounded-full">North America</span>
                                            <span className="bg-studio-accent/20 text-studio-accent text-xs px-3 py-1 rounded-full">Europe</span>
                                            <span className="bg-studio-sand/50 text-studio-muted text-xs px-3 py-1 rounded-full">+ Add Region</span>
                                        </div>
                                    </div>
                                    
                                    <Button className="w-full bg-studio-accent hover:bg-studio-accent/90 shadow-lg">
                                        Update Preferences
                                    </Button>
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
                                        Agent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                                        <p className="text-sm font-medium text-green-700">Agent Active</p>
                                        <p className="text-xs text-green-600 mt-1">Scanning 12 new venues</p>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-studio-muted">Success Rate</span>
                                            <span className="font-medium text-studio-accent">78%</span>
                                        </div>
                                        <div className="w-full bg-studio-sand/30 rounded-full h-2">
                                            <motion.div 
                                                className="bg-studio-accent rounded-full h-2"
                                                initial={{ width: 0 }}
                                                animate={{ width: "78%" }}
                                                transition={{ duration: 1, delay: 0.8 }}
                                            />
                                        </div>
                                    </div>
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
    title: string;
    value: string;
    icon: any;
    trend?: string;
    trendValue?: string;
    accent?: string;
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
                        {trendValue} from last month
                    </p>
                )}
            </div>
            <div className={`bg-${accent}/20 p-3 rounded-full`}>
                <Icon className={`text-${accent}`} size={20} />
            </div>
        </div>
    </motion.div>
);

const BookingRequestCard = ({ venue, date, offer, status }) => {
    const statusStyles = {
        pending: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' },
        negotiating: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
        countered: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-800' }
    };

    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`p-4 border rounded-xl transition-all duration-300 ${statusStyles[status].bg} ${statusStyles[status].border}`}
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-studio-charcoal">{venue}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[status].badge}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    </div>
                    <p className="text-sm text-studio-muted">{date}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-2xl text-green-600">{offer}</p>
                </div>
            </div>
            <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                    <Check size={16} className="mr-1" /> Accept
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-white/80 border-studio-sand/50">
                    Negotiate
                </Button>
                <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50">
                    <X size={16} /> Decline
                </Button>
            </div>
        </motion.div>
    );
};

const VenueCard = ({ name, location, capacity, match, genre }) => (
    <motion.div 
        whileHover={{ scale: 1.02 }}
        className="p-4 bg-white/50 border border-studio-sand/30 rounded-xl hover:shadow-lg transition-all duration-300"
    >
        <div className="flex items-center justify-between">
            <div className="flex-grow">
                <h4 className="font-semibold text-studio-charcoal">{name}</h4>
                <p className="text-xs text-studio-muted mt-1">{location} • Capacity: {capacity.toLocaleString()}</p>
                <span className="text-xs bg-studio-accent/20 text-studio-accent px-2 py-1 rounded-full mt-2 inline-block">
                    {genre}
                </span>
            </div>
            <div className="text-center">
                <p className="font-bold text-2xl text-studio-accent">{match}</p>
                <p className="text-xs text-studio-muted">Match</p>
                <Button size="sm" className="mt-2 bg-studio-accent hover:bg-studio-accent/90 text-white">
                    Contact
                </Button>
            </div>
        </div>
    </motion.div>
);

export default BookingAgent;