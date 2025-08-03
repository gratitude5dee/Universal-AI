import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const Forecasting = () => (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10">
        <CardHeader>
            <CardTitle className="text-white">AI Revenue Forecasting</CardTitle>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">
            <div className="text-center text-white/70">
                <TrendingUp size={48} className="mx-auto mb-4"/>
                <p>Forecasting models are learning from your data.</p>
                <p>Check back soon for projections.</p>
            </div>
        </CardContent>
    </Card>
);

export default Forecasting;