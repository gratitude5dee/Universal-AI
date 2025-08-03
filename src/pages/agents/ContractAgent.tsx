import React, { useState } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { motion } from 'framer-motion';
import { Shield, FileText, Plus, Search, Mic, MapPin, Handshake, Bot, Clock, Users, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ContractAgent = () => {
    const [activeTab, setActiveTab] = useState("templates");

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
                                <Shield className="h-6 w-6 text-studio-accent" />
                            </motion.div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold text-studio-charcoal">AI Contract Agent</h1>
                            <p className="text-studio-muted mt-1">Generate, manage, and track your business and legal agreements with intelligent automation</p>
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
                    <StatsCard title="Active Contracts" value="8" icon={FileText} accent="blue" />
                    <StatsCard title="Pending Signatures" value="3" icon={Clock} accent="orange" />
                    <StatsCard title="Templates Used" value="12" icon={Shield} accent="green" />
                    <StatsCard title="Compliance Score" value="98%" icon={Users} trend="up" trendValue="+2%" accent="purple" />
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Contract Management */}
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
                                            Smart Contract Templates
                                        </CardTitle>
                                        <Button className="bg-studio-accent hover:bg-studio-accent/90 text-white">
                                            <Plus size={16} className="mr-2" />
                                            Create Custom
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-studio-muted mb-6">Select a template to begin. The AI will guide you through customizing it for your specific needs.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <ContractTemplateCard 
                                            title="Performance Agreement" 
                                            icon={Mic} 
                                            description="Comprehensive venue performance contracts"
                                            usage="24 times"
                                        />
                                        <ContractTemplateCard 
                                            title="Musician Rider" 
                                            icon={MapPin} 
                                            description="Technical and hospitality requirements"
                                            usage="18 times"
                                        />
                                        <ContractTemplateCard 
                                            title="Collaboration Split Sheet" 
                                            icon={Handshake} 
                                            description="Revenue sharing agreements"
                                            usage="15 times"
                                        />
                                        <ContractTemplateCard 
                                            title="Management Agreement" 
                                            icon={Users} 
                                            description="Artist management contracts"
                                            usage="8 times"
                                        />
                                        <ContractTemplateCard 
                                            title="Licensing Agreement" 
                                            icon={Shield} 
                                            description="Music licensing and sync rights"
                                            usage="12 times"
                                        />
                                        <ContractTemplateCard 
                                            title="Recording Contract" 
                                            icon={FileText} 
                                            description="Studio recording agreements"
                                            usage="6 times"
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
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="text-studio-accent" size={20} />
                                            Recent Contracts
                                        </CardTitle>
                                        <div className="relative w-64">
                                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-studio-muted"/>
                                            <input 
                                                placeholder="Search contracts..." 
                                                className="w-full glass-card border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-studio-charcoal placeholder:text-studio-muted focus:outline-none focus:ring-2 focus:ring-studio-accent/50 backdrop-blur-md"
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <ContractListItem 
                                            name="Performance at The Fillmore" 
                                            status="Signed" 
                                            date="Nov 1, 2024"
                                            type="Performance"
                                            value="$2,500"
                                        />
                                        <ContractListItem 
                                            name="Collaboration with PixelDreamer" 
                                            status="Draft" 
                                            date="Oct 28, 2024"
                                            type="Collaboration"
                                            value="50/50 Split"
                                        />
                                        <ContractListItem 
                                            name="Sync License for 'Indie Spirit'" 
                                            status="Negotiating" 
                                            date="Oct 25, 2024"
                                            type="Licensing"
                                            value="$1,200"
                                        />
                                        <ContractListItem 
                                            name="Management Agreement - Q4" 
                                            status="Under Review" 
                                            date="Oct 20, 2024"
                                            type="Management"
                                            value="15% Commission"
                                        />
                                        <ContractListItem 
                                            name="Recording Studio Contract" 
                                            status="Signed" 
                                            date="Oct 15, 2024"
                                            type="Recording"
                                            value="$800/day"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right Column - Agent Settings & Analytics */}
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
                                            <Label className="font-medium text-studio-charcoal">Auto-Generate Clauses</Label>
                                            <p className="text-xs text-studio-muted mt-1">AI-powered legal clause suggestions</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                                        <div>
                                            <Label className="font-medium text-studio-charcoal">Compliance Checking</Label>
                                            <p className="text-xs text-studio-muted mt-1">Automatic legal compliance verification</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-medium text-studio-charcoal">Default Contract Terms</Label>
                                        <select className="w-full glass-card border border-white/10 rounded-lg p-3 text-studio-charcoal backdrop-blur-md">
                                            <option value="standard">Standard Terms</option>
                                            <option value="artist-friendly" selected>Artist-Friendly</option>
                                            <option value="strict">Strict Protection</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-medium text-studio-charcoal">Jurisdiction</Label>
                                        <select className="w-full glass-card border border-white/10 rounded-lg p-3 text-studio-charcoal backdrop-blur-md">
                                            <option value="us" selected>United States</option>
                                            <option value="uk">United Kingdom</option>
                                            <option value="eu">European Union</option>
                                            <option value="ca">Canada</option>
                                        </select>
                                    </div>

                                    <Button className="w-full bg-studio-accent hover:bg-studio-accent/90 shadow-lg">
                                        Save Preferences
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
                                        <Shield className="text-studio-accent" size={20} />
                                        Legal Insights
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <h4 className="font-medium text-green-800 mb-2">Compliance Status</h4>
                                        <p className="text-sm text-green-700">All contracts meet current legal standards</p>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-xs text-green-600">Last updated: Today</span>
                                            <span className="text-sm font-bold text-green-800">98% Score</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-medium text-studio-charcoal">Recent Activity</h4>
                                        <div className="space-y-2">
                                            <ActivityItem 
                                                action="Contract generated"
                                                details="Performance Agreement template"
                                                time="2 hours ago"
                                                type="create"
                                            />
                                            <ActivityItem 
                                                action="Signature received"
                                                details="The Fillmore contract"
                                                time="1 day ago"
                                                type="signature"
                                            />
                                            <ActivityItem 
                                                action="Compliance check"
                                                details="All contracts reviewed"
                                                time="3 days ago"
                                                type="review"
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
                        {trendValue} from last month
                    </p>
                )}
            </div>
            <div className={`bg-${accent}-500/20 p-3 rounded-full`}>
                <Icon className={`text-${accent}-600`} size={20} />
            </div>
        </div>
    </motion.div>
);

const ContractTemplateCard = ({ title, icon: Icon, description, usage }) => (
    <motion.div 
        whileHover={{ scale: 1.05, y: -4 }}
        className="p-6 bg-white/50 border border-studio-sand/30 rounded-xl text-center cursor-pointer hover:shadow-lg transition-all duration-300 group"
    >
        <div className="w-16 h-16 rounded-xl bg-studio-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-studio-accent/30 transition-colors">
            <Icon size={28} className="text-studio-accent"/>
        </div>
        <h4 className="font-semibold text-studio-charcoal mb-2">{title}</h4>
        <p className="text-xs text-studio-muted mb-3 leading-relaxed">{description}</p>
        <div className="flex items-center justify-between">
            <span className="text-xs bg-studio-accent/10 text-studio-accent px-2 py-1 rounded-full">
                Used {usage}
            </span>
            <Button size="sm" className="bg-studio-accent hover:bg-studio-accent/90 text-white">
                Use Template
            </Button>
        </div>
    </motion.div>
);

const ContractListItem = ({ name, status, date, type, value }) => {
    const statusStyles = {
        'Signed': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-800' },
        'Draft': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' },
        'Negotiating': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
        'Under Review': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-800' }
    };

    const statusConfig = statusStyles[status];

    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`p-4 border rounded-xl transition-all duration-300 ${statusConfig.bg} ${statusConfig.border}`}
        >
            <div className="flex justify-between items-start">
                <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-studio-charcoal">{name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusConfig.badge}`}>
                            {status}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-studio-muted">
                        <span>{type}</span>
                        <span>•</span>
                        <span>Last updated: {date}</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-studio-charcoal">{value}</p>
                    <Button size="sm" variant="outline" className="mt-2 bg-white/80 border-studio-sand/50">
                        View Details
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

const ActivityItem = ({ action, details, time, type }) => {
    const typeStyles = {
        'create': 'bg-blue-500',
        'signature': 'bg-green-500',
        'review': 'bg-purple-500'
    };

    return (
        <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${typeStyles[type]}`}></div>
            <div className="flex-grow">
                <p className="text-sm font-medium text-studio-charcoal">{action}</p>
                <p className="text-xs text-studio-muted">{details}</p>
            </div>
            <span className="text-xs text-studio-muted">{time}</span>
        </div>
    );
};

export default ContractAgent;