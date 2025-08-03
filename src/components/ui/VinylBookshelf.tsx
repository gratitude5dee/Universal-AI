import React from 'react';
import VinylRecord, { Asset } from './VinylRecord';

interface VinylBookshelfProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
}

const VinylBookshelf: React.FC<VinylBookshelfProps> = ({ assets, onSelectAsset }) => {
  return (
    <div className="bookshelf-container">
      <div className="flex -space-x-40">
        {assets.map((asset) => (
          <VinylRecord key={asset.id} asset={asset} onSelect={onSelectAsset} />
        ))}
      </div>
    </div>
  );
};

export default VinylBookshelf;