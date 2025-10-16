import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { History, RotateCcw, Eye } from "lucide-react";
import { format } from "date-fns";

interface DesignVersionHistoryProps {
  designId?: string;
  onRestoreVersion?: (versionData: any) => void;
}

export const DesignVersionHistory = ({ designId, onRestoreVersion }: DesignVersionHistoryProps) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock versions for now - will be replaced with real data once types are updated
  const mockVersions = designId ? [
    {
      id: '1',
      version_number: 3,
      design_image_url: '',
      changes_description: 'Updated colors and layout',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      version_number: 2,
      design_image_url: '',
      changes_description: 'Adjusted text placement',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      version_number: 1,
      design_image_url: '',
      changes_description: 'Initial design',
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ] : [];

  const handleRestore = (version: any) => {
    onRestoreVersion?.(version);
    toast({
      title: "Version Restored",
      description: `Successfully restored version ${version.version_number}`,
    });
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
        {mockVersions.length > 0 ? (
          <div className="space-y-4">
            {mockVersions.map((version) => (
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
