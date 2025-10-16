import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VenueMapViewProps {
  onClose: () => void;
}

export const VenueMapView: React.FC<VenueMapViewProps> = ({ onClose }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const { toast } = useToast();

  const initializeMap = (token: string) => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-98.5795, 39.8283], // Center of US
        zoom: 4,
        pitch: 45,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add example markers (mock venue data)
      const exampleVenues = [
        { name: 'Blue Note Jazz Club', coords: [-74.006, 40.7128], capacity: 300 },
        { name: 'The Apollo Theater', coords: [-73.9501, 40.8093], capacity: 1500 },
        { name: 'Troubadour', coords: [-118.3852, 34.0009], capacity: 500 },
        { name: 'The Fillmore', coords: [-122.4329, 37.7845], capacity: 1200 },
      ];

      exampleVenues.forEach(venue => {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div style="color: #000; padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${venue.name}</h3>
            <p style="font-size: 12px; margin: 0;">Capacity: ${venue.capacity}</p>
          </div>`
        );

        new mapboxgl.Marker({ color: '#3B82F6' })
          .setLngLat(venue.coords as [number, number])
          .setPopup(popup)
          .addTo(map.current!);
      });

      setIsTokenSet(true);
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: 'Map Error',
        description: 'Failed to initialize map. Please check your Mapbox token.',
        variant: 'destructive',
      });
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      initializeMap(mapboxToken);
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 600 }}
      exit={{ opacity: 0, height: 0 }}
      className="relative overflow-hidden rounded-lg border border-white/10"
    >
      {!isTokenSet ? (
        <div className="h-[600px] bg-white/5 backdrop-blur-md flex flex-col items-center justify-center p-8">
          <div className="max-w-md w-full space-y-6 text-center">
            <MapPin className="h-16 w-16 text-blue-primary mx-auto" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Mapbox Token Required
              </h3>
              <p className="text-white/70 mb-6">
                To use the interactive venue map, please enter your Mapbox public token.
                Get one free at{' '}
                <a
                  href="https://mapbox.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-primary hover:underline"
                >
                  mapbox.com
                </a>
              </p>
            </div>
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <Input
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                placeholder="Enter your Mapbox public token..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-primary hover:bg-blue-primary/80"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Load Map
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 bg-blue-darker/90 backdrop-blur-sm border border-white/20 text-white hover:bg-blue-darker hover:text-white"
          >
            <X className="h-4 w-4 mr-2" />
            Close Map
          </Button>
          <div ref={mapContainer} className="w-full h-[600px]" />
        </>
      )}
    </motion.div>
  );
};
