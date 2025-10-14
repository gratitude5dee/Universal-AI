import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Heart,
  MoreHorizontal,
  Plus,
  Mic,
  Upload,
  Sparkles,
  Download,
  Clock,
  Radio,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/context/AuthContext';

interface Podcast {
  id: string;
  title: string;
  description: string;
  audioContent?: string;
  audioUrl?: string;
  duration: number;
  createdAt: string;
  voiceId?: string;
  style?: string;
}

type PodcastRow = Database['public']['Tables']['podcasts']['Row'];

interface PodcastFunctionResponse {
  id: string;
  title: string;
  description: string;
  script?: string;
  audioContent: string;
  voiceId: string;
  style: string;
  duration: number;
  generatedAt: string;
}

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  labels: Record<string, string>;
}

const GenerativePodcastsInterface = () => {
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoadingPodcasts, setIsLoadingPodcasts] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  
  // Generation form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [script, setScript] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [podcastStyle, setPodcastStyle] = useState('conversational');
  
  // Voice cloning state
  const [voiceName, setVoiceName] = useState('');
  const [voiceDescription, setVoiceDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const mapPodcastRow = useCallback((row: PodcastRow): Podcast => ({
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    audioContent: row.audio_base64 ?? undefined,
    audioUrl: row.audio_url ?? undefined,
    duration: row.duration ?? 0,
    createdAt: row.created_at,
    voiceId: row.voice_id ?? undefined,
    style: row.style ?? 'Custom',
  }), []);

  const fetchPodcasts = useCallback(async () => {
    if (!user) {
      setPodcasts([]);
      setCurrentPodcast(null);
      setIsPlaying(false);
      setProgress(0);
      setIsLoadingPodcasts(false);
      return;
    }

    setIsLoadingPodcasts(true);

    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPodcasts((data ?? []).map(mapPodcastRow));
    } catch (error) {
      console.error('Error loading podcasts:', error);
      toast({
        title: 'Error loading podcasts',
        description: 'We could not load your podcasts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPodcasts(false);
    }
  }, [user, mapPodcastRow, toast]);

  // Load voices on component mount
  const loadVoices = useCallback(async () => {
    try {
      setIsLoadingVoices(true);
      const { data, error } = await supabase.functions.invoke('voice-management', {
        body: {},
      });

      if (error) throw error;
      if (!data?.success) {
        throw new Error(data?.error || 'Unable to load voices');
      }

      const authorizedVoices: Voice[] = data.voices || [];
      setVoices(authorizedVoices);
      if (authorizedVoices.length > 0) {
        setSelectedVoice(authorizedVoices[0].voice_id);
      } else {
        setSelectedVoice('');
      }
    } catch (error) {
      console.error('Error loading voices:', error);
      toast({
        title: "Error",
        description: "Failed to load voices. Please check your ElevenLabs API configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingVoices(false);
    }
  }, [toast]);

  useEffect(() => {
    loadVoices();
  }, [loadVoices]);

  const generatePodcast = async () => {
    if (!title || !script || !selectedVoice) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, script, and select a voice.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate and save podcasts.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke<PodcastFunctionResponse>('podcast-generator', {
        body: {
          title,
          description,
          script,
          voiceId: selectedVoice,
          style: podcastStyle,
        },
      });

      if (error) throw error;
      if (!data) {
        throw new Error('Podcast generation returned no data.');
      }

      const generatedPodcast = data;

      if (!generatedPodcast.audioContent) {
        throw new Error('Audio content missing from generation response.');
      }

      const { data: insertedPodcast, error: insertError } = await supabase
        .from('podcasts')
        .insert({
          user_id: user.id,
          title: generatedPodcast.title,
          description: generatedPodcast.description ?? description ?? null,
          audio_base64: generatedPodcast.audioContent,
          voice_id: generatedPodcast.voiceId,
          style: generatedPodcast.style ?? podcastStyle,
          duration: generatedPodcast.duration ?? Math.max(Math.ceil(script.length / 150), 1),
        })
        .select()
        .single();

      if (insertError || !insertedPodcast) {
        throw insertError || new Error('Failed to save the generated podcast.');
      }

      const savedPodcast = mapPodcastRow(insertedPodcast);
      setPodcasts(prev => [savedPodcast, ...prev]);
      setCurrentPodcast(savedPodcast);
      setProgress(0);

      // Clear form
      setTitle('');
      setDescription('');
      setScript('');

      toast({
        title: "Podcast Generated!",
        description: `"${savedPodcast.title}" has been created successfully.`,
      });

    } catch (error) {
      console.error('Error generating podcast:', error);
      const message = error instanceof Error ? error.message : 'Failed to generate podcast. Please try again.';
      toast({
        title: "Generation Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const cloneVoice = async () => {
    if (!voiceName || uploadedFiles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a voice name and upload audio samples.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to clone a voice.",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append('name', voiceName);
      formData.append('description', voiceDescription);
      uploadedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(
        `https://ixkkrousepsiorwlaycp.functions.supabase.co/functions/v1/voice-management?action=clone`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      const { data, error } = await supabase.functions.invoke('voice-management', {
        body: formData,
      });

      if (error) throw error;

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error);
      }

      setVoiceName('');
      setVoiceDescription('');
      setUploadedFiles([]);
      loadVoices(); // Refresh voice list

      toast({
        title: "Voice Cloned!",
        description: "Your voice has been cloned successfully.",
      });

    } catch (error) {
      console.error('Error cloning voice:', error);
      toast({
        title: "Cloning Failed",
        description: error.message || "Failed to clone voice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const playPodcast = (podcast: Podcast) => {
    if (!podcast.audioUrl && !podcast.audioContent) {
      toast({
        title: 'Audio unavailable',
        description: 'This podcast does not have audio data yet.',
        variant: 'destructive',
      });
      return;
    }

    if (currentPodcast?.id === podcast.id && isPlaying) {
      setIsPlaying(false);
      audioRef.current?.pause();
      return;
    }

    setCurrentPodcast(podcast);
    setProgress(0);

    if (audioRef.current) {
      if (podcast.audioUrl) {
        audioRef.current.src = podcast.audioUrl;
      } else if (podcast.audioContent) {
        audioRef.current.src = `data:audio/mp3;base64,${podcast.audioContent}`;
      }

      audioRef.current.currentTime = 0;
      void audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const downloadPodcast = (podcast: Podcast) => {
    if (podcast.audioUrl) {
      const link = document.createElement('a');
      link.href = podcast.audioUrl;
      link.download = `${podcast.title}.mp3`;
      link.rel = 'noopener';
      link.click();
      return;
    }

    if (podcast.audioContent) {
      const link = document.createElement('a');
      link.href = `data:audio/mp3;base64,${podcast.audioContent}`;
      link.download = `${podcast.title}.mp3`;
      link.click();
      return;
    }

    toast({
      title: 'Download unavailable',
      description: 'No audio data is available to download for this podcast.',
      variant: 'destructive',
    });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      {/* Audio element for playback */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => {
          const audio = e.target as HTMLAudioElement;
          if (audio.duration) {
            setProgress((audio.currentTime / audio.duration) * 100);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(0);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Generative Podcasts
            </h1>
            <p className="text-gray-400 mt-1">Create AI-powered podcasts with custom voices</p>
          </div>
          
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Podcast
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-green-400">Generate New Podcast</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Podcast Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter podcast title"
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description"
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="script">Script or Topic</Label>
                    <Textarea
                      id="script"
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      placeholder="Enter your podcast script or just a topic (AI will expand it)"
                      rows={4}
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="voice">Voice</Label>
                      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {voices.map((voice) => (
                            <SelectItem key={voice.voice_id} value={voice.voice_id}>
                              {voice.name} ({voice.category})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="style">Style</Label>
                      <Select value={podcastStyle} onValueChange={setPodcastStyle}>
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="conversational">Conversational</SelectItem>
                          <SelectItem value="news">News Style</SelectItem>
                          <SelectItem value="storytelling">Storytelling</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button 
                    onClick={generatePodcast} 
                    disabled={isGenerating || !title || !script || !selectedVoice}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Podcast
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-600 hover:bg-gray-800">
                  <Mic className="w-4 h-4 mr-2" />
                  Clone Voice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-blue-400">Clone Voice</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="voiceName">Voice Name</Label>
                    <Input
                      id="voiceName"
                      value={voiceName}
                      onChange={(e) => setVoiceName(e.target.value)}
                      placeholder="Enter voice name"
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="voiceDescription">Description (Optional)</Label>
                    <Input
                      id="voiceDescription"
                      value={voiceDescription}
                      onChange={(e) => setVoiceDescription(e.target.value)}
                      placeholder="Describe the voice"
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="audioFiles">Audio Samples</Label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        multiple
                        accept="audio/*"
                        onChange={(e) => setUploadedFiles(Array.from(e.target.files || []))}
                        className="hidden"
                        id="audioFiles"
                      />
                      <label htmlFor="audioFiles" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-400">Upload audio samples (MP3, WAV)</p>
                        <p className="text-xs text-gray-500 mt-1">At least 1 minute of clear audio recommended</p>
                      </label>
                      {uploadedFiles.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-green-400">{uploadedFiles.length} files selected</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    onClick={cloneVoice} 
                    disabled={!voiceName || uploadedFiles.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Clone Voice
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
          {isLoadingPodcasts ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Loader2 className="w-12 h-12 text-green-400 animate-spin mb-4" />
              <h3 className="text-xl font-semibold mb-2">Loading podcasts</h3>
              <p className="text-gray-400 max-w-md">
                We&apos;re fetching your saved episodes.
              </p>
            </div>
          ) : podcasts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gray-800 rounded-full p-6 mb-6">
                <Radio className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No podcasts yet</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Create your first AI-generated podcast with custom voices and scripts
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Generate Your First Podcast
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {podcasts.map((podcast) => (
                <motion.div
                  key={podcast.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-200 overflow-hidden">
                    <div className="relative">
                      <div className="aspect-square bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                          <Radio className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="lg"
                          onClick={() => playPodcast(podcast)}
                          className="rounded-full w-12 h-12 bg-green-600 hover:bg-green-700"
                        >
                          {currentPodcast?.id === podcast.id && isPlaying ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6 ml-1" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-white truncate mb-1">{podcast.title}</h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{podcast.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {podcast.duration} min
                        </div>
                        <Badge variant="outline" className="border-gray-600 text-gray-400">
                          {podcast.style}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => playPodcast(podcast)}
                            className="hover:bg-gray-700"
                          >
                            {currentPodcast?.id === podcast.id && isPlaying ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => downloadPodcast(podcast)}
                            className="hover:bg-gray-700"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button size="sm" variant="ghost" className="hover:bg-gray-700">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Now Playing Bar */}
      <AnimatePresence>
        {currentPodcast && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="flex-shrink-0 bg-gray-900 border-t border-gray-700 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded flex items-center justify-center">
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{currentPodcast.title}</h4>
                  <p className="text-sm text-gray-400">Generated Podcast</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button size="sm" variant="ghost" className="hover:bg-gray-800">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => playPodcast(currentPodcast)}
                  className="bg-green-600 hover:bg-green-700 rounded-full w-10 h-10"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </Button>
                <Button size="sm" variant="ghost" className="hover:bg-gray-800">
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <Button size="sm" variant="ghost" className="hover:bg-gray-800">
                  <Heart className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <Slider
                    value={[volume * 100]}
                    onValueChange={(value) => setVolume(value[0] / 100)}
                    max={100}
                    step={1}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>0:00</span>
                <span>{currentPodcast.duration}:00</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-green-500 h-1 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GenerativePodcastsInterface;