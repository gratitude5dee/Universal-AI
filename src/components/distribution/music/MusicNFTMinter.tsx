
import React, { useState } from "react";
import { Upload, Music, Palette, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface MintingConfig {
  title: string;
  artist: string;
  description: string;
  audioFile: File | null;
  coverArt: File | null;
  price: string;
  royalty: number;
  totalSupply: number;
}

export const MusicNFTMinter = () => {
  const [config, setConfig] = useState<MintingConfig>({
    title: "",
    artist: "",
    description: "",
    audioFile: null,
    coverArt: null,
    price: "",
    royalty: 10,
    totalSupply: 1000
  });

  const handleFileUpload = (type: 'audio' | 'cover', file: File) => {
    if (type === 'audio') {
      setConfig(prev => ({ ...prev, audioFile: file }));
    } else {
      setConfig(prev => ({ ...prev, coverArt: file }));
    }
  };

  const handleMint = async () => {
    // Mock minting process
    console.log('Minting NFT with config:', config);
  };

  return (
    <div className="glass-card p-6 rounded-xl border border-white/10 backdrop-blur-md">
      <div className="flex items-center mb-6">
        <Music className="w-6 h-6 mr-3 text-studio-accent" />
        <div>
          <h3 className="text-xl font-semibold text-white">Music NFT Minter</h3>
          <p className="text-sm text-white/70">Create and mint your music as NFTs</p>
        </div>
      </div>

      <Tabs defaultValue="metadata" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="economics">Economics</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="metadata" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Track Title</Label>
              <Input
                id="title"
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter track title"
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="artist">Artist Name</Label>
              <Input
                id="artist"
                value={config.artist}
                onChange={(e) => setConfig(prev => ({ ...prev, artist: e.target.value }))}
                placeholder="Enter artist name"
                className="bg-white/10 border-white/20"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={config.description}
              onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your music NFT"
              className="bg-white/10 border-white/20"
              rows={3}
            />
          </div>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 border-dashed border-white/30 bg-white/5">
              <div className="text-center">
                <Music className="w-8 h-8 mx-auto mb-2 text-studio-accent" />
                <p className="text-sm text-white/70 mb-2">Upload Audio File</p>
                <Button variant="outline" size="sm" className="bg-white/10">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                {config.audioFile && (
                  <p className="text-xs text-green-400 mt-2">{config.audioFile.name}</p>
                )}
              </div>
            </Card>

            <Card className="p-4 border-dashed border-white/30 bg-white/5">
              <div className="text-center">
                <Palette className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-sm text-white/70 mb-2">Upload Cover Art</p>
                <Button variant="outline" size="sm" className="bg-white/10">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
                {config.coverArt && (
                  <p className="text-xs text-green-400 mt-2">{config.coverArt.name}</p>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="economics" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (ETH)</Label>
              <Input
                id="price"
                type="number"
                value={config.price}
                onChange={(e) => setConfig(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.1"
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="royalty">Royalty (%)</Label>
              <Input
                id="royalty"
                type="number"
                value={config.royalty}
                onChange={(e) => setConfig(prev => ({ ...prev, royalty: parseInt(e.target.value) }))}
                placeholder="10"
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="supply">Total Supply</Label>
              <Input
                id="supply"
                type="number"
                value={config.totalSupply}
                onChange={(e) => setConfig(prev => ({ ...prev, totalSupply: parseInt(e.target.value) }))}
                placeholder="1000"
                className="bg-white/10 border-white/20"
              />
            </div>
          </div>

          <Card className="p-4 bg-white/5 border border-white/10">
            <h4 className="font-medium text-white mb-2">Revenue Projections</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">Total Potential Revenue:</span>
                <span className="text-green-400 font-medium ml-2">
                  {(parseFloat(config.price || '0') * config.totalSupply).toFixed(2)} ETH
                </span>
              </div>
              <div>
                <span className="text-white/60">Ongoing Royalties:</span>
                <span className="text-blue-400 font-medium ml-2">{config.royalty}% per resale</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="p-6 bg-white/5 border border-white/10">
            <div className="text-center mb-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-studio-accent to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <Music className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white">{config.title || "Untitled Track"}</h4>
              <p className="text-white/70">{config.artist || "Unknown Artist"}</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Price:</span>
                <span className="text-white">{config.price || '0'} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Supply:</span>
                <span className="text-white">{config.totalSupply}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Royalty:</span>
                <span className="text-white">{config.royalty}%</span>
              </div>
            </div>

            <Button 
              onClick={handleMint}
              className="w-full mt-6 bg-gradient-to-r from-studio-accent to-blue-500 hover:from-studio-accent/80 hover:to-blue-500/80"
            >
              Mint Music NFT
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
