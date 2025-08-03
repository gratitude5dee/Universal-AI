import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

const FinancialReports = () => (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10">
        <CardHeader><CardTitle className="text-white">Accounting & Reports</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            <p className="text-white/70">Generate and download financial reports for accounting and tax purposes.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <FileDown className="mr-2 h-4 w-4" /> Profit & Loss (P&L)
                </Button>
                <Button variant="outline" className="justify-start bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <FileDown className="mr-2 h-4 w-4" /> Tax Summary (CSV)
                </Button>
                <Button variant="outline" className="justify-start bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <FileDown className="mr-2 h-4 w-4" /> Revenue by Source
                </Button>
            </div>
            <div className="p-4 mt-4 border border-dashed border-white/30 rounded-lg text-center">
                <p className="text-white/70">Report preview will be generated here.</p>
            </div>
        </CardContent>
    </Card>
);

export default FinancialReports;