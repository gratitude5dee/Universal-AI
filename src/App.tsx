
import { Buffer } from 'buffer';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import FYILanding from "./pages/FYILanding";
import { AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { WalletProvider } from "@/context/WalletContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ui/ProtectedRoute";

// Import all page components
import Home from "./pages/ArtistHome";
import AssetLibrary from "./pages/AssetLibrary";
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
import OnboardingPage from "./pages/Onboarding";
import AuthPage from "./pages/Auth";
import Touring from "./pages/Touring";
import Profile from "./pages/Profile";

// Agent pages
import BookingAgent from "./pages/agents/BookingAgent";
import InvoiceAgent from "./pages/agents/InvoiceAgent";
import SocialMediaAgent from "./pages/agents/SocialMediaAgent";
import ContractAgent from "./pages/agents/ContractAgent";

// Event Toolkit pages
import EventToolkitDashboard from "./pages/event-toolkit/Dashboard";
import Gigs from "./pages/event-toolkit/Gigs";
import CreateGig from "./pages/event-toolkit/CreateGig";
import Invoices from "./pages/event-toolkit/Invoices";
import CreateInvoice from "./pages/event-toolkit/CreateInvoice";
import Contacts from "./pages/event-toolkit/Contacts";
import CreateContact from "./pages/event-toolkit/CreateContact";
import ContentManager from "./pages/event-toolkit/ContentManager";
import QrUploadManager from "./pages/event-toolkit/QrUploadManager";
import CreateQrCampaign from "./pages/event-toolkit/CreateQrCampaign";

// Conditionally import Crossmint only if we have a valid API key
import { CrossmintProvider, CrossmintAuthProvider } from "@crossmint/client-sdk-react-ui";

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
            {/* New FYI-inspired landing page as the root route */}
            <Route path="/" element={<FYILanding />} />
            
            {/* Original landing page moved to different route */}
            <Route path="/original-landing" element={<Landing />} />
            
            {/* Authentication route */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Onboarding route - protected */}
            <Route path="/onboarding" element={bypassAuth ? <OnboardingPage /> : <ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
            
            {/* Keep the landing page available at a specific path if needed */}
            <Route path="/landing-preview" element={<Landing />} />
            
            {/* Move original Index to /index route */}
            <Route path="/index" element={<Index />} />

            {/* Dashboard and protected routes */}
            <Route path="/home" element={bypassAuth ? <Home /> : <ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/gallery" element={bypassAuth ? <AssetLibrary /> : <ProtectedRoute><AssetLibrary /></ProtectedRoute>} />
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
            
            {/* Touring route */}
            <Route path="/touring" element={bypassAuth ? <Touring /> : <ProtectedRoute><Touring /></ProtectedRoute>} />
            
            {/* Profile route */}
            <Route path="/profile" element={bypassAuth ? <Profile /> : <ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Agent routes */}
            <Route path="/collection/booking-agent" element={bypassAuth ? <BookingAgent /> : <ProtectedRoute><BookingAgent /></ProtectedRoute>} />
            <Route path="/collection/invoice-agent" element={bypassAuth ? <InvoiceAgent /> : <ProtectedRoute><InvoiceAgent /></ProtectedRoute>} />
            <Route path="/collection/social-media" element={bypassAuth ? <SocialMediaAgent /> : <ProtectedRoute><SocialMediaAgent /></ProtectedRoute>} />
            <Route path="/collection/contract-agent" element={bypassAuth ? <ContractAgent /> : <ProtectedRoute><ContractAgent /></ProtectedRoute>} />
            
            {/* Event Toolkit routes */}
            <Route path="/event-toolkit/dashboard" element={bypassAuth ? <EventToolkitDashboard /> : <ProtectedRoute><EventToolkitDashboard /></ProtectedRoute>} />
            <Route path="/event-toolkit/gigs" element={bypassAuth ? <Gigs /> : <ProtectedRoute><Gigs /></ProtectedRoute>} />
            <Route path="/event-toolkit/gigs/new" element={bypassAuth ? <CreateGig /> : <ProtectedRoute><CreateGig /></ProtectedRoute>} />
            <Route path="/event-toolkit/invoices" element={bypassAuth ? <Invoices /> : <ProtectedRoute><Invoices /></ProtectedRoute>} />
            <Route path="/event-toolkit/invoices/new" element={bypassAuth ? <CreateInvoice /> : <ProtectedRoute><CreateInvoice /></ProtectedRoute>} />
            <Route path="/event-toolkit/contacts" element={bypassAuth ? <Contacts /> : <ProtectedRoute><Contacts /></ProtectedRoute>} />
            <Route path="/event-toolkit/contacts/new" element={bypassAuth ? <CreateContact /> : <ProtectedRoute><CreateContact /></ProtectedRoute>} />
            <Route path="/event-toolkit/content" element={bypassAuth ? <ContentManager /> : <ProtectedRoute><ContentManager /></ProtectedRoute>} />
            <Route path="/event-toolkit/qr-upload" element={bypassAuth ? <QrUploadManager /> : <ProtectedRoute><QrUploadManager /></ProtectedRoute>} />
            <Route path="/event-toolkit/qr-upload/new" element={bypassAuth ? <CreateQrCampaign /> : <ProtectedRoute><CreateQrCampaign /></ProtectedRoute>} />
            
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
