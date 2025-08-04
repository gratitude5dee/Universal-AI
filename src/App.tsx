
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { WalletProvider } from "@/context/WalletContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { ProtectedRoute } from "@/components/ui/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import ArtistHome from "./pages/ArtistHome";
import Gallery from "./pages/Gallery";
import AssetLibrary from "./pages/AssetLibrary";
import TreasureVault from "./pages/TreasureVault";
import Analytics from "./pages/Analytics";
import RightsManagement from "./pages/RightsManagement";
import ThreadOfLife from "./pages/ThreadOfLife";
import Bridge from "./pages/Bridge";
import AgentMarketplace from "./pages/AgentMarketplace";
import CreateAgent from "./pages/CreateAgent";
import MarketplaceLaunch from "./pages/MarketplaceLaunch";
import Observability from "./pages/Observability";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import SpellcraftContracts from "./pages/SpellcraftContracts";
import Touring from "./pages/Touring";
import Integrations from "./pages/Integrations";
import AgentsIntegrations from "./pages/AgentsIntegrations";
import MarketingDistribution from "./pages/MarketingDistribution";
import Landing from "./pages/Landing";
import FYILanding from "./pages/FYILanding";

// Event Toolkit Pages
import Dashboard from "./pages/event-toolkit/Dashboard";
import Gigs from "./pages/event-toolkit/Gigs";
import CreateGig from "./pages/event-toolkit/CreateGig";
import Invoices from "./pages/event-toolkit/Invoices";
import CreateInvoice from "./pages/event-toolkit/CreateInvoice";
import Contacts from "./pages/event-toolkit/Contacts";
import CreateContact from "./pages/event-toolkit/CreateContact";
import ContentManager from "./pages/event-toolkit/ContentManager";
import QrUploadManager from "./pages/event-toolkit/QrUploadManager";
import CreateQrCampaign from "./pages/event-toolkit/CreateQrCampaign";

// Agent Collection Pages
import BookingAgent from "./pages/agents/BookingAgent";
import InvoiceAgent from "./pages/agents/InvoiceAgent";
import SocialMediaAgent from "./pages/agents/SocialMediaAgent";
import ContractAgent from "./pages/agents/ContractAgent";

// Distribution Pages
import DistributionOverview from "./pages/distribution/DistributionOverview";
import SocialMediaWzrd from "./pages/distribution/SocialMediaWzrd";
import MediaChannels from "./pages/distribution/MediaChannels";
import IndependentChannels from "./pages/distribution/IndependentChannels";
import OnChainDistribution from "./pages/distribution/OnChainDistribution";
import SyncLicensing from "./pages/distribution/SyncLicensing";

// WZRD Pages
import WzrdStudio from "./pages/wzrd/WzrdStudio";
import WzrdLibrary from "./pages/wzrd/WzrdLibrary";
import WzrdResearch from "./pages/wzrd/WzrdResearch";
import WzrdPodcasts from "./pages/wzrd/WzrdPodcasts";
import WzrdInfiniteLibrary from "./pages/wzrd/WzrdInfiniteLibrary";
import WzrdCompanions from "./pages/wzrd/WzrdCompanions";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WalletProvider>
          <OnboardingProvider>
            <TooltipProvider>
              <Toaster />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/fyi" element={<FYILanding />} />
                  
                  {/* Protected routes */}
                  <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                  <Route path="/home" element={<ProtectedRoute><ArtistHome /></ProtectedRoute>} />
                  <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
                  <Route path="/library" element={<ProtectedRoute><AssetLibrary /></ProtectedRoute>} />
                  <Route path="/treasury" element={<ProtectedRoute><TreasureVault /></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                  <Route path="/rights" element={<ProtectedRoute><RightsManagement /></ProtectedRoute>} />
                  <Route path="/thread-of-life" element={<ProtectedRoute><ThreadOfLife /></ProtectedRoute>} />
                  <Route path="/bridge" element={<ProtectedRoute><Bridge /></ProtectedRoute>} />
                  <Route path="/agent-marketplace" element={<ProtectedRoute><AgentMarketplace /></ProtectedRoute>} />
                  <Route path="/create-agent" element={<ProtectedRoute><CreateAgent /></ProtectedRoute>} />
                  <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
                  <Route path="/agents-integrations" element={<ProtectedRoute><AgentsIntegrations /></ProtectedRoute>} />
                  <Route path="/marketing-distribution" element={<ProtectedRoute><MarketingDistribution /></ProtectedRoute>} />
                  <Route path="/marketplace-launch" element={<ProtectedRoute><MarketplaceLaunch /></ProtectedRoute>} />
                  <Route path="/observability" element={<ProtectedRoute><Observability /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                  <Route path="/spellcraft-contracts" element={<ProtectedRoute><SpellcraftContracts /></ProtectedRoute>} />
                  <Route path="/touring" element={<ProtectedRoute><Touring /></ProtectedRoute>} />

                  {/* Event Toolkit Routes - Protected */}
                  <Route path="/event-toolkit/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/event-toolkit/gigs" element={<ProtectedRoute><Gigs /></ProtectedRoute>} />
                  <Route path="/event-toolkit/gigs/create" element={<ProtectedRoute><CreateGig /></ProtectedRoute>} />
                  <Route path="/event-toolkit/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
                  <Route path="/event-toolkit/invoices/create" element={<ProtectedRoute><CreateInvoice /></ProtectedRoute>} />
                  <Route path="/event-toolkit/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
                  <Route path="/event-toolkit/contacts/create" element={<ProtectedRoute><CreateContact /></ProtectedRoute>} />
                  <Route path="/event-toolkit/content" element={<ProtectedRoute><ContentManager /></ProtectedRoute>} />
                  <Route path="/event-toolkit/qr-upload" element={<ProtectedRoute><QrUploadManager /></ProtectedRoute>} />
                  <Route path="/event-toolkit/qr-upload/create" element={<ProtectedRoute><CreateQrCampaign /></ProtectedRoute>} />

                  {/* Agent Collection Routes - Protected */}
                  <Route path="/collection/booking-agent" element={<ProtectedRoute><BookingAgent /></ProtectedRoute>} />
                  <Route path="/collection/invoice-agent" element={<ProtectedRoute><InvoiceAgent /></ProtectedRoute>} />
                  <Route path="/collection/social-media" element={<ProtectedRoute><SocialMediaAgent /></ProtectedRoute>} />
                  <Route path="/collection/contract-agent" element={<ProtectedRoute><ContractAgent /></ProtectedRoute>} />

                  {/* Distribution Routes - Protected */}
                  <Route path="/distribution" element={<ProtectedRoute><DistributionOverview /></ProtectedRoute>} />
                  <Route path="/distribution/social-media" element={<ProtectedRoute><SocialMediaWzrd /></ProtectedRoute>} />
                  <Route path="/distribution/media-channels" element={<ProtectedRoute><MediaChannels /></ProtectedRoute>} />
                  <Route path="/distribution/independent" element={<ProtectedRoute><IndependentChannels /></ProtectedRoute>} />
                  <Route path="/distribution/on-chain" element={<ProtectedRoute><OnChainDistribution /></ProtectedRoute>} />
                  <Route path="/distribution/sync-licensing" element={<ProtectedRoute><SyncLicensing /></ProtectedRoute>} />

                  {/* WZRD Routes - Protected */}
                  <Route path="/wzrd/studio" element={<ProtectedRoute><WzrdStudio /></ProtectedRoute>} />
                  <Route path="/wzrd/library" element={<ProtectedRoute><WzrdLibrary /></ProtectedRoute>} />
                  <Route path="/wzrd/research" element={<ProtectedRoute><WzrdResearch /></ProtectedRoute>} />
                  <Route path="/wzrd/podcasts" element={<ProtectedRoute><WzrdPodcasts /></ProtectedRoute>} />
                  <Route path="/wzrd/infinite-library" element={<ProtectedRoute><WzrdInfiniteLibrary /></ProtectedRoute>} />
                  <Route path="/wzrd/companions" element={<ProtectedRoute><WzrdCompanions /></ProtectedRoute>} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </OnboardingProvider>
        </WalletProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
