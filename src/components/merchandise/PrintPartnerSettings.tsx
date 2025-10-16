import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Link2, Check } from "lucide-react";

interface PrintPartnerSettingsProps {
  onConnectionSuccess?: () => void;
}

export const PrintPartnerSettings = ({ onConnectionSuccess }: PrintPartnerSettingsProps) => {
  const [provider, setProvider] = useState<"printful" | "printify">("printful");
  const [apiKey, setApiKey] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('connect-print-partner', {
        body: {
          provider,
          apiKey,
          isEnabled,
        },
      });

      if (error) throw error;

      setIsConnected(true);
      toast({
        title: "Connected Successfully",
        description: `Your ${provider === 'printful' ? 'Printful' : 'Printify'} account is now connected.`,
      });

      onConnectionSuccess?.();
    } catch (error: any) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to print partner",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Link2 className="h-5 w-5" />
          Print Partner Integration
        </CardTitle>
        <CardDescription className="text-white/70">
          Connect to Printful or Printify for automated fulfillment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="provider" className="text-white">Provider</Label>
          <Select value={provider} onValueChange={(value: "printful" | "printify") => setProvider(value)}>
            <SelectTrigger id="provider" className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="printful">Printful</SelectItem>
              <SelectItem value="printify">Printify</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-key" className="text-white">API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder={`Enter your ${provider === 'printful' ? 'Printful' : 'Printify'} API key`}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <p className="text-xs text-white/60">
            Get your API key from your {provider === 'printful' ? 'Printful' : 'Printify'} dashboard
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enabled" className="text-white">Enable Integration</Label>
            <p className="text-xs text-white/60">Auto-send orders to this provider</p>
          </div>
          <Switch
            id="enabled"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
        </div>

        <Button
          onClick={handleConnect}
          disabled={isLoading || isConnected}
          className="w-full bg-studio-accent hover:bg-studio-accent/90 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : isConnected ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Connected
            </>
          ) : (
            <>
              <Link2 className="mr-2 h-4 w-4" />
              Connect to {provider === 'printful' ? 'Printful' : 'Printify'}
            </>
          )}
        </Button>

        {isConnected && (
          <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
            <p className="text-sm text-green-200">
              Your orders will now be automatically sent to {provider === 'printful' ? 'Printful' : 'Printify'} for fulfillment.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
