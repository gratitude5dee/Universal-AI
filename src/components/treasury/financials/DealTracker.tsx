import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dealData } from './financialsData';
import { formatCurrency } from './types';

const DealTracker = () => (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10">
        <CardHeader><CardTitle className="text-white">Sync & Brand Deals</CardTitle></CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-white/70">Project</TableHead>
                        <TableHead className="text-white/70">Type</TableHead>
                        <TableHead className="text-white/70">Amount</TableHead>
                        <TableHead className="text-white/70">Status</TableHead>
                        <TableHead className="text-white/70">Due Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dealData.map(deal => (
                        <TableRow key={deal.id}>
                            <TableCell className="text-white">{deal.project}</TableCell>
                            <TableCell className="text-white/80">{deal.type}</TableCell>
                            <TableCell className="text-white font-medium">{formatCurrency(deal.amount)}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    deal.status === 'Paid' ? 'bg-green-400/20 text-green-400' :
                                    deal.status === 'Pending' ? 'bg-yellow-400/20 text-yellow-400' :
                                    'bg-orange-400/20 text-orange-400'
                                }`}>
                                    {deal.status}
                                </span>
                            </TableCell>
                            <TableCell className="text-white/80">{deal.dueDate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

export default DealTracker;