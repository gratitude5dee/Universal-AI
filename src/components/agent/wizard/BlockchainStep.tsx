import React from "react";
import { Layers, Zap, Sparkles } from "lucide-react";

interface BlockchainStepProps {
  blockchain: string;
  setBlockchain: (blockchain: string) => void;
  agentPurpose: string;
}

const BlockchainStep: React.FC<BlockchainStepProps> = ({ blockchain, setBlockchain, agentPurpose }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold white-bg-heading">Blockchain Deployment</h2>
        <p className="white-bg-subheading">Choose where your agent's outputs will be stored</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          className={`backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl cursor-pointer transition-all ${blockchain === 'ethereum' ? 'border-indigo-500 bg-indigo-50/10 shadow-lg' : 'hover:border-indigo-200'}`}
          onClick={() => setBlockchain('ethereum')}
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-indigo-100/30 flex items-center justify-center">
              <svg className="h-5 w-5 text-indigo-500" viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M127.9611 0.0369453L125.1661 9.6290453V285.168945L127.9611 288.0582453L223.4701 223.4582453L127.9611 0.0369453Z" />
                <path fill="currentColor" d="M127.962 0.0369453L32.452 223.4582453L127.962 288.0582453V154.5309453V0.0369453Z" />
                <path fill="currentColor" d="M127.9609 312.1866453L126.3859 314.1072453V413.6649453L127.9609 417.0000453L223.5001 247.4235453L127.9609 312.1866453Z" />
                <path fill="currentColor" d="M127.962 417.0000453V312.1866453L32.452 247.4235453L127.962 417.0000453Z" />
                <path fill="currentColor" d="M127.9609 288.0582453L223.4699 223.4582453L127.9609 154.5309453V288.0582453Z" />
                <path fill="currentColor" d="M32.452 223.4582453L127.962 288.0582453V154.5309453L32.452 223.4582453Z" />
              </svg>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-indigo-600">Popular</div>
          </div>
          <h3 className="font-medium mt-4 mb-1 text-blue-dark">Ethereum</h3>
          <p className="text-sm text-blue-dark/70">Mainstream blockchain with wide adoption and established standards</p>
          <div className="mt-4 text-xs text-blue-dark/60 flex items-center">
            <span className="mr-4">Gas: High</span>
            <span>Speed: Medium</span>
          </div>
        </div>
        
        <div 
          className={`backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl cursor-pointer transition-all ${blockchain === 'base' ? 'border-blue-500 bg-blue-50/10 shadow-lg' : 'hover:border-blue-200'}`}
          onClick={() => setBlockchain('base')}
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-blue-100/30 flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M320 48.5C170 48.5 48.5 170 48.5 320S170 591.5 320 591.5 591.5 470 591.5 320 470 48.5 320 48.5Z"/>
              </svg>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-blue-600">L2</div>
          </div>
          <h3 className="font-medium mt-4 mb-1 text-blue-dark">Base</h3>
          <p className="text-sm text-blue-dark/70">Ethereum L2 with lower fees and faster transactions</p>
          <div className="mt-4 text-xs text-blue-dark/60 flex items-center">
            <span className="mr-4">Gas: Low</span>
            <span>Speed: Fast</span>
          </div>
        </div>
        
        <div 
          className={`backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl cursor-pointer transition-all ${blockchain === 'mantle' ? 'border-green-500 bg-green-50/10 shadow-lg' : 'hover:border-green-200'}`}
          onClick={() => setBlockchain('mantle')}
        >
          <div className="w-10 h-10 rounded-full bg-green-100/30 flex items-center justify-center">
            <Layers className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="font-medium mt-4 mb-1">Mantle</h3>
          <p className="text-sm text-muted-foreground">Ethereum scaling solution with data availability layer</p>
          <div className="mt-4 text-xs text-gray-500 flex items-center">
            <span className="mr-4">Gas: Very Low</span>
            <span>Speed: Fast</span>
          </div>
        </div>
        
        <div 
          className={`backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl cursor-pointer transition-all ${blockchain === 'solana' ? 'border-purple-500 bg-purple-50/10 shadow-lg' : 'hover:border-purple-200'}`}
          onClick={() => setBlockchain('solana')}
        >
          <div className="w-10 h-10 rounded-full bg-purple-100/30 flex items-center justify-center">
            <Zap className="h-5 w-5 text-purple-500" />
          </div>
          <h3 className="font-medium mt-4 mb-1">Solana</h3>
          <p className="text-sm text-muted-foreground">High-throughput blockchain with low transaction costs</p>
          <div className="mt-4 text-xs text-gray-500 flex items-center">
            <span className="mr-4">Gas: Minimal</span>
            <span>Speed: Very Fast</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center bg-blue-50/30 backdrop-blur-sm p-4 rounded-lg border border-blue-100/30">
        <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
        <p className="text-sm text-blue-700">
          <strong>AI Assistant:</strong> For {agentPurpose === 'art' ? 'visual NFTs' : agentPurpose === 'music' ? 'audio NFTs' : 'text NFTs'}, I recommend {blockchain === 'ethereum' ? 'Ethereum for established marketplaces' : blockchain === 'base' ? 'Base for lower fees' : blockchain === 'mantle' ? 'Mantle for sustainability' : 'Solana for fast minting'}.
        </p>
      </div>
    </div>
  );
};

export default BlockchainStep;