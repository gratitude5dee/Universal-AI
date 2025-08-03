// Create mock data to populate the calendar
import { SocialPost } from './types';

export const mockSocialPosts: SocialPost[] = [
  {
    id: 'post-1',
    content: "Wishing you all a very happy new year! May this year bring endless possibilities and musical inspiration.",
    media: [],
    platforms: ["Instagram", "Facebook", "LinkedIn"],
    status: "Pending",
    scheduledAt: new Date("2024-12-02T10:00:00"),
    category: "Entertainment",
    hashtags: ["#newyear", "#celebration", "#music"]
  },
  {
    id: 'post-2',
    content: "Visit our store today for exclusive vinyl releases and limited edition merchandise.",
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=800' }],
    platforms: ["Facebook", "Pinterest", "Instagram"],
    status: "Approved",
    scheduledAt: new Date("2024-12-03T14:00:00"),
    category: "Business Highlight",
    hashtags: ["#vinyl", "#music", "#store"]
  },
  {
    id: 'post-3',
    content: "The comfy fluffy chair where all the magic happens. Studio sessions are always better with the right vibe.",
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800' }],
    platforms: [],
    status: "Draft",
    scheduledAt: new Date("2024-12-05T16:00:00"),
    category: "Behind the Scenes",
    hashtags: ["#studio", "#recording", "#vibe"]
  },
  {
    id: 'post-4',
    content: "A throwback to the most incredible live performance. The energy was absolutely electric!",
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800' }],
    platforms: ["Instagram"],
    status: "Scheduled",
    scheduledAt: new Date("2024-12-07T18:00:00"),
    category: "Holiday Throwback",
    hashtags: ["#live", "#performance", "#throwback"]
  },
  {
    id: 'post-5',
    content: "New track dropping soon! Been working on this one for months and can't wait to share it.",
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800' }],
    platforms: ["Instagram", "Twitter", "TikTok"],
    status: "Approved",
    scheduledAt: new Date("2024-12-10T12:00:00"),
    category: "Music Release",
    hashtags: ["#newmusic", "#comingsoon", "#studio"]
  },
  {
    id: 'post-6',
    content: "Behind the scenes of our latest music video shoot. The crew was incredible!",
    media: [{ type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }],
    platforms: ["YouTube", "Instagram"],
    status: "Scheduled",
    scheduledAt: new Date("2024-12-12T20:00:00"),
    category: "Behind the Scenes",
    hashtags: ["#musicvideo", "#bts", "#production"]
  },
  {
    id: 'post-7',
    content: "Grateful for all the support this year. You make everything possible!",
    media: [],
    platforms: ["Facebook", "LinkedIn"],
    status: "Draft",
    scheduledAt: new Date("2024-12-15T11:00:00"),
    category: "Fan Appreciation",
    hashtags: ["#grateful", "#fans", "#thankyou"]
  },
  {
    id: 'post-8',
    content: "Weekend vibes in the studio. Sometimes the best ideas come when you least expect them.",
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800' }],
    platforms: ["Instagram", "TikTok"],
    status: "Pending",
    scheduledAt: new Date("2024-12-21T15:00:00"),
    category: "Studio Life",
    hashtags: ["#weekend", "#studio", "#creativity"]
  }
];