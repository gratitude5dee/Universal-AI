
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

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume[0];
    }
  }, [volume]);

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
    <div className="glass-card p-6 rounded-xl border border-white/10 backdrop-blur-md bg-gradient-to-br from-white/5 to-white/10">
      <audio ref={audioRef} src={trackUrl} />
      
      <div className="flex items-center gap-6 mb-6">
        {coverArt ? (
          <img src={coverArt} alt={title} className="w-20 h-20 rounded-xl object-cover shadow-lg" />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-studio-accent to-blue-500 flex items-center justify-center shadow-lg">
            <Play className="w-8 h-8 text-white" />
          </div>
        )}
        <div className="flex-1">
          <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
          <p className="text-studio-accent font-medium">{artist}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button 
            onClick={togglePlayPause}
            size="lg"
            className="bg-gradient-to-r from-studio-accent to-blue-500 hover:from-studio-accent/90 hover:to-blue-500/90 shadow-xl"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
            <SkipForward className="h-5 w-5" />
          </Button>

          <div className="flex-1 flex items-center gap-3">
            <span className="text-sm text-white/70 font-medium min-w-[45px]">{formatTime(currentTime)}</span>
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleProgressChange}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-white/70 font-medium min-w-[45px]">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center gap-3">
            <Volume2 className="h-5 w-5 text-white/60" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={1}
              step={0.1}
              className="w-24"
            />
          </div>
        </div>

        {/* Enhanced Waveform visualization */}
        <div className="h-20 bg-gradient-to-r from-studio-accent/10 via-blue-500/10 to-purple-500/10 rounded-xl flex items-end gap-1 p-3 border border-white/5">
          {Array.from({ length: 60 }).map((_, index) => {
            const height = Math.random() * 80 + 20;
            const isActive = currentTime > (index / 60) * duration;
            return (
              <div
                key={index}
                className={`flex-1 rounded-t transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-t from-studio-accent via-blue-500 to-purple-400 opacity-100 shadow-sm' 
                    : 'bg-gradient-to-t from-white/20 to-white/10 opacity-40'
                }`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
