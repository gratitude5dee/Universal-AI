import React, { useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Upload, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from './types';
import { useToast } from '@/hooks/use-toast';

interface RoyaltySummaryRow {
  id: string;
  source: string;
  artist_name: string | null;
  period_start: string | null;
  period_end: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  discrepancy_count: number;
}

const RoyaltyStatements = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: statements = [] } = useQuery({
    queryKey: ['royalty-statements'],
    queryFn: async (): Promise<RoyaltySummaryRow[]> => {
      const { data, error } = await supabase
        .from('royalty_statement_summary_v1')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data ?? []) as RoyaltySummaryRow[];
    },
  });

  const hasDiscrepancy = statements.some((statement) => Number(statement.discrepancy_count ?? 0) > 0);

  const getStatusVariant = (status: string) => {
    if (status === 'parsed') return 'default';
    if (status === 'discrepancy' || status === 'failed') return 'destructive';
    return 'secondary';
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileText = await file.text();
      const source = file.name.replace(/\.[^.]+$/, '');
      const { error } = await supabase.functions.invoke('royalty-ingest', {
        body: {
          source,
          fileText,
        },
      });

      if (error) {
        throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['royalty-statements'] });
      toast({
        title: 'Royalty statement ingested',
        description: `${file.name} has been queued and parsed.`,
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unknown royalty ingest error.',
        variant: 'destructive',
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      {hasDiscrepancy && (
        <div className="bg-white/5 backdrop-blur-md border border-yellow-400/50 p-4 rounded-lg flex items-center gap-4">
          <AlertTriangle className="h-6 w-6 text-yellow-400" />
          <div>
            <h4 className="font-semibold text-white">Discrepancies Detected</h4>
            <p className="text-sm text-white/70">One or more statement lines diverge from expected revenue.</p>
          </div>
          <Button variant="outline" className="ml-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
            Review Discrepancies
          </Button>
        </div>
      )}
      <Card className="bg-white/5 backdrop-blur-md border border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Royalty Statements</CardTitle>
            <p className="text-sm text-white/70">Upload, parse, and reconcile royalty statements from all sources.</p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={handleUpload}
            />
            <Button className="bg-primary hover:bg-primary/90" onClick={() => fileInputRef.current?.click()}>
              <Upload size={16} className="mr-2" />
              Upload Statement
            </Button>
          </div>
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
                <TableHead className="text-white/70">Uploaded</TableHead>
                <TableHead className="text-white/70">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statements.map((statement) => (
                <TableRow key={statement.id}>
                  <TableCell className="text-white">{statement.source}</TableCell>
                  <TableCell className="text-white">{statement.artist_name ?? 'Unknown artist'}</TableCell>
                  <TableCell className="text-white">
                    {statement.period_start && statement.period_end
                      ? `${statement.period_start} to ${statement.period_end}`
                      : 'Not specified'}
                  </TableCell>
                  <TableCell className="text-white">{formatCurrency(Number(statement.total_amount ?? 0))}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(statement.status)}>
                      {statement.status}
                      {statement.discrepancy_count ? ` (${statement.discrepancy_count})` : ''}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white">{new Date(statement.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                      <Eye size={16} />
                    </Button>
                  </TableCell>
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
