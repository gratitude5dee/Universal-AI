import React, { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import VinylBookshelf from "@/components/library/VinylBookshelf";
import LiquidGlassModal from "@/components/library/LiquidGlassModal";


const AssetLibrary = () => {
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  const handleRecordSelect = (asset: any) => {
    setSelectedAsset(asset);
  };

  const handleCloseModal = () => {
    setSelectedAsset(null);
  };

  return (
    <DashboardLayout>
      <Content title="Content Library" subtitle="Your personal collection of creative assets">
        <div className="space-y-12">
          <VinylBookshelf onRecordSelect={handleRecordSelect} title="Recent Creations" />
          <VinylBookshelf onRecordSelect={handleRecordSelect} title="Featured Collections" />
          <VinylBookshelf onRecordSelect={handleRecordSelect} title="Popular Assets" />
        </div>
        <LiquidGlassModal 
          isOpen={!!selectedAsset}
          asset={selectedAsset}
          onClose={handleCloseModal}
        />
      </Content>
    </DashboardLayout>
  );
};

export default AssetLibrary;
