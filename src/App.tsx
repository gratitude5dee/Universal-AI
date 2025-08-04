
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { WalletProvider } from "@/context/WalletContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
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
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/home" element={<ArtistHome />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/library" element={<AssetLibrary />} />
                  <Route path="/treasury" element={<TreasureVault />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/rights" element={<RightsManagement />} />
                  <Route path="/thread-of-life" element={<ThreadOfLife />} />
                  <Route path="/bridge" element={<Bridge />} />
                  <Route path="/agent-marketplace" element={<AgentMarketplace />} />
                  <Route path="/create-agent" element={<CreateAgent />} />
                  <Route path="/integrations" element={<Integrations />} />
                  <Route path="/agents-integrations" element={<AgentsIntegrations />} />
                  <Route path="/marketplace-launch" element={<MarketplaceLaunch />} />
                  <Route path="/observability" element={<Observability />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/spellcraft-contracts" element={<SpellcraftContracts />} />
                  <Route path="/touring" element={<Touring />} />
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/fyi" element={<FYILanding />} />

                  {/* Event Toolkit Routes */}
                  <Route path="/event-toolkit/dashboard" element={<Dashboard />} />
                  <Route path="/event-toolkit/gigs" element={<Gigs />} />
                  <Route path="/event-toolkit/gigs/create" element={<CreateGig />} />
                  <Route path="/event-toolkit/invoices" element={<Invoices />} />
                  <Route path="/event-toolkit/invoices/create" element={<CreateInvoice />} />
                  <Route path="/event-toolkit/contacts" element={<Contacts />} />
                  <Route path="/event-toolkit/contacts/create" element={<CreateContact />} />
                  <Route path="/event-toolkit/content" element={<ContentManager />} />
                  <Route path="/event-toolkit/qr-upload" element={<QrUploadManager />} />
                  <Route path="/event-toolkit/qr-upload/create" element={<CreateQrCampaign />} />

                  {/* Agent Collection Routes */}
                  <Route path="/collection/booking-agent" element={<BookingAgent />} />
                  <Route path="/collection/invoice-agent" element={<InvoiceAgent />} />
                  <Route path="/collection/social-media" element={<SocialMediaAgent />} />
                  <Route path="/collection/contract-agent" element={<ContractAgent />} />

                  {/* Distribution Routes */}
                  <Route path="/distribution" element={<DistributionOverview />} />
                  <Route path="/distribution/social-media" element={<SocialMediaWzrd />} />
                  <Route path="/distribution/media-channels" element={<MediaChannels />} />
                  <Route path="/distribution/independent" element={<IndependentChannels />} />
                  <Route path="/distribution/on-chain" element={<OnChainDistribution />} />
                  <Route path="/distribution/sync-licensing" element={<SyncLicensing />} />

                  {/* WZRD Routes */}
                  <Route path="/wzrd/studio" element={<WzrdStudio />} />
                  <Route path="/wzrd/library" element={<WzrdLibrary />} />
                  <Route path="/wzrd/research" element={<WzrdResearch />} />
                  <Route path="/wzrd/podcasts" element={<WzrdPodcasts />} />
                  <Route path="/wzrd/infinite-library" element={<WzrdInfiniteLibrary />} />
                  <Route path="/wzrd/companions" element={<WzrdCompanions />} />

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
