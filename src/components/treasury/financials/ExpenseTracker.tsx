import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { expenseData } from './financialsData';
import { formatCurrency } from './types';
import PayrollManager from './PayrollManager';

const expenseCategories = { Payroll: '#8884d8', Marketing: '#82ca9d', Production: '#ffc658', Travel: '#ff8042', Software: '#00C49F'};

const ExpenseTracker = () => {
    const pieData = Object.entries(
        expenseData.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card className="bg-white/5 backdrop-blur-md border border-white/10 h-full">
                        <CardHeader><CardTitle className="text-white">Expense Breakdown</CardTitle></CardHeader>
                        <CardContent className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={expenseCategories[entry.name]} />)}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value as number)}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                   <PayrollManager />
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracker;