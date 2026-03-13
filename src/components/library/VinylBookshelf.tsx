import React from "react";
import VinylRecord from "./VinylRecord";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface VinylBookshelfProps {
  onRecordSelect: (asset: any) => void;
  title: string;
  assets?: Array<{
    id: string;
    title: string;
    artist: string;
    image: string;
  }>;
}

const VinylBookshelf: React.FC<VinylBookshelfProps> = ({ onRecordSelect, title, assets }) => {
  const assetList = Array.isArray(assets) ? assets : [];

  if (assetList.length === 0) {
    return (
      <div className="space-y-6">
        {title ? <h2 className="text-2xl font-bold text-white text-shadow-sm">{title}</h2> : null}
        <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 text-center text-sm text-white/60">
          No content yet. Upload or publish assets to populate this shelf.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       {title ? <h2 className="text-2xl font-bold text-white text-shadow-sm">{title}</h2> : null}
       <Carousel opts={{ align: "start", loop: true }} className="w-full">
         <CarouselContent className="-ml-4">
           {assetList.map((asset, index) => (
             <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6">
               <VinylRecord asset={asset} onSelect={() => onRecordSelect(asset)} />
             </CarouselItem>
           ))}
         </CarouselContent>
         <CarouselPrevious className="text-white bg-white/10 hover:bg-white/20 border-white/20" />
         <CarouselNext className="text-white bg-white/10 hover:bg-white/20 border-white/20" />
       </Carousel>
     </div>
  );
};

export default VinylBookshelf;
