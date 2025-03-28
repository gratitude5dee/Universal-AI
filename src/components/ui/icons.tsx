
import React from "react";
import { cn } from "@/lib/utils";
import { LucideProps, LucideIcon } from "lucide-react";

// Core Icon component with common props
export interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
  isGlowing?: boolean;
  glowColor?: "highlight" | "accent" | "white";
}

// Common properties for tech-organic/circuit style icons
const defaultIconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.5,
  stroke: "currentColor",
};

// Base wrapper for consistent icon styling
export const Icon = ({
  size,
  className,
  strokeWidth = 1.5,
  isGlowing = false,
  glowColor = "highlight",
  children,
  ...props
}: IconProps) => {
  const sizeValue = size ? (typeof size === "number" ? `${size}px` : size) : "24px";
  
  const glowClass = isGlowing ? {
    "highlight": "icon-glow-cyan",
    "accent": "icon-glow-orange",
    "white": "icon-glow-white"
  }[glowColor] : "";

  return (
    <svg
      {...defaultIconProps}
      {...props}
      className={cn("inline-block", glowClass, className)}
      style={{
        width: sizeValue,
        height: sizeValue,
        strokeWidth,
        ...props.style
      }}
    >
      {children}
    </svg>
  );
};

// Custom futuristic home icon
export const HomeIcon = ({ className, ...props }: IconProps) => (
  <Icon className={cn("", className)} {...props}>
    <path 
      d="M9 20v-6h6v6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M3 12l9-9 9 9" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M5 10v10h14V10" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M12 3v3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Icon>
);

// Custom futuristic dashboard icon
export const DashboardIcon = ({ className, ...props }: IconProps) => (
  <Icon className={cn("", className)} {...props}>
    <rect x="3" y="3" width="7" height="9" rx="1" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="14" y="3" width="7" height="5" rx="1" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="14" y="12" width="7" height="9" rx="1" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="3" y="16" width="7" height="5" rx="1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 12V9" strokeLinecap="round" />
  </Icon>
);

// Custom futuristic brain/AI icon
export const BrainIcon = ({ className, ...props }: IconProps) => (
  <Icon className={cn("", className)} {...props}>
    <path 
      d="M12 4c4.5 0 8 2.5 8 6.5 0 4.5-2.5 6.5-8 6.5s-8-2-8-6.5C4 6.5 7.5 4 12 4z" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M12 4v13" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M4 10h16" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M8 17l4 3 4-3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Icon>
);

// Custom futuristic gallery/image icon
export const GalleryIcon = ({ className, ...props }: IconProps) => (
  <Icon className={cn("", className)} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8.5" cy="9.5" r="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path 
      d="M21 15l-5-5-5 5-4-4-4 4" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Icon>
);

// Custom futuristic wallet icon
export const WalletIcon = ({ className, ...props }: IconProps) => (
  <Icon className={cn("", className)} {...props}>
    <path 
      d="M3 6v12a2 2 0 002 2h14a2 2 0 002-2v-3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M21 11V6a2 2 0 00-2-2H5a2 2 0 00-2 2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M16 14h1a2 2 0 002-2v0a2 2 0 00-2-2h-1v4z" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Icon>
);

// Custom futuristic agent/bot icon
export const AgentIcon = ({ className, ...props }: IconProps) => (
  <Icon className={cn("", className)} {...props}>
    <rect x="3" y="11" width="18" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="7" y="16" width="2" height="2" rx="0.5" fill="currentColor" />
    <rect x="15" y="16" width="2" height="2" rx="0.5" fill="currentColor" />
    <path 
      d="M12 3v8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M8 7h8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M10 21v1" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M14 21v1" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Icon>
);

// Custom futuristic analytics icon
export const AnalyticsIcon = ({ className, ...props }: IconProps) => (
  <Icon className={cn("", className)} {...props}>
    <path 
      d="M21 21H3M21 21V7M21 21L15 15M12 7v14M3 21V3M3 3h10M3 3l6 6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M15 15a5 5 0 100-10 5 5 0 000 10z" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Icon>
);

// Custom futuristic settings icon
export const SettingsIcon = ({ className, ...props }: IconProps) => (
  <Icon className={cn("", className)} {...props}>
    <circle cx="12" cy="12" r="2" strokeLinecap="round" strokeLinejoin="round" />
    <path 
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Icon>
);

// Custom futuristic marketplace icon
export const MarketplaceIcon = ({ className, ...props }: IconProps) => (
  <Icon className={cn("", className)} {...props}>
    <path 
      d="M3 3h2l.5 5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M19 8h-14" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M5 8l2 13h10l2-13" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M9 15h6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M9 11h6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Icon>
);

// Let's update our navigation-related icons to use this new system
export const NavHomeIcon = HomeIcon;
export const NavDashboardIcon = DashboardIcon;
export const NavBrainIcon = BrainIcon;
export const NavGalleryIcon = GalleryIcon;
export const NavWalletIcon = WalletIcon;
export const NavAgentIcon = AgentIcon;
export const NavAnalyticsIcon = AnalyticsIcon;
export const NavSettingsIcon = SettingsIcon;
export const NavMarketplaceIcon = MarketplaceIcon;

// Create a wrapper for Lucide icons that correctly handles the component type
export interface LucideIconWrapperProps {
  icon: React.ComponentType<LucideProps>;
  className?: string;
  size?: number;
  [key: string]: any;
}

export const LucideIconWrapper = ({ 
  icon: Icon, 
  className,
  size,
  ...props 
}: LucideIconWrapperProps) => {
  return <Icon className={className} size={size} {...props} />;
};
