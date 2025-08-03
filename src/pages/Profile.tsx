import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PressKitSection from '@/components/profile/PressKitSection';
import AboutSection from '@/components/profile/AboutSection';
import CoverHighlights from '@/components/profile/CoverHighlights';
import ArtistPhotos from '@/components/profile/ArtistPhotos';
import LinktreeSection from '@/components/profile/LinktreeSection';
import StyleGuideSection from '@/components/profile/StyleGuideSection';
import SettingsSection from '@/components/profile/SettingsSection';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState('press-kit');
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  const sections = [
    { id: 'press-kit', label: 'Press Kit' },
    { id: 'about', label: 'About Me' },
    { id: 'highlights', label: 'Cover Highlights' },
    { id: 'photos', label: 'Artist Photos' },
    { id: 'linktree', label: 'One-Pager' },
    { id: 'style-guide', label: 'Style Guide' },
    { id: 'settings', label: 'Settings' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: contentRef.current, threshold: 0.3, rootMargin: "-40% 0px -60% 0px" }
    );

    Object.values(sectionRefs.current).forEach((el) => {
        if(el) observer.observe(el as Element);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((el) => {
        if(el) observer.unobserve(el as Element);
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <ProfileHeader />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Left Navigation */}
          <aside className="lg:col-span-1 lg:sticky top-6 self-start">
            <motion.nav 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'w-full text-left p-3 rounded-lg text-sm transition-all backdrop-blur-sm',
                    activeSection === section.id
                      ? 'bg-studio-accent text-white font-semibold shadow-lg border border-white/20'
                      : 'text-white/70 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
                  )}
                >
                  {section.label}
                </motion.button>
              ))}
            </motion.nav>
          </aside>

          {/* Right Content */}
          <main ref={contentRef} className="lg:col-span-3 space-y-8 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <motion.div 
              ref={el => sectionRefs.current['press-kit'] = el}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PressKitSection />
            </motion.div>
            <motion.div 
              ref={el => sectionRefs.current['about'] = el}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AboutSection />
            </motion.div>
            <motion.div 
              ref={el => sectionRefs.current['highlights'] = el}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CoverHighlights />
            </motion.div>
            <motion.div 
              ref={el => sectionRefs.current['photos'] = el}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ArtistPhotos />
            </motion.div>
            <motion.div 
              ref={el => sectionRefs.current['linktree'] = el}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <LinktreeSection />
            </motion.div>
            <motion.div 
              ref={el => sectionRefs.current['style-guide'] = el}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <StyleGuideSection />
            </motion.div>
            <motion.div 
              ref={el => sectionRefs.current['settings'] = el}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <SettingsSection />
            </motion.div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;