
import React, { useState } from "react";
import { Calendar, MapPin, Users, Ticket, QrCode, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface TicketEvent {
  id: string;
  title: string;
  artist: string;
  date: string;
  venue: string;
  location: string;
  price: number;
  available: number;
  total: number;
  nftBenefits: string[];
  image?: string;
}

const mockEvents: TicketEvent[] = [
  {
    id: '1',
    title: 'Web3 Music Festival 2024',
    artist: 'Multiple Artists',
    date: '2024-03-15',
    venue: 'Crypto Arena',
    location: 'Los Angeles, CA',
    price: 0.25,
    available: 847,
    total: 2000,
    nftBenefits: ['Exclusive NFT Drop', 'VIP Meet & Greet', 'Limited Merch']
  },
  {
    id: '2',
    title: 'Blockchain Beats Live',
    artist: 'Digital Symphony',
    date: '2024-03-22',
    venue: 'Virtual Reality Space',
    location: 'Metaverse',
    price: 0.15,
    available: 234,
    total: 500,
    nftBenefits: ['Avatar Wearables', 'Virtual Backstage Access']
  }
];

export const Web3TicketingInterface = () => {
  const [selectedEvent, setSelectedEvent] = useState<TicketEvent | null>(null);
  const [purchaseStep, setPurchaseStep] = useState<'select' | 'payment' | 'confirmation'>('select');

  const handlePurchase = (event: TicketEvent) => {
    setSelectedEvent(event);
    setPurchaseStep('payment');
  };

  const completePurchase = () => {
    setPurchaseStep('confirmation');
  };

  return (
    <div className="glass-card p-6 rounded-xl border border-white/10 backdrop-blur-md">
      <div className="flex items-center mb-6">
        <Ticket className="w-6 h-6 mr-3 text-purple-400" />
        <div>
          <h3 className="text-xl font-semibold text-white">Web3 Event Ticketing</h3>
          <p className="text-sm text-white/70">NFT tickets with exclusive benefits</p>
        </div>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">Browse Events</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="resale">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          {mockEvents.map((event) => (
            <Card key={event.id} className="p-6 bg-white/5 border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{event.title}</h4>
                  <p className="text-studio-accent">{event.artist}</p>
                </div>
                <Badge className="bg-purple-500/20 text-purple-300">
                  NFT Ticket
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center text-sm text-white/70">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <Users className="w-4 h-4 mr-2" />
                  {event.available}/{event.total} available
                </div>
                <div className="text-sm font-medium text-green-400">
                  {event.price} ETH
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-sm font-medium text-white mb-2">NFT Benefits:</h5>
                <div className="flex flex-wrap gap-2">
                  {event.nftBenefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-300">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handlePurchase(event)}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                >
                  Purchase NFT Ticket
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/20">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tickets">
          <Card className="p-8 text-center bg-white/5 border border-white/10">
            <QrCode className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h4 className="text-lg font-semibold text-white mb-2">Your NFT Tickets</h4>
            <p className="text-white/70 mb-4">Connect your wallet to view purchased tickets</p>
            <Button className="bg-studio-accent">Connect Wallet</Button>
          </Card>
        </TabsContent>

        <TabsContent value="resale">
          <Card className="p-8 text-center bg-white/5 border border-white/10">
            <Shield className="w-16 h-16 mx-auto mb-4 text-green-400" />
            <h4 className="text-lg font-semibold text-white mb-2">Secure Ticket Resale</h4>
            <p className="text-white/70 mb-4">
              Verified blockchain-based ticket transfers prevent fraud and scalping
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">Active Listings:</span>
                <span className="text-white font-medium ml-2">12</span>
              </div>
              <div>
                <span className="text-white/60">Avg. Resale Price:</span>
                <span className="text-green-400 font-medium ml-2">0.28 ETH</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {purchaseStep === 'payment' && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4 bg-gray-900 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-4">Purchase Confirmation</h4>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Event:</span>
                <span className="text-white">{selectedEvent.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Price:</span>
                <span className="text-white">{selectedEvent.price} ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Gas Fee:</span>
                <span className="text-white">~0.005 ETH</span>
              </div>
              <div className="border-t border-white/20 pt-2 flex justify-between font-medium">
                <span className="text-white">Total:</span>
                <span className="text-green-400">{(selectedEvent.price + 0.005).toFixed(3)} ETH</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={completePurchase}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600"
              >
                Confirm Purchase
              </Button>
              <Button 
                variant="outline"
                onClick={() => setPurchaseStep('select')}
                className="bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
