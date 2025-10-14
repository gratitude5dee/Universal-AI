import React, { useState } from "react";
import { motion } from "framer-motion";
import EnhancedBookingSearch from "./EnhancedBookingSearch";
import BookingStatusTabs from "./BookingStatusTabs";
import EnhancedVenueCard from "./EnhancedVenueCard";
import BookingWorkflowTracker from "./BookingWorkflowTracker";
import AIRecommenderModal from "./AIRecommenderModal";

const mockVenues = [
  {
    id: "1",
    name: "Blue Note Jazz Club",
    city: "New York",
    state: "NY",
    capacity: 300,
    price: "$2,500",
    availability: "Available March 15-20",
    imageUrl: "/placeholder.svg",
    amenities: ["Sound System", "Lighting", "Bar", "Stage"],
    genre: "Jazz",
    matchScore: 95
  },
  {
    id: "2",
    name: "The Apollo Theater",
    city: "New York",
    state: "NY",
    capacity: 1500,
    price: "$8,500",
    availability: "Available March 22-25",
    imageUrl: "/placeholder.svg",
    amenities: ["Sound System", "Lighting", "Bar", "Stage", "Backstage"],
    genre: "Various",
    matchScore: 88
  },
  {
    id: "3",
    name: "Village Vanguard",
    city: "New York",
    state: "NY",
    capacity: 178,
    price: "$3,000",
    availability: "Available March 10-30",
    imageUrl: "/placeholder.svg",
    amenities: ["Sound System", "Stage", "Bar"],
    genre: "Jazz",
    matchScore: 92
  }
];

const EnhancedBookingAgent = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showMap, setShowMap] = useState(false);
  const [showAIRecommender, setShowAIRecommender] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const bookingCounts = {
    all: 8,
    new: 3,
    negotiating: 2,
    accepted: 1,
    contracted: 1,
    paid: 1
  };

  const handleSearch = (query: string) => {
    console.log("Searching:", query);
    // Implement search logic
  };

  const handleAIRecommend = async (description: string) => {
    console.log("Getting AI recommendations for:", description);
    // Implement AI recommendation logic
    return mockVenues;
  };

  const handleVenueAction = (action: string, venueId: string) => {
    console.log("Action:", action, "Venue:", venueId);
    // Implement venue action logic
  };

  const renderVenuesByStatus = () => {
    // Filter venues based on active tab
    const filteredVenues = mockVenues;

    return (
      <div className="space-y-6">
        {/* Workflow Tracker (shown when a booking is selected) */}
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Booking Progress</h3>
            <BookingWorkflowTracker
              currentStage="offer"
              onStageClick={(stage) => console.log("Clicked stage:", stage)}
            />
          </motion.div>
        )}

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue, index) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedBooking(venue.id)}
            >
              <EnhancedVenueCard
                venue={venue}
                status={activeTab === "all" ? "new" : (activeTab as any)}
                onAction={handleVenueAction}
              />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVenues.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No {activeTab !== "all" ? activeTab : ""} bookings found
            </h3>
            <p className="text-muted-foreground mb-6">
              Start by searching for venues or let AI recommend the perfect matches
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search */}
      <EnhancedBookingSearch
        onSearch={handleSearch}
        onAIRecommend={() => setShowAIRecommender(true)}
        onMapToggle={() => setShowMap(!showMap)}
        showMap={showMap}
      />

      {/* Map View (placeholder) */}
      {showMap && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 400 }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <p className="text-muted-foreground">Interactive Map View - Mapbox Integration</p>
          </div>
        </motion.div>
      )}

      {/* Status Tabs and Content */}
      <BookingStatusTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={bookingCounts}
      >
        {renderVenuesByStatus()}
      </BookingStatusTabs>

      {/* AI Recommender Modal */}
      <AIRecommenderModal
        isOpen={showAIRecommender}
        onClose={() => setShowAIRecommender(false)}
        onRecommend={handleAIRecommend}
      />
    </div>
  );
};

export default EnhancedBookingAgent;
