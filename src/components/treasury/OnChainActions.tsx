import React, { useState } from "react";
import { Coins, Map, Landmark, Globe, Wallet, Link, Network, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MntBalanceChecker } from "@/components/treasury/MntBalanceChecker";
import { SendTokensModal } from "@/components/treasury/SendTokensModal";

const OnChainActions = () => {
  const [activePortal, setActivePortal] = useState("transactions");
  const [sendOpen, setSendOpen] = useState(false);

  return (
    <div className="space-y-6">
      <SendTokensModal open={sendOpen} onOpenChange={setSendOpen} />
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-white text-shadow-sm">
          <Landmark className="w-5 h-5 mr-2 text-studio-accent" />
          On-Chain Transaction Center
        </h2>
        <p className="text-white/80 mb-4 text-shadow-sm">
          Execute and monitor blockchain transactions with magical ease
        </p>
        
        <Tabs value={activePortal} onValueChange={setActivePortal} className="mt-6">
          <TabsList className="grid grid-cols-6 w-full mb-6 backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
            <TabsTrigger value="transactions" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">Transactions</TabsTrigger>
            <TabsTrigger value="mantle" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">Mantle</TabsTrigger>
            <TabsTrigger value="wormhole" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">Wormhole</TabsTrigger>
            <TabsTrigger value="mode" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">Mode</TabsTrigger>
            <TabsTrigger value="taiko" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">Taiko</TabsTrigger>
            <TabsTrigger value="monad" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">Monad</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="backdrop-blur-md bg-white/10 rounded-xl p-5 border border-white/20 shadow-card-glow hover:bg-white/15 transition-all duration-200">
                <h3 className="font-medium mb-3 text-white text-shadow-sm">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => setSendOpen(true)}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Send Tokens
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Coins className="mr-2 h-4 w-4" />
                    Swap Tokens
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Landmark className="mr-2 h-4 w-4" />
                    Stake Assets
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Map className="mr-2 h-4 w-4" />
                    Bridge Assets
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-3 text-white text-shadow-sm">Connected Chains</h3>
                  <div className="flex space-x-2">
                    <div className="bg-studio-highlight/20 px-3 py-1 rounded-full text-xs text-white text-shadow-sm">
                      Ethereum
                    </div>
                    <div className="bg-studio-highlight/20 px-3 py-1 rounded-full text-xs text-white text-shadow-sm">
                      Polygon
                    </div>
                    <div className="bg-studio-highlight/20 px-3 py-1 rounded-full text-xs text-white text-shadow-sm">
                      Solana
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-full text-xs border border-dashed border-white/30 text-white text-shadow-sm">
                      + Add
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="backdrop-blur-md bg-white/10 rounded-xl p-5 border border-white/20 shadow-card-glow hover:bg-white/15 transition-all duration-200">
                <h3 className="font-medium mb-3 text-white text-shadow-sm">Recent Transactions</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/15 transition-all duration-200">
                      <div className="flex items-center">
                        <div className="bg-studio-highlight/20 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                          <Coins className="w-4 h-4 text-studio-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white text-shadow-sm">Token Transfer</p>
                          <p className="text-xs text-white/70 text-shadow-sm">2 hours ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white text-shadow-sm">0.5 ETH</p>
                        <p className="text-xs text-green-400">Completed</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  View All Transactions
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="mantle">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#2563EB]/20 flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white text-shadow-sm">Mantle</h3>
                  <p className="text-sm text-white/80 text-shadow-sm">High-speed layer 2 bridge for optimized transactions</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <MntBalanceChecker />
                
                <div className="backdrop-blur-md bg-gradient-to-br from-[#f0f4ff]/10 to-white/5 p-5 rounded-lg border border-[#2563EB]/20 shadow-card-glow">
                  <h4 className="font-medium mb-4 text-white text-shadow-sm">Bridge to Mantle</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium block mb-1 text-white/90 text-shadow-sm">Select Token</label>
                      <select className="w-full p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white">
                        <option>ETH</option>
                        <option>USDC</option>
                        <option>DAI</option>
                        <option>WBTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1 text-white/90 text-shadow-sm">Amount</label>
                      <input type="text" className="w-full p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white" placeholder="0.0" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1 text-white/90 text-shadow-sm">Destination Address</label>
                      <input type="text" className="w-full p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white" placeholder="0x..." />
                    </div>
                    <Button className="w-full mt-2 bg-[#2563EB] hover:bg-[#2563EB]/80 text-white">
                      <Link className="w-4 h-4 mr-2" />
                      Bridge to Mantle
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="wormhole">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center mr-3">
                  <Network className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white text-shadow-sm">Wormhole</h3>
                  <p className="text-sm text-white/80 text-shadow-sm">Cross-chain interoperability for seamless asset transfers</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <div className="backdrop-blur-md bg-white/10 p-4 rounded-lg border border-white/20 shadow-card-glow">
                    <h4 className="font-medium mb-2 text-white text-shadow-sm">Supported Chains</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['Ethereum', 'Solana', 'Avalanche', 'Polygon', 'BSC', 'Arbitrum', 'Optimism', 'Cosmos'].map(chain => (
                        <div key={chain} className="text-sm bg-white/10 py-1 px-3 rounded-full border border-white/10 text-center text-white/80 text-shadow-sm">
                          {chain}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 border border-dashed border-[#8B5CF6]/30 rounded-lg backdrop-blur-md bg-white/5 shadow-card-glow">
                    <h4 className="font-medium text-[#8B5CF6] mb-2 text-shadow-sm">Universal Asset Transfer</h4>
                    <p className="text-sm text-white/80 text-shadow-sm">Wormhole allows for cross-chain message passing, enabling unique interoperability features like:</p>
                    <ul className="space-y-1 text-sm mt-2 text-white/80 text-shadow-sm">
                      <li className="flex items-center">
                        <Link className="w-3 h-3 mr-2 text-[#8B5CF6]" />
                        NFT teleportation
                      </li>
                      <li className="flex items-center">
                        <Link className="w-3 h-3 mr-2 text-[#8B5CF6]" />
                        Cross-chain governance
                      </li>
                      <li className="flex items-center">
                        <Link className="w-3 h-3 mr-2 text-[#8B5CF6]" />
                        Multi-chain liquidity
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="backdrop-blur-md bg-gradient-to-br from-[#f5f3ff]/10 to-white/5 p-5 rounded-lg border border-[#8B5CF6]/20 shadow-card-glow">
                  <h4 className="font-medium mb-4 text-white text-shadow-sm">Wormhole Bridge</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium block mb-1 text-white/90 text-shadow-sm">Source Chain</label>
                      <select className="w-full p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white">
                        <option>Ethereum</option>
                        <option>Solana</option>
                        <option>Avalanche</option>
                        <option>Polygon</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1 text-white/90 text-shadow-sm">Destination Chain</label>
                      <select className="w-full p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white">
                        <option>Solana</option>
                        <option>Ethereum</option>
                        <option>Avalanche</option>
                        <option>Polygon</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1 text-white/90 text-shadow-sm">Token & Amount</label>
                      <div className="flex space-x-2">
                        <select className="w-1/3 p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white">
                          <option>USDC</option>
                          <option>ETH</option>
                          <option>AVAX</option>
                          <option>SOL</option>
                        </select>
                        <input type="text" className="w-2/3 p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white" placeholder="0.0" />
                      </div>
                    </div>
                    <Button className="w-full mt-2 bg-[#8B5CF6] hover:bg-[#8B5CF6]/80 text-white">
                      <Network className="w-4 h-4 mr-2" />
                      Transfer via Wormhole
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="mode">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center mr-3">
                  <ArrowRightLeft className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white text-shadow-sm">Mode</h3>
                  <p className="text-sm text-white/80 text-shadow-sm">Optimized Ethereum L2 with enhanced developer rewards</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <div className="backdrop-blur-md bg-white/10 p-4 rounded-lg border border-white/20 shadow-card-glow">
                    <h4 className="font-medium mb-2 text-white text-shadow-sm">Mode Network Overview</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80 text-shadow-sm">Network Gas</span>
                        <span className="text-sm font-medium text-green-400">0.001 ETH (Low)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80 text-shadow-sm">Time to Finality</span>
                        <span className="text-sm font-medium text-white text-shadow-sm">~3 seconds</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80 text-shadow-sm">Sequencer Status</span>
                        <span className="text-sm font-medium text-green-400">Active</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80 text-shadow-sm">TVL</span>
                        <span className="text-sm font-medium text-white text-shadow-sm">$145.3M</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-dashed border-[#10B981]/30 rounded-lg backdrop-blur-md bg-white/5 shadow-card-glow">
                    <h4 className="font-medium text-[#10B981] mb-2 text-shadow-sm">Mode Value Proposition</h4>
                    <ul className="space-y-1 text-sm text-white/80 text-shadow-sm">
                      <li className="flex items-center">
                        <ArrowRightLeft className="w-3 h-3 mr-2 text-[#10B981]" />
                        Sequencer fee sharing for developers
                      </li>
                      <li className="flex items-center">
                        <ArrowRightLeft className="w-3 h-3 mr-2 text-[#10B981]" />
                        EVM-equivalent functionality
                      </li>
                      <li className="flex items-center">
                        <ArrowRightLeft className="w-3 h-3 mr-2 text-[#10B981]" />
                        Zero knowledge proofs for security
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="backdrop-blur-md bg-gradient-to-br from-[#ecfdf5]/10 to-white/5 p-5 rounded-lg border border-[#10B981]/20 shadow-card-glow">
                  <h4 className="font-medium mb-4 text-white text-shadow-sm">Mode Bridge</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium block mb-1 text-white/90 text-shadow-sm">Direction</label>
                      <select className="w-full p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white">
                        <option>Ethereum → Mode</option>
                        <option>Mode → Ethereum</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1 text-white/90 text-shadow-sm">Asset</label>
                      <select className="w-full p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white">
                        <option>ETH</option>
                        <option>USDC</option>
                        <option>DAI</option>
                        <option>WBTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1 text-white/90 text-shadow-sm">Amount</label>
                      <div className="relative">
                        <input type="text" className="w-full p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white" placeholder="0.0" />
                        <button className="absolute right-2 top-2 text-xs text-[#10B981]">MAX</button>
                      </div>
                      <p className="text-xs text-white/70 mt-1 text-shadow-sm">Bridge Fee: ~0.0005 ETH</p>
                    </div>
                    <Button className="w-full mt-2 bg-[#10B981] hover:bg-[#10B981]/80 text-white">
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      Bridge to Mode
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="taiko">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#EC4899]/20 flex items-center justify-center mr-3">
                  <Link className="w-5 h-5 text-[#EC4899]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white text-shadow-sm">Taiko</h3>
                  <p className="text-sm text-white/80 text-shadow-sm">Type 1 ZK-EVM with seamless Ethereum compatibility</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <div className="backdrop-blur-md bg-white/10 p-4 rounded-lg border border-white/20 shadow-card-glow">
                    <h4 className="font-medium mb-2 text-white text-shadow-sm">Network Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80 text-shadow-sm">Network</span>
                        <span className="text-sm font-medium text-green-400">Active</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80 text-shadow-sm">Gas Fee</span>
                        <span className="text-sm font-medium text-white text-shadow-sm">0.0002 ETH</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80 text-shadow-sm">Block Time</span>
                        <span className="text-sm font-medium text-white text-shadow-sm">~3 seconds</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80 text-shadow-sm">Finality</span>
                        <span className="text-sm font-medium text-white text-shadow-sm">~10 minutes</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-dashed border-[#EC4899]/30 rounded-lg backdrop-blur-md bg-white/5 shadow-card-glow">
                    <h4 className="font-medium text-[#EC4899] mb-2 text-shadow-sm">Taiko Features</h4>
                    <ul className="space-y-1 text-sm text-white/80 text-shadow-sm">
                      <li className="flex items-center">
                        <Link className="w-3 h-3 mr-2 text-[#EC4899]" />
                        100% EVM equivalence
                      </li>
                      <li className="flex items-center">
                        <Link className="w-3 h-3 mr-2 text-[#EC4899]" />
                        Zero-knowledge proofs
                      </li>
                      <li className="flex items-center">
                        <Link className="w-3 h-3 mr-2 text-[#EC4899]" />
                        Permissionless block production
                      </li>
                      <li className="flex items-center">
                        <Link className="w-3 h-3 mr-2 text-[#EC4899]" />
                        Ethereum-aligned security
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="backdrop-blur-md bg-gradient-to-br from-[#fdf2f8]/10 to-white/5 p-5 rounded-lg border border-[#EC4899]/20 shadow-card-glow">
                  <h4 className="font-medium mb-4 text-white text-shadow-sm">Taiko Bridge</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium block mb-1 text-white/90 text-shadow-sm">Direction</label>
                      <select className="w-full p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white">
                        <option>Ethereum → Taiko</option>
                        <option>Taiko → Ethereum</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1 text-white/90 text-shadow-sm">Asset</label>
                      <select className="w-full p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white">
                        <option>ETH</option>
                        <option>USDC</option>
                        <option>DAI</option>
                        <option>WBTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1 text-white/90 text-shadow-sm">Amount</label>
                      <div className="relative">
                        <input type="text" className="w-full p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white" placeholder="0.0" />
                        <button className="absolute right-2 top-2 text-xs text-[#EC4899]">MAX</button>
                      </div>
                      <p className="text-xs text-white/70 mt-1 text-shadow-sm">Processing time: ~30 minutes</p>
                    </div>
                    <Button className="w-full mt-2 bg-[#EC4899] hover:bg-[#EC4899]/80 text-white">
                      <Link className="w-4 h-4 mr-2" />
                      Bridge to Taiko
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="monad">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#F59E0B]/20 flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white text-shadow-sm">Monad</h3>
                  <p className="text-sm text-white/80 text-shadow-sm">High-performance L1 blockchain with parallel processing</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <div className="backdrop-blur-md bg-white/10 p-4 rounded-lg border border-white/20 shadow-card-glow">
                    <h4 className="font-medium mb-2 text-white text-shadow-sm">Network Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80 text-shadow-sm">TPS</span>
                        <span className="text-sm font-medium text-white text-shadow-sm">10,000+</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80 text-shadow-sm">Latency</span>
                        <span className="text-sm font-medium text-white text-shadow-sm">~0.5 seconds</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80 text-shadow-sm">Gas Price</span>
                        <span className="text-sm font-medium text-green-400">0.0001 MONAD</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80 text-shadow-sm">Network Load</span>
                        <span className="text-sm font-medium text-white text-shadow-sm">12%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-dashed border-[#F59E0B]/30 rounded-lg backdrop-blur-md bg-white/5 shadow-card-glow">
                    <h4 className="font-medium text-[#F59E0B] mb-2 text-shadow-sm">Monad Innovations</h4>
                    <ul className="space-y-1 text-sm text-white/80 text-shadow-sm">
                      <li className="flex items-center">
                        <Globe className="w-3 h-3 mr-2 text-[#F59E0B]" />
                        Parallel transaction execution
                      </li>
                      <li className="flex items-center">
                        <Globe className="w-3 h-3 mr-2 text-[#F59E0B]" />
                        Optimized VM for high throughput
                      </li>
                      <li className="flex items-center">
                        <Globe className="w-3 h-3 mr-2 text-[#F59E0B]" />
                        Sublinear validator scaling
                      </li>
                      <li className="flex items-center">
                        <Globe className="w-3 h-3 mr-2 text-[#F59E0B]" />
                        EVM-compatible smart contracts
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="backdrop-blur-md bg-gradient-to-br from-[#fef3c7]/10 to-white/5 p-5 rounded-lg border border-[#F59E0B]/20 shadow-card-glow">
                  <h4 className="font-medium mb-4 text-white text-shadow-sm">Monad Bridge</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium block mb-1 text-white/90 text-shadow-sm">Bridge Direction</label>
                      <select className="w-full p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white">
                        <option>Ethereum → Monad</option>
                        <option>Monad → Ethereum</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1 text-white/90 text-shadow-sm">Token</label>
                      <select className="w-full p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white">
                        <option>ETH</option>
                        <option>USDC</option>
                        <option>DAI</option>
                        <option>WBTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1 text-white/90 text-shadow-sm">Amount</label>
                      <div className="relative">
                        <input type="text" className="w-full p-2 border border-white/30 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white" placeholder="0.0" />
                        <button className="absolute right-2 top-2 text-xs text-[#F59E0B]">MAX</button>
                      </div>
                      <p className="text-xs text-white/70 mt-1 text-shadow-sm">Est. completion: 15 minutes</p>
                    </div>
                    <Button className="w-full mt-2 bg-[#F59E0B] hover:bg-[#F59E0B]/80 text-white">
                      <Globe className="w-4 h-4 mr-2" />
                      Bridge to Monad
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OnChainActions;
