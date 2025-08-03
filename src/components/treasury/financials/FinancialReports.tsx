import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

const FinancialReports = () => (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10">
        <CardHeader><CardTitle className="text-white">Accounting & Reports</CardTitle></CardHeader>
        <CardContent className="space-y-6">
            <p className="text-white/70">Generate and download financial reports for business management and tax preparation.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start bg-white/10 border-white/20 text-white hover:bg-white/20 h-12"><FileDown className="mr-2"/> Profit & Loss (P&L)</Button>
                <Button variant="outline" className="justify-start bg-white/10 border-white/20 text-white hover:bg-white/20 h-12"><FileDown className="mr-2"/> Tax Summary (CSV)</Button>
                <Button variant="outline" className="justify-start bg-white/10 border-white/20 text-white hover:bg-white/20 h-12"><FileDown className="mr-2"/> Revenue by Source</Button>
            </div>
             <div className="flex items-end gap-4">
                <div className="flex-1">
                    <label className="text-sm text-white/70">Date Range</label>
                    <div className="flex gap-2 mt-1">
                        <input type="date" className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"/>
                        <input type="date" className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"/>
                    </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90">Generate Report</Button>
            </div>
            <div className="p-8 mt-4 border border-dashed border-white/30 rounded-lg text-center bg-white/5">
                <p className="text-white/70">Report preview will be generated here.</p>
            </div>
        </CardContent>
    </Card>
);

export default FinancialReports;