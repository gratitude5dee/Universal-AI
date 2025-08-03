import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { splitSheetsData } from './financialsData';
import { Badge } from '@/components/ui/badge';

const SplitSheets = () => (
  <Card className="bg-white/5 backdrop-blur-md border border-white/10">
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="text-white">Split Sheets</CardTitle>
        <p className="text-sm text-white/70">Manage collaborative ownership and royalty splits.</p>
      </div>
      <Button className="bg-primary hover:bg-primary/90"><Plus size={16} className="mr-2"/>Create Split Sheet</Button>
    </CardHeader>
    <CardContent>
      {splitSheetsData.map(sheet => (
        <div key={sheet.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-xl font-bold text-white">{sheet.songTitle}</h4>
                    <p className="text-sm text-white/70">by {sheet.primaryArtist}</p>
                </div>
                <Badge variant="default">{sheet.status}</Badge>
            </div>
            <div className="space-y-3">
                {sheet.collaborators.map(c => (
                    <div key={c.name} className="flex justify-between items-center text-sm">
                        <p className="text-white/80">{c.name} <span className="text-white/60">({c.role})</span></p>
                        <p className="font-mono font-semibold text-white">{c.split}%</p>
                    </div>
                ))}
            </div>
            <div className="flex gap-3 mt-6">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Edit</Button>
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">Download</Button>
            </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default SplitSheets;