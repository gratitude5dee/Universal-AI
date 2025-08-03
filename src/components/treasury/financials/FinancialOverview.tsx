import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '@/components/ui/stats-card';
import { DollarSign, TrendingUp, TrendingDown, FilePieChart, Mail, Send, Sparkles } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';

const data = [
  { name: 'Apr', income: 18000, expenses: 12000 },
  { name: 'May', income: 25000, expenses: 15000 },
  { name: 'Jun', income: 22000, expenses: 14000 },
  { name: 'Jul', income: 30881, expenses: 17000 },
];

const FinancialOverview = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Total Revenue (30d)" value="$30,881" icon={DollarSign} trend="up" trendValue="+18.2%" />
            <StatsCard title="Net Income (30d)" value="$13,881" icon={TrendingUp} trend="up" trendValue="+22.5%" />
            <StatsCard title="Expenses (30d)" value="$17,000" icon={TrendingDown} trend="down" trendValue="-5.1%" />
            <StatsCard title="Profit Margin" value="44.9%" icon={FilePieChart} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 h-96">
                <h3 className="text-xl font-semibold mb-4 text-white">Cash Flow (Last 4 Months)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                        <Tooltip wrapperClassName="!bg-black/50 !border-white/20" contentStyle={{background: 'transparent', border: 'none'}} labelStyle={{color: 'white'}}/>
                        <Bar dataKey="income" fill="#22c55e" name="Income" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 flex flex-col">
                 <h3 className="text-xl font-semibold mb-4 text-white">AI Brand Outreach</h3>
                 <p className="text-white/70 text-sm mb-4">Launch an AI-powered cold outreach campaign to find brand partnerships.</p>
                 <div className="space-y-3 mb-4 text-white/80">
                    <div className="flex items-center gap-2 text-sm"><Sparkles size={16} className="text-cyan-400"/> Identifies brand alignment</div>
                    <div className="flex items-center gap-2 text-sm"><Mail size={16} className="text-cyan-400"/> Drafts personalized emails</div>
                    <div className="flex items-center gap-2 text-sm"><Send size={16} className="text-cyan-400"/> Manages follow-ups</div>
                 </div>
                 <Button className="mt-auto w-full bg-primary hover:bg-primary/90">Launch Campaign</Button>
            </div>
        </div>
    </div>
);

export default FinancialOverview;