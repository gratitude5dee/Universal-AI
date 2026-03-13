import React, { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import VinylBookshelf from "@/components/library/VinylBookshelf";
import LiquidGlassModal from "@/components/library/LiquidGlassModal";
import { useContentLibraryAssets } from "@/hooks/useContentLibraryAssets";
import { Loader2 } from "lucide-react";


const AssetLibrary = () => {
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const { data: assets = [], isLoading } = useContentLibraryAssets();

  const handleRecordSelect = (asset: any) => {
    setSelectedAsset(asset);
  };

  const handleCloseModal = () => {
    setSelectedAsset(null);
  };

  const recentAssets = assets.slice(0, 8);
  const featuredAssets = assets
    .filter((asset) => asset.publicationCount > 0)
    .slice(0, 8);
  const popularAssets = assets
    .filter((asset) => asset.linkCount > 0 || asset.tags.length > 0)
    .slice(0, 8);

  return (
    <DashboardLayout>
      <Content title="Content Library" subtitle="Your personal collection of creative assets">
        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white/70" />
          </div>
        ) : (
          <div className="space-y-12">
            <VinylBookshelf onRecordSelect={handleRecordSelect} title="Recent Creations" assets={recentAssets} />
            <VinylBookshelf onRecordSelect={handleRecordSelect} title="Featured Collections" assets={featuredAssets.length ? featuredAssets : recentAssets} />
            <VinylBookshelf onRecordSelect={handleRecordSelect} title="Popular Assets" assets={popularAssets.length ? popularAssets : recentAssets} />
          </div>
        )}
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
