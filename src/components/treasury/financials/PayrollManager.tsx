import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { payrollData } from './financialsData';
import { User } from 'lucide-react';

const PayrollManager = () => (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 h-full">
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="text-white">Payroll</CardTitle>
                <Button className="bg-primary hover:bg-primary/90">Run Payroll</Button>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            {payrollData.map(member => (
                <div key={member.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-lg flex justify-between items-center">
                    <div className="flex items-center">
                        <User className="w-5 h-5 mr-3 text-white/70"/>
                        <div>
                            <p className="font-semibold text-white">{member.name}</p>
                            <p className="text-xs text-white/70">{member.role}</p>
                        </div>
                    </div>
                    <div>
                        <p className="font-medium text-white text-right">{member.rate}</p>
                        <p className="text-xs text-white/70 text-right">Next: {member.nextPayment}</p>
                    </div>
                </div>
            ))}
        </CardContent>
    </Card>
);

export default PayrollManager;