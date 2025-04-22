
import { Buffer } from 'buffer';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import { AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { WalletProvider } from "@/context/WalletContext";
import { ProtectedRoute } from "@/components/ui/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";

// Import all page components
import Home from "./pages/Index";
import Gallery from "./pages/Gallery";
import CreateAgent from "./pages/CreateAgent";
import Collection from "./pages/Collection";
import AgentMarketplace from "./pages/AgentMarketplace";
import TreasureVault from "./pages/TreasureVault";
import RightsManagement from "./pages/RightsManagement";
import Bridge from "./pages/Bridge";
import Analytics from "./pages/Analytics";
import MarketplaceLaunch from "./pages/MarketplaceLaunch";
import Observability from "./pages/Observability";
import ThreadOfLife from "./pages/ThreadOfLife";
import Distribution from "./pages/distribution/Distribution";
import WzrdStudio from "./pages/wzrd/WzrdStudio";
import WzrdLibrary from "./pages/wzrd/WzrdLibrary";
import WzrdResearch from "./pages/wzrd/WzrdResearch";
import WzrdPodcasts from "./pages/wzrd/WzrdPodcasts";
import WzrdInfiniteLibrary from "./pages/wzrd/WzrdInfiniteLibrary";
import WzrdCompanions from "./pages/wzrd/WzrdCompanions";

// Conditionally import Crossmint only if we have a valid API key
let CrossmintProvider: any;
let CrossmintAuthProvider: any;
try {
  const crossmint = require("@crossmint/client-sdk-react-ui");
  CrossmintProvider = crossmint.CrossmintProvider;
  CrossmintAuthProvider = crossmint.CrossmintAuthProvider;
} catch (e) {
  // Create dummy components if Crossmint isn't available
  CrossmintProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  CrossmintAuthProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
}

window.Buffer = Buffer;

const queryClient = new QueryClient();

// Validate if the API key has the correct format
const isCrossmintKeyValid = () => {
  const key = import.meta.env.VITE_CROSSMINT_CLIENT_KEY || "";
  // A valid Crossmint API key starts with "ck_" and contains development/staging/production
  return key && (key.includes("development") || key.includes("staging") || key.includes("production"));
};

// We'll use this to bypass authentication when Crossmint isn't properly configured
const hasCrossmintConfig = isCrossmintKeyValid();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        {hasCrossmintConfig ? (
          <CrossmintProvider apiKey={import.meta.env.VITE_CROSSMINT_CLIENT_KEY || ""}>
            <CrossmintAuthProvider loginMethods={["email", "farcaster"]}>
              <WalletProvider>
                <AppContent />
              </WalletProvider>
            </CrossmintAuthProvider>
          </CrossmintProvider>
        ) : (
          <AuthProvider>
            <WalletProvider>
              <AppContent bypassAuth={true} />
            </WalletProvider>
          </AuthProvider>
        )}
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

function AppContent({ bypassAuth = false }: { bypassAuth?: boolean }) {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <AnimatePresence mode="wait">
          <Routes>
            {/* New landing page as the root route */}
            <Route path="/" element={<Landing />} />
            
            {/* Move original Index to /index route */}
            <Route path="/index" element={<Index />} />

            {/* Dashboard and protected routes */}
            <Route path="/home" element={bypassAuth ? <Home /> : <ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/gallery" element={bypassAuth ? <Gallery /> : <ProtectedRoute><Gallery /></ProtectedRoute>} />
            <Route path="/create-agent" element={bypassAuth ? <CreateAgent /> : <ProtectedRoute><CreateAgent /></ProtectedRoute>} />
            <Route path="/collection" element={bypassAuth ? <Collection /> : <ProtectedRoute><Collection /></ProtectedRoute>} />
            <Route path="/agent-marketplace" element={bypassAuth ? <AgentMarketplace /> : <ProtectedRoute><AgentMarketplace /></ProtectedRoute>} />
            <Route path="/treasury" element={bypassAuth ? <TreasureVault /> : <ProtectedRoute><TreasureVault /></ProtectedRoute>} />
            <Route path="/rights" element={bypassAuth ? <RightsManagement /> : <ProtectedRoute><RightsManagement /></ProtectedRoute>} />
            <Route path="/bridge" element={bypassAuth ? <Bridge /> : <ProtectedRoute><Bridge /></ProtectedRoute>} />
            <Route path="/analytics" element={bypassAuth ? <Analytics /> : <ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/marketplace-launch" element={bypassAuth ? <MarketplaceLaunch /> : <ProtectedRoute><MarketplaceLaunch /></ProtectedRoute>} />
            <Route path="/observability" element={bypassAuth ? <Observability /> : <ProtectedRoute><Observability /></ProtectedRoute>} />
            <Route path="/thread-of-life" element={bypassAuth ? <ThreadOfLife /> : <ProtectedRoute><ThreadOfLife /></ProtectedRoute>} />
            <Route path="/distribution/*" element={bypassAuth ? <Distribution /> : <ProtectedRoute><Distribution /></ProtectedRoute>} />
            
            {/* WZRD routes - Some are accessible without auth */}
            <Route path="/wzrd/studio" element={<WzrdStudio />} />
            <Route path="/wzrd/library" element={bypassAuth ? <WzrdLibrary /> : <ProtectedRoute><WzrdLibrary /></ProtectedRoute>} />
            <Route path="/wzrd/research" element={bypassAuth ? <WzrdResearch /> : <ProtectedRoute><WzrdResearch /></ProtectedRoute>} />
            <Route path="/wzrd/podcasts" element={bypassAuth ? <WzrdPodcasts /> : <ProtectedRoute><WzrdPodcasts /></ProtectedRoute>} />
            <Route path="/wzrd/infinite-library" element={bypassAuth ? <WzrdInfiniteLibrary /> : <ProtectedRoute><WzrdInfiniteLibrary /></ProtectedRoute>} />
            <Route path="/wzrd/companions" element={bypassAuth ? <WzrdCompanions /> : <ProtectedRoute><WzrdCompanions /></ProtectedRoute>} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;
