
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  trackUrl: string;
  title: string;
  artist: string;
  coverArt?: string;
}

export const AudioPlayer = ({ trackUrl, title, artist, coverArt }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([0.8]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card p-6 rounded-xl border border-white/10 backdrop-blur-md">
      <audio ref={audioRef} src={trackUrl} volume={volume[0]} />
      
      <div className="flex items-center gap-4 mb-4">
        {coverArt && (
          <img src={coverArt} alt={title} className="w-16 h-16 rounded-lg object-cover" />
        )}
        <div>
          <h4 className="font-semibold text-white">{title}</h4>
          <p className="text-sm text-white/70">{artist}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={togglePlayPause}
            className="bg-studio-accent hover:bg-studio-accent/80"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button variant="ghost" size="sm">
            <SkipForward className="h-4 w-4" />
          </Button>

          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs text-white/60">{formatTime(currentTime)}</span>
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleProgressChange}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-white/60">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-white/60" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={1}
              step={0.1}
              className="w-20"
            />
          </div>
        </div>

        {/* Waveform visualization placeholder */}
        <div className="h-16 bg-gradient-to-r from-studio-accent/20 to-blue-500/20 rounded-lg flex items-end gap-1 p-2">
          {Array.from({ length: 40 }).map((_, index) => (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-studio-accent to-blue-500 rounded-t opacity-60"
              style={{ 
                height: `${Math.random() * 80 + 20}%`,
                opacity: currentTime > (index / 40) * duration ? 1 : 0.3
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
