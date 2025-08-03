import { 
  NavHomeIcon, NavDashboardIcon, NavBrainIcon, NavGalleryIcon, NavWalletIcon, 
  NavAgentIcon, NavAnalyticsIcon, NavSettingsIcon, NavMarketplaceIcon
} from "@/components/ui/icons";

// For the remaining icons we'll continue using lucide-react for now, but gradually replace them
import { 
  Palette, BookOpen, Headphones, Infinity, UserRound, Users, Shield, Globe, 
  Database, ShoppingCart, Eye, Building, Trees, ArrowRightLeft, Share2, Link, Tv, 
  User, Music, Landmark, TrendingUp, Droplets, CreditCard, Calendar, UserCircle
} from "lucide-react";

export const navItems = [{
  name: "Dashboard",
  path: "/",
  icon: NavDashboardIcon
}, {
  name: "Touring & Gigs",
  path: "/touring-gigs",
  icon: Calendar
}, {
  name: "Distribution",
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
  name: "Projects",
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
      name: "Analytics",
      path: "/analytics",
      icon: NavAnalyticsIcon
    },
    {
      name: "Marketplace Launch",
      path: "/marketplace-launch",
      icon: NavMarketplaceIcon
    }
  ]
}, {
  name: "Agents",
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
      name: "My Collection",
      path: "/collection",
      icon: Database
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
  name: "Real World Assets",
  path: "#",
  icon: Building,
  hasSubmenu: true,
  submenuItems: [
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
    }
  ]
}, {
  name: "Treasury",
  path: "#",
  icon: NavWalletIcon,
  hasSubmenu: true,
  submenuItems: [
    {
      name: "Overview",
      path: "/treasury",
      icon: NavWalletIcon
    },
    {
      name: "Agent Banking",
      path: "/treasury?tab=banking",
      icon: CreditCard
    },
    {
      name: "On-Chain Actions",
      path: "/treasury?tab=onchain",
      icon: Landmark
    },
    {
      name: "Trading Agents",
      path: "/treasury?tab=trading",
      icon: TrendingUp
    },
    {
      name: "Liquidity Agents",
      path: "/treasury?tab=liquidity",
      icon: Droplets
    }
  ]
}, {
  name: "Profile",
  path: "/profile",
  icon: UserCircle
}];

export type NavItem = typeof navItems[0];
export type SubMenuItem = NavItem['submenuItems'][0];
