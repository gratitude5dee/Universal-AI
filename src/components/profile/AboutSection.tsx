import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AboutSection = () => (
  <Card id="about" className="glass-card p-6">
    <h3 className="text-xl font-semibold mb-4 text-white text-shadow-sm">About Me</h3>
    <Tabs defaultValue="professional">
      <TabsList className="bg-white/10 border-white/20">
        <TabsTrigger value="professional" className="text-white data-[state=active]:bg-cyan-400/20">
          Professional Bio
        </TabsTrigger>
        <TabsTrigger value="one-pager" className="text-white data-[state=active]:bg-cyan-400/20">
          Booking One-Pager
        </TabsTrigger>
      </TabsList>
      <TabsContent value="professional" className="mt-4 text-white/80 text-sm leading-relaxed glass-card p-4">
        <textarea 
          className="w-full bg-transparent border-none resize-none focus:outline-none"
          rows={6}
          defaultValue="Gratitud3.eth is a visionary artist and producer whose work transcends traditional boundaries, blending anime-inspired visuals with profound electronic soundscapes. With a portfolio that includes the critically acclaimed 'MONKS&MAGIC' and the introspective 'THE TAPE,' Gratitud3.eth explores themes of spirituality, technology, and the human condition."
        />
      </TabsContent>
      <TabsContent value="one-pager" className="mt-4 text-white/80 text-sm leading-relaxed glass-card p-4">
        <textarea 
          className="w-full bg-transparent border-none resize-none focus:outline-none"
          rows={6}
          defaultValue="**For Booking Agents:**&#10;Artist: Gratitud3.eth&#10;Genre: Anime-infused Electronic, Lo-fi Beats&#10;Key Projects: MONKS&MAGIC (2025), THE TAPE&#10;Seeking: Live performances, festival bookings, and collaborations.&#10;Contact for EPK and availability."
        />
      </TabsContent>
    </Tabs>
  </Card>
);

export default AboutSection;