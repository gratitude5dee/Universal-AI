import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReportExportRow {
  id: string;
  report_type: string;
  status: string;
  report_payload: Record<string, unknown>;
  created_at: string;
}

const reportTypes = [
  { id: 'profit-loss', label: 'Profit & Loss (P&L)' },
  { id: 'tax-summary', label: 'Tax Summary (CSV)' },
  { id: 'revenue-by-source', label: 'Revenue by Source' },
];

const FinancialReports = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState('profit-loss');

  const { data: reports = [] } = useQuery({
    queryKey: ['report-exports'],
    queryFn: async (): Promise<ReportExportRow[]> => {
      const { data, error } = await supabase
        .from('report_exports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data ?? []) as ReportExportRow[];
    },
  });

  const latestReport = reports[0];

  const handleGenerate = async (reportType: string) => {
    try {
      const { error } = await supabase.functions.invoke('report-export', {
        body: { reportType },
      });

      if (error) {
        throw error;
      }

      setSelectedType(reportType);
      await queryClient.invalidateQueries({ queryKey: ['report-exports'] });
      toast({
        title: 'Report generated',
        description: `${reportType} is ready in report exports.`,
      });
    } catch (error) {
      toast({
        title: 'Report generation failed',
        description: error instanceof Error ? error.message : 'Unknown report export error.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10">
      <CardHeader><CardTitle className="text-white">Accounting & Reports</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <p className="text-white/70">Generate and inspect accounting exports backed by the new finance rollups.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTypes.map((reportType) => (
            <Button
              key={reportType.id}
              variant="outline"
              className="justify-start bg-white/10 border-white/20 text-white hover:bg-white/20 h-12"
              onClick={() => handleGenerate(reportType.id)}
            >
              <FileDown className="mr-2" />
              {reportType.label}
            </Button>
          ))}
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          {latestReport ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{latestReport.report_type}</p>
                  <p className="text-sm text-white/60">{new Date(latestReport.created_at).toLocaleString()}</p>
                </div>
                <p className="text-sm text-white/60">{latestReport.status}</p>
              </div>
              <pre className="overflow-auto rounded bg-black/30 p-4 text-xs text-white/80">
                {JSON.stringify(latestReport.report_payload, null, 2)}
              </pre>
            </>
          ) : (
            <p className="text-white/70">No reports generated yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialReports;
