import React from "react";
import { motion } from "framer-motion";
import VinylRecord from "./VinylRecord";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const recentCreations = [
  { id: "1", title: "Nebula Wanderer", artist: "Aurora", image: "https://images.unsplash.com/photo-1603344204980-4edb0ea63148?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlnaXRhbCUyMGFydHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" },
  { id: "2", title: "Crystal Consciousness", artist: "Stellaron", image: "https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHhzZWFyY2h8Mnx8ZGlnaXRhbCUyMGFydHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" },
  { id: "3", title: "Astral Projection", artist: "Lyra", image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRpZ2l0YWwlMjBhcnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" },
  { id: "4", title: "Dimensional Shift", artist: "Orion", image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRpZ2l0YWwlMjBhcnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" },
  { id: "5", title: "Ethereal Dreams", artist: "Celeste", image: "https://images.unsplash.com/photo-1659792223397-2a108debb69a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGRpZ2l0YWwlMjBhcnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" },
  { id: "6", title: "Quantum Reflections", artist: "Vector", image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fGRpZ2l0YWwlMjBhcnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" },
];

interface VinylBookshelfProps {
  onRecordSelect: (asset: any) => void;
  title: string;
}

const VinylBookshelf: React.FC<VinylBookshelfProps> = ({ onRecordSelect, title }) => {
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-white text-shadow-sm">{title}</h2>
       <Carousel opts={{ align: "start", loop: true }} className="w-full">
         <CarouselContent className="-ml-4">
           {recentCreations.map((asset, index) => (
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