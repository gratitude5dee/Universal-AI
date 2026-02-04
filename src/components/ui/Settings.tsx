
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, User } from "lucide-react";
import { SettingsIcon } from "@/components/ui/icons";
import { supabase } from "@/integrations/supabase/client";
import { useAuth as useAppAuth } from "@/context/AuthContext";
import { useEvmWallet } from "@/context/EvmWalletContext";
import { ConnectWalletButton } from "@/components/web3/ConnectWalletButton";

export const Settings = () => {
  const [open, setOpen] = React.useState(false);
  const { user } = useAppAuth();
  const { address, chainMeta } = useEvmWallet();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setOpen(false);
      navigate('/', { replace: true });
      toast("Success", {
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast("Error", {
        description: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="h-5 w-5" isGlowing={false} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {user && (
            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="bg-studio-accent h-10 w-10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.email || "Authenticated User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.id}
                </p>
              </div>
            </div>
          )}

          {/* Wallet section */}
          <div className="p-3 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Wallet</p>
                <p className="text-xs text-muted-foreground">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}${chainMeta ? ` • ${chainMeta.name}` : ""}` : "Not connected"}
                </p>
              </div>
            </div>
            <div className="[&_button]:!w-full [&_button]:!h-10 [&_button]:!rounded-lg">
              <ConnectWalletButton />
            </div>
          </div>
          
          {user && (
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center space-x-2 text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
