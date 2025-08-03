// Define the structure for a social media post
export type SocialPostStatus = "Draft" | "Pending" | "Approved" | "Scheduled" | "Published" | "Failed";

export type SocialPlatform = "Instagram" | "Facebook" | "Twitter" | "YouTube" | "LinkedIn" | "TikTok" | "Pinterest";

export interface SocialPost {
  id: string;
  content: string;
  media: {
    type: 'image' | 'video';
    url: string;
  }[];
  platforms: SocialPlatform[];
  status: SocialPostStatus;
  scheduledAt: Date;
  category?: string; // e.g., "Entertainment", "Business Highlight"
  hashtags?: string[];
  analytics?: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
}