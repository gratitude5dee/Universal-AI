import React, { useState } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { motion } from 'framer-motion';
import { DollarSign, FileText, Clock, AlertTriangle, Send, Bot, Activity, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const InvoiceAgent = () => {
    const [activeTab, setActiveTab] = useState("overdue");

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
                                <DollarSign className="h-6 w-6 text-studio-accent" />
                            </motion.div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold text-studio-charcoal">AI Invoice Agent</h1>
                            <p className="text-studio-muted mt-1">Ensure timely payments with automated invoice tracking and intelligent reminders</p>
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
                    <StatsCard title="Total Outstanding" value="$12,450" icon={DollarSign} accent="red" />
                    <StatsCard title="Overdue Invoices" value="3" icon={AlertTriangle} accent="orange" />
                    <StatsCard title="Avg. Payment Time" value="18 Days" icon={Clock} accent="blue" />
                    <StatsCard title="Collected (30d)" value="$25,800" icon={FileText} trend="up" trendValue="+20%" accent="green" />
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Invoice Management */}
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
                                            <FileText className="text-studio-accent" size={20} />
                                            Invoice Management
                                        </CardTitle>
                                        <Button className="bg-studio-accent hover:bg-studio-accent/90 text-white">
                                            Create Invoice
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                                        <TabsList className="bg-white/80 backdrop-blur-md border border-studio-sand/30 rounded-xl p-2">
                                            <TabsTrigger 
                                                value="overdue" 
                                                className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-700"
                                            >
                                                Overdue (3)
                                            </TabsTrigger>
                                            <TabsTrigger 
                                                value="pending"
                                                className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-700"
                                            >
                                                Pending (5)
                                            </TabsTrigger>
                                            <TabsTrigger 
                                                value="paid"
                                                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-700"
                                            >
                                                Recently Paid (12)
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="overdue" className="mt-6">
                                            <InvoiceList type="overdue" />
                                        </TabsContent>
                                        <TabsContent value="pending" className="mt-6">
                                            <InvoiceList type="pending" />
                                        </TabsContent>
                                        <TabsContent value="paid" className="mt-6">
                                            <InvoiceList type="paid" />
                                        </TabsContent>
                                    </Tabs>
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
                                        <Bot className="text-studio-accent" size={20} />
                                        Automation Rules
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <AutomationRule 
                                        description="Send reminder 3 days before due date" 
                                        enabled={true}
                                        type="reminder"
                                    />
                                    <AutomationRule 
                                        description="Send follow-up 7 days after due date" 
                                        enabled={true}
                                        type="followup"
                                    />
                                    <AutomationRule 
                                        description="Automatically escalate after 30 days overdue" 
                                        enabled={false}
                                        type="escalation"
                                    />
                                    <AutomationRule 
                                        description="Generate late fee after 15 days overdue" 
                                        enabled={true}
                                        type="fee"
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right Column - Agent Controls */}
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
                                        Agent Configuration
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                                        <div>
                                            <Label className="font-medium text-studio-charcoal">Auto-Send Reminders</Label>
                                            <p className="text-xs text-studio-muted mt-1">Automatically send payment reminders</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                                        <div>
                                            <Label className="font-medium text-studio-charcoal">Late Fee Calculation</Label>
                                            <p className="text-xs text-studio-muted mt-1">Apply late fees to overdue invoices</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-medium text-studio-charcoal">Payment Terms (Days)</Label>
                                        <select className="w-full bg-white/50 border border-studio-sand/50 rounded-lg p-3 text-studio-charcoal">
                                            <option value="15">Net 15</option>
                                            <option value="30" selected>Net 30</option>
                                            <option value="45">Net 45</option>
                                            <option value="60">Net 60</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-medium text-studio-charcoal">Late Fee Rate (%)</Label>
                                        <input 
                                            type="number" 
                                            defaultValue="1.5" 
                                            step="0.1"
                                            className="w-full bg-white/50 border border-studio-sand/50 rounded-lg p-3 text-studio-charcoal"
                                        />
                                    </div>

                                    <Button className="w-full bg-studio-accent hover:bg-studio-accent/90 shadow-lg">
                                        Save Configuration
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
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <ActivityItem 
                                            action="Reminder sent"
                                            target="Synthwave Fest"
                                            time="2 hours ago"
                                            type="reminder"
                                        />
                                        <ActivityItem 
                                            action="Invoice created"
                                            target="Club Neon"
                                            time="1 day ago"
                                            type="create"
                                        />
                                        <ActivityItem 
                                            action="Payment received"
                                            target="$1,200 from Radio Station"
                                            time="3 days ago"
                                            type="payment"
                                        />
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

const InvoiceList = ({ type }) => {
    const statusConfig = {
        overdue: { 
            color: 'red', 
            text: 'Overdue',
            invoices: [
                { id: 'INV-001', client: 'Synthwave Fest', amount: 5000, due: '3 days ago' },
                { id: 'INV-002', client: 'Digital Dreams', amount: 2800, due: '7 days ago' },
                { id: 'INV-003', client: 'Neon Nights', amount: 1500, due: '12 days ago' }
            ]
        },
        pending: { 
            color: 'yellow', 
            text: 'Pending',
            invoices: [
                { id: 'INV-004', client: 'Club Neon', amount: 2500, due: 'in 5 days' },
                { id: 'INV-005', client: 'Cyber Lounge', amount: 3200, due: 'in 12 days' },
                { id: 'INV-006', client: 'Future Beats', amount: 1800, due: 'in 18 days' }
            ]
        },
        paid: { 
            color: 'green', 
            text: 'Paid',
            invoices: [
                { id: 'INV-007', client: 'Midnight Drive Radio', amount: 1200, due: '2 days ago' },
                { id: 'INV-008', client: 'Retro Wave Studio', amount: 4500, due: '5 days ago' },
                { id: 'INV-009', client: 'Electric Pulse', amount: 2200, due: '8 days ago' }
            ]
        }
    };

    const config = statusConfig[type];

    return (
        <div className="space-y-3">
            {config.invoices.map(invoice => (
                <motion.div 
                    key={invoice.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 border rounded-xl transition-all duration-300 
                        ${type === 'overdue' ? 'bg-red-50 border-red-200' : 
                          type === 'pending' ? 'bg-yellow-50 border-yellow-200' : 
                          'bg-green-50 border-green-200'}`}
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-studio-charcoal">{invoice.client}</p>
                            <p className="text-sm text-studio-muted">Invoice #{invoice.id} • Due {invoice.due}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-studio-charcoal">${invoice.amount.toLocaleString()}</p>
                            <span className={`text-xs px-2 py-1 rounded-full 
                                bg-${config.color}-500/20 text-${config.color}-700`}>
                                {config.text}
                            </span>
                        </div>
                        {type !== 'paid' && (
                            <Button size="sm" variant="outline" className="ml-4 bg-white/80 border-studio-sand/50">
                                <Send size={14} className="mr-1" /> Send Reminder
                            </Button>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const AutomationRule = ({ description, enabled, type }) => {
    const typeStyles = {
        reminder: 'bg-blue-50 border-blue-200',
        followup: 'bg-yellow-50 border-yellow-200',
        escalation: 'bg-red-50 border-red-200',
        fee: 'bg-purple-50 border-purple-200'
    };

    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`p-4 border rounded-xl transition-all duration-300 ${typeStyles[type]}`}
        >
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-studio-charcoal">{description}</p>
                <div className={`px-3 py-1 text-xs rounded-full font-medium ${
                    enabled ? 'bg-green-500/20 text-green-700' : 'bg-gray-500/20 text-gray-700'
                }`}>
                    {enabled ? 'Active' : 'Disabled'}
                </div>
            </div>
        </motion.div>
    );
};

const ActivityItem = ({ action, target, time, type }) => {
    const typeStyles = {
        reminder: 'text-blue-600',
        create: 'text-green-600',
        payment: 'text-purple-600'
    };

    return (
        <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${
                type === 'reminder' ? 'bg-blue-500' :
                type === 'create' ? 'bg-green-500' : 'bg-purple-500'
            }`}></div>
            <div className="flex-grow">
                <p className={`text-sm font-medium ${typeStyles[type]}`}>{action}</p>
                <p className="text-xs text-studio-muted">{target}</p>
            </div>
            <span className="text-xs text-studio-muted">{time}</span>
        </div>
    );
};

export default InvoiceAgent;