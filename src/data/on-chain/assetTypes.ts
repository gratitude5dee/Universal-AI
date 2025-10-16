import { AssetTypeConfig } from '@/types/on-chain';

export const assetTypes: AssetTypeConfig[] = [
  {
    id: 'social-content',
    name: 'Social Content',
    icon: '📱',
    description: 'Tokenize tweets, posts, videos, and social media content',
    bestFor: 'Creators, influencers, viral content',
    complexity: 'low',
    complianceRequired: false,
    recommendedChains: ['solana', 'base'],
    estimatedCost: '$0.50 - $5',
    examples: ['Viral tweets', 'Memes', 'Video clips', 'Blog posts'],
  },
  {
    id: 'music',
    name: 'Music & Audio',
    icon: '🎵',
    description: 'Tokenize songs, albums, beats, and audio content with royalty splits',
    bestFor: 'Musicians, producers, audio creators',
    complexity: 'medium',
    complianceRequired: false,
    recommendedChains: ['solana', 'ethereum'],
    estimatedCost: '$2 - $15',
    examples: ['Albums', 'Singles', 'Beats', 'Samples'],
  },
  {
    id: 'meme-token',
    name: 'Meme Tokens',
    icon: '🚀',
    description: 'Launch viral meme coins with bonding curves and instant liquidity',
    bestFor: 'Community builders, meme creators',
    complexity: 'low',
    complianceRequired: false,
    recommendedChains: ['solana', 'base'],
    estimatedCost: '$0.02 - $2',
    examples: ['Community tokens', 'Viral memes', 'Fun projects'],
  },
  {
    id: 'visual-art',
    name: 'Visual Art',
    icon: '🎨',
    description: 'Tokenize digital art, photography, and visual creations as NFTs',
    bestFor: 'Artists, photographers, designers',
    complexity: 'low',
    complianceRequired: false,
    recommendedChains: ['ethereum', 'solana', 'base'],
    estimatedCost: '$1 - $50',
    examples: ['Digital art', 'Photography', '3D models', 'Generative art'],
  },
  {
    id: 'gaming-items',
    name: 'Gaming Items',
    icon: '🎮',
    description: 'Tokenize in-game assets, skins, weapons, and virtual goods',
    bestFor: 'Game developers, gamers, collectors',
    complexity: 'medium',
    complianceRequired: false,
    recommendedChains: ['polygon', 'arbitrum', 'base'],
    estimatedCost: '$0.50 - $10',
    examples: ['Weapon skins', 'Character NFTs', 'Virtual land', 'In-game currency'],
  },
  {
    id: 'ip-licenses',
    name: 'IP & Licenses',
    icon: '📜',
    description: 'Tokenize intellectual property rights and licensing agreements',
    bestFor: 'IP owners, brands, content creators',
    complexity: 'high',
    complianceRequired: true,
    recommendedChains: ['ethereum', 'solana'],
    estimatedCost: '$10 - $100',
    examples: ['Patents', 'Copyrights', 'Trademarks', 'Licensing rights'],
  },
];

export const getAssetTypeById = (id: string): AssetTypeConfig | undefined => {
  return assetTypes.find(type => type.id === id);
};

export const getAssetTypesByComplexity = (complexity: 'low' | 'medium' | 'high') => {
  return assetTypes.filter(type => type.complexity === complexity);
};
