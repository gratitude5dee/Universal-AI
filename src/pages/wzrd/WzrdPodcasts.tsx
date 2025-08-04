
import React from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import GenerativePodcastsInterface from "@/components/podcasts/GenerativePodcastsInterface";

const WzrdPodcasts = () => {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <GenerativePodcastsInterface />
      </div>
    </DashboardLayout>
  );
};

export default WzrdPodcasts;
