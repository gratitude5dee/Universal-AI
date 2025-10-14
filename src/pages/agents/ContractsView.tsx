import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Download, Send, CheckCircle, Clock, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BookingAgentLayout from "@/layouts/booking-agent-layout";

interface Contract {
  id: string;
  venue_name: string;
  event_date: string;
  status: "draft" | "sent" | "signed" | "declined";
  created_at: string;
  signed_at?: string;
}

const ContractsView = () => {
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Mock data for now - replace with actual contract data when table is created
      setContracts([
        {
          id: "1",
          venue_name: "Blue Note Jazz Club",
          event_date: "2025-03-15",
          status: "signed",
          created_at: "2025-01-10",
          signed_at: "2025-01-15"
        },
        {
          id: "2",
          venue_name: "The Apollo Theater",
          event_date: "2025-04-20",
          status: "sent",
          created_at: "2025-01-20"
        }
      ]);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch contracts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Contract["status"]) => {
    switch (status) {
      case "signed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "sent": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "declined": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: Contract["status"]) => {
    switch (status) {
      case "signed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "sent": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "declined": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredContracts = contracts.filter(contract =>
    contract.venue_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <BookingAgentLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </BookingAgentLayout>
    );
  }

  return (
    <BookingAgentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Contract Management</h2>
            <p className="text-muted-foreground">Track and manage all your venue contracts</p>
          </div>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            New Contract
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contracts by venue name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-card"
          />
        </div>

        {/* Contracts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => (
            <Card key={contract.id} className="glass-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(contract.status)}
                    <CardTitle className="text-lg">{contract.venue_name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(contract.status)}>
                    {contract.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Event Date</span>
                    <span className="text-foreground font-medium">
                      {new Date(contract.event_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span className="text-foreground">
                      {new Date(contract.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {contract.signed_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Signed</span>
                      <span className="text-green-400">
                        {new Date(contract.signed_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                  {contract.status === "draft" && (
                    <Button size="sm" className="flex-1 gap-2">
                      <Send className="h-3 w-3" />
                      Send
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredContracts.length === 0 && (
          <Card className="glass-card border-border">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Contracts Found
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Create your first contract to get started"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </BookingAgentLayout>
  );
};

export default ContractsView;
