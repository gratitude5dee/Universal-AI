import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SplitSheetRow {
  id: string;
  title: string;
  primary_artist: string | null;
  status: string;
  split_sheet_members?: Array<{
    id: string;
    member_name: string;
    role: string | null;
    split_basis_points: number;
  }>;
}

const SplitSheets = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: splitSheets = [] } = useQuery({
    queryKey: ['split-sheets'],
    queryFn: async (): Promise<SplitSheetRow[]> => {
      const { data, error } = await supabase
        .from('split_sheets')
        .select(`
          id,
          title,
          primary_artist,
          status,
          split_sheet_members(
            id,
            member_name,
            role,
            split_basis_points
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data ?? []) as SplitSheetRow[];
    },
  });

  const handleCreate = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        throw authError ?? new Error('You must be signed in to create a split sheet');
      }

      const { data, error } = await supabase
        .from('split_sheets')
        .insert({
          creator_id: authData.user.id,
          title: `Untitled Split Sheet ${new Date().toLocaleDateString()}`,
          status: 'draft',
        })
        .select('id')
        .single();

      if (error || !data) {
        throw error ?? new Error('Split sheet was not created');
      }

      await queryClient.invalidateQueries({ queryKey: ['split-sheets'] });
      toast({
        title: 'Split sheet created',
        description: 'Add collaborators and percentages when ready.',
      });
    } catch (error) {
      toast({
        title: 'Unable to create split sheet',
        description: error instanceof Error ? error.message : 'Unknown split sheet error.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Split Sheets</CardTitle>
          <p className="text-sm text-white/70">Canonical royalty allocations for collaborators and payouts.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleCreate}>
          <Plus size={16} className="mr-2" />
          Create Split Sheet
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {splitSheets.map((sheet) => (
          <div key={sheet.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-white">{sheet.title}</h4>
                <p className="text-sm text-white/70">by {sheet.primary_artist ?? 'Primary artist not set'}</p>
              </div>
              <Badge variant="default">{sheet.status}</Badge>
            </div>
            <div className="space-y-3">
              {(sheet.split_sheet_members ?? []).length ? (
                sheet.split_sheet_members?.map((member) => (
                  <div key={member.id} className="flex justify-between items-center text-sm">
                    <p className="text-white/80">
                      {member.member_name} <span className="text-white/60">({member.role ?? 'Contributor'})</span>
                    </p>
                    <p className="font-mono font-semibold text-white">{(member.split_basis_points / 100).toFixed(2)}%</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/60">No collaborators added yet.</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SplitSheets;
