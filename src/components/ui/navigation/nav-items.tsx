import { 
  NavHomeIcon, NavDashboardIcon, NavBrainIcon, NavGalleryIcon, NavWalletIcon, 
  NavAgentIcon, NavAnalyticsIcon, NavSettingsIcon, NavMarketplaceIcon
} from "@/components/ui/icons";

// For the remaining icons we'll continue using lucide-react for now, but gradually replace them
import { 
  Palette, BookOpen, Headphones, Infinity, UserRound, Users, Shield, Globe, 
  Database, ShoppingCart, Eye, Building, Trees, ArrowRightLeft, Share2, Link, Tv, 
  User, Music, Landmark, TrendingUp, Droplets, CreditCard, Calendar, UserCircle,
  Briefcase, LayoutDashboard, FileText, QrCode, UserPlus, Upload, FilePlus, FilePieChart, Home, Banknote
} from "lucide-react";

export const navItems = [{
  name: "WZRD.tech",
  path: "#",
  icon: NavBrainIcon,
  hasSubmenu: true,
  submenuItems: [
    {
      name: "Studio",
      path: "/wzrd/studio",
      icon: Palette
    },
    {
      name: "Library",
      path: "/wzrd/library",
      icon: BookOpen
    },
    {
      name: "DeepResearch",
      path: "/wzrd/research",
      icon: NavBrainIcon
    },
    {
      name: "Generative Podcasts",
      path: "/wzrd/podcasts",
      icon: Headphones
    },
    {
      name: "Infinite Library",
      path: "/wzrd/infinite-library",
      icon: Infinity
    },
    {
      name: "Companions",
      path: "/wzrd/companions",
      icon: UserRound
    }
  ]
}, {
  name: "Touring",
  path: "/touring",
  icon: Calendar,
  hasSubmenu: true,
  submenuItems: [
    { name: "Dashboard", path: "/event-toolkit/dashboard", icon: LayoutDashboard },
    { name: "Gigs", path: "/event-toolkit/gigs", icon: Calendar },
    { name: "Invoices", path: "/event-toolkit/invoices", icon: FileText },
    { name: "Contacts", path: "/event-toolkit/contacts", icon: Users },
    { name: "Content", path: "/event-toolkit/content", icon: Music },
    { name: "QR Upload", path: "/event-toolkit/qr-upload", icon: QrCode },
  ]
}, {
  name: "Marketing & Distribution",
  path: "/distribution",
  icon: Share2,
  hasSubmenu: true,
  submenuItems: [
    {
      name: "Social Media WZRD",
      path: "/distribution/social-media",
      icon: Globe
    },
    {
      name: "On-Chain Distribution",
      path: "/distribution/on-chain",
      icon: Link
    },
    {
      name: "Media Channels",
      path: "/distribution/media-channels",
      icon: Tv
    },
    {
      name: "Independent Channels",
      path: "/distribution/independent",
      icon: User
    },
    {
      name: "Sync Licensing",
      path: "/distribution/sync-licensing",
      icon: Music
    }
  ]
}, {
  name: "Content Library",
  path: "#",
  icon: Users,
  hasSubmenu: true,
  submenuItems: [
    {
      name: "Asset Library",
      path: "/gallery",
      icon: NavGalleryIcon
    },
    {
      name: "IP Portal",
      path: "/rights",
      icon: Shield
    },
    {
      name: "Thread of Life",
      path: "/thread-of-life",
      icon: Trees
    },
    {
      name: "Bridge",
      path: "/bridge",
      icon: ArrowRightLeft
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: NavAnalyticsIcon
    },
    {
      name: "Marketplace Launch",
      path: "/marketplace-launch",
      icon: NavMarketplaceIcon
    },
  ]
}, {
  name: "Agents + Integrations",
  path: "#",
  icon: NavAgentIcon,
  hasSubmenu: true,
  submenuItems: [
    {
      name: "Create New Agent",
      path: "/create-agent",
      icon: NavAgentIcon
    },
    {
      name: "My Agents",
      path: "#",
      icon: Database,
      hasSubmenu: true,
      submenuItems: [
        {
          name: "Booking Agent",
          path: "/collection/booking-agent",
          icon: Calendar
        },
        {
          name: "Invoice Agent",
          path: "/collection/invoice-agent",
          icon: CreditCard
        },
        {
          name: "Social Media Agent",
          path: "/collection/social-media",
          icon: Globe
        },
        {
          name: "Contract Agent",
          path: "/collection/contract-agent",
          icon: Shield
        }
      ]
    },
    {
      name: "Agent Banking",
      path: "/treasury?tab=banking",
      icon: CreditCard
    },
    {
      name: "Marketplace",
      path: "/agent-marketplace",
      icon: ShoppingCart
    },
    {
      name: "Observability",
      path: "/observability",
      icon: Eye
    }
  ]
}, {
  name: "Finances",
  path: "#",
  icon: NavWalletIcon,
  hasSubmenu: true,
  submenuItems: [
    {
      name: "Dashboard",
      path: "/treasury?tab=dashboard",
      icon: Home
    },
    {
      name: "Income",
      path: "/treasury?tab=income",
      icon: Banknote
    },
    {
      name: "Expenses",
      path: "/treasury?tab=expenses",
      icon: CreditCard
    },
    {
      name: "Accounting",
      path: "/treasury?tab=accounting",
      icon: FilePieChart
    },
    {
      name: "Agent Banking",
      path: "/treasury?tab=banking",
      icon: Landmark
    }
  ]
}, {
  name: "Profile",
  path: "/profile",
  icon: UserCircle
}];

export type NavItem = typeof navItems[0];
export type SubMenuItem = NavItem['submenuItems'][0];
export type NestedSubMenuItem = {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};
