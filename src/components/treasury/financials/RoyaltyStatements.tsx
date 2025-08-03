import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Upload, Eye } from 'lucide-react';
import { royaltyStatementsData } from './financialsData';
import { formatCurrency } from './types';

const RoyaltyStatements = () => {
  const hasDiscrepancy = royaltyStatementsData.some(s => s.status === 'discrepancy');

  const getStatusVariant = (status: string) => {
    if (status === 'processed') return 'default';
    if (status === 'discrepancy') return 'destructive';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      {hasDiscrepancy && (
        <div className="bg-white/5 backdrop-blur-md border border-yellow-400/50 p-4 rounded-lg flex items-center gap-4">
          <AlertTriangle className="h-6 w-6 text-yellow-400" />
          <div>
            <h4 className="font-semibold text-white">Discrepancies Detected</h4>
            <p className="text-sm text-white/70">AI has detected potential issues with 1 royalty statement(s).</p>
          </div>
          <Button variant="outline" className="ml-auto bg-white/10 border-white/20 text-white hover:bg-white/20">Review Discrepancies</Button>
        </div>
      )}
      <Card className="bg-white/5 backdrop-blur-md border border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
              <CardTitle className="text-white">Royalty Statements</CardTitle>
              <p className="text-sm text-white/70">Upload and manage royalty statements from all sources.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90"><Upload size={16} className="mr-2"/>Upload Statement</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white/70">Source</TableHead>
                <TableHead className="text-white/70">Artist</TableHead>
                <TableHead className="text-white/70">Period</TableHead>
                <TableHead className="text-white/70">Amount</TableHead>
                <TableHead className="text-white/70">Status</TableHead>
                <TableHead className="text-white/70">Upload Date</TableHead>
                <TableHead className="text-white/70">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {royaltyStatementsData.map(statement => (
                <TableRow key={statement.id}>
                  <TableCell className="text-white">{statement.source}</TableCell>
                  <TableCell className="text-white">{statement.artist}</TableCell>
                  <TableCell className="text-white">{statement.period}</TableCell>
                  <TableCell className="text-white">{formatCurrency(statement.amount)}</TableCell>
                  <TableCell><Badge variant={getStatusVariant(statement.status)}>{statement.status}</Badge></TableCell>
                  <TableCell className="text-white">{statement.uploadDate}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10"><Eye size={16}/></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoyaltyStatements;