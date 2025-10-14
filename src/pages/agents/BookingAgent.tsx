import React from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { BookingDashboard } from "@/components/touring/BookingDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedVenueCard from "@/components/touring/EnhancedVenueCard";

const BookingAgent = () => {
  const sampleVenues = [
    {
      id: "1",
      name: "The Blue Note",
      city: "New York",
      state: "NY",
      capacity: 300,
      price: "$2,500",
      availability: "Weekends Available",
      amenities: ["Sound System", "Lighting", "Stage", "Bar"],
      genre: "Jazz",
      matchScore: 95
    },
    {
      id: "2",
      name: "The Troubadour",
      city: "Los Angeles",
      state: "CA",
      capacity: 500,
      price: "$3,500",
      availability: "Most Nights",
      amenities: ["Sound System", "Lighting", "Stage"],
      genre: "Rock",
      matchScore: 88
    }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Booking Agent
            </h1>
            <p className="text-muted-foreground">
              AI-powered booking workflow for venues and events
            </p>
          </div>
          
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="bg-card border-border">
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="search">Search Venues</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-6">
              <BookingDashboard />
            </TabsContent>

            <TabsContent value="search" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sampleVenues.map((venue) => (
                  <EnhancedVenueCard
                    key={venue.id}
                    venue={venue}
                    status="new"
                    onAction={(action, venueId) => console.log(action, venueId)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookingAgent;
