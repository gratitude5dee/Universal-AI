import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { revenueStreamsData } from './financialsData';
import { formatCurrency } from './types';
import DealTracker from './DealTracker';

const RevenueStreamsDashboard = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {revenueStreamsData.map(stream => (
                <Card key={stream.name} className="bg-white/5 backdrop-blur-md border border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/80">{stream.name}</CardTitle>
                        <stream.icon className={`h-4 w-4 ${stream.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{formatCurrency(stream.total)}</div>
                        <p className="text-xs text-white/60">from {stream.transactions.length} sources last month</p>
                    </CardContent>
                </Card>
            ))}
        </div>
        <DealTracker />
    </div>
);

export default RevenueStreamsDashboard;