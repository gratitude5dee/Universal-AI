import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { History, RotateCcw, Eye } from "lucide-react";
import { format } from "date-fns";

interface DesignVersion {
  id: string;
  design_id: string;
  version_number: number;
  design_image_url: string;
  canvas_data: any;
  changes_description: string;
  created_at: string;
  created_by: string;
}

interface DesignVersionHistoryProps {
  designId?: string;
  onRestoreVersion?: (versionData: any) => void;
}

export const DesignVersionHistory = ({ designId, onRestoreVersion }: DesignVersionHistoryProps) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: versions, isLoading } = useQuery({
    queryKey: ['design-versions', designId],
    queryFn: async () => {
      if (!designId) return [];
      
      const { data, error } = await supabase
        .from('design_versions')
        .select('*')
        .eq('design_id', designId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return data as DesignVersion[];
    },
    enabled: !!designId,
  });

  const handleRestore = async (version: DesignVersion) => {
    try {
      // Create a new version based on the restored one
      const { error } = await supabase
        .from('design_versions')
        .insert({
          design_id: version.design_id,
          version_number: (versions?.[0]?.version_number || 0) + 1,
          design_image_url: version.design_image_url,
          canvas_data: version.canvas_data,
          changes_description: `Restored from version ${version.version_number}`,
        });

      if (error) throw error;

      onRestoreVersion?.(version);

      toast({
        title: "Version Restored",
        description: `Successfully restored version ${version.version_number}`,
      });
    } catch (error) {
      console.error('Restore error:', error);
      toast({
        title: "Restore Failed",
        description: "Failed to restore version",
        variant: "destructive",
      });
    }
  };

  if (!designId) {
    return (
      <Card className="backdrop-blur-md bg-white/10 border-white/20">
        <CardContent className="py-6">
          <p className="text-center text-white/70">Select a design to view version history</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <History className="h-5 w-5" />
          Version History
        </CardTitle>
        <CardDescription className="text-white/70">
          Track and restore previous design versions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-white/70">Loading versions...</p>
        ) : versions && versions.length > 0 ? (
          <div className="space-y-4">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedVersion === version.id
                    ? 'border-studio-accent bg-white/10'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => setSelectedVersion(version.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-studio-accent/20 text-studio-accent border-studio-accent/30">
                        v{version.version_number}
                      </Badge>
                      <span className="text-sm text-white/70">
                        {format(new Date(version.created_at), 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-white">{version.changes_description}</p>
                    {version.design_image_url && (
                      <img
                        src={version.design_image_url}
                        alt={`Version ${version.version_number}`}
                        className="w-32 h-32 object-cover rounded border border-white/20"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(version);
                      }}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(version.design_image_url, '_blank');
                      }}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white/70 py-4">No versions yet</p>
        )}
      </CardContent>
    </Card>
  );
};
