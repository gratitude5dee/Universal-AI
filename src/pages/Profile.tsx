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
      <div className="space-y-8 mb-10">
        {/* Enhanced Header Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-studio-accent/20 p-3 rounded-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                👤
              </motion.div>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-studio-charcoal">Artist Profile Hub</h1>
              <p className="text-studio-muted mt-1">Manage your brand identity, press materials, and creative presence</p>
            </div>
          </div>
          <ProfileHeader />
        </motion.div>
        
        {/* Enhanced Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Left Navigation */}
          <aside className="lg:col-span-1 lg:sticky top-6 self-start">
            <motion.div 
              className="glass-card p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-sm font-medium text-studio-charcoal mb-4 flex items-center gap-2">
                📋 Profile Sections
              </h3>
              <nav className="space-y-1">
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'w-full text-left p-3 rounded-lg text-sm transition-all duration-300 backdrop-blur-sm border border-transparent',
                      activeSection === section.id
                        ? 'bg-studio-accent text-white font-semibold shadow-lg border-studio-accent/20 transform scale-105'
                        : 'text-studio-charcoal hover:bg-white/50 hover:text-studio-accent border-studio-sand/20 hover:border-studio-accent/30 hover:shadow-sm'
                    )}
                    whileHover={{ x: activeSection === section.id ? 0 : 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-between">
                      {section.label}
                      {activeSection === section.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </span>
                  </motion.button>
                ))}
              </nav>
              
              {/* Navigation Stats */}
              <motion.div 
                className="mt-6 pt-4 border-t border-studio-sand/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-xs text-studio-muted space-y-2">
                  <div className="flex justify-between">
                    <span>Profile Completion</span>
                    <span className="font-medium text-studio-accent">85%</span>
                  </div>
                  <div className="w-full bg-studio-sand/30 rounded-full h-1.5">
                    <motion.div 
                      className="bg-studio-accent rounded-full h-1.5"
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </aside>

          {/* Enhanced Right Content */}
          <main ref={contentRef} className="lg:col-span-3 space-y-8 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-studio-accent/30 scrollbar-track-transparent">
            {/* Content with enhanced spacing and animations */}
            <motion.div 
              ref={el => sectionRefs.current['press-kit'] = el}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="scroll-mt-8"
            >
              <PressKitSection />
            </motion.div>
            
            <motion.div 
              ref={el => sectionRefs.current['about'] = el}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="scroll-mt-8"
            >
              <AboutSection />
            </motion.div>
            
            <motion.div 
              ref={el => sectionRefs.current['highlights'] = el}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="scroll-mt-8"
            >
              <CoverHighlights />
            </motion.div>
            
            <motion.div 
              ref={el => sectionRefs.current['photos'] = el}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="scroll-mt-8"
            >
              <ArtistPhotos />
            </motion.div>
            
            <motion.div 
              ref={el => sectionRefs.current['linktree'] = el}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="scroll-mt-8"
            >
              <LinktreeSection />
            </motion.div>
            
            <motion.div 
              ref={el => sectionRefs.current['style-guide'] = el}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="scroll-mt-8"
            >
              <StyleGuideSection />
            </motion.div>
            
            <motion.div 
              ref={el => sectionRefs.current['settings'] = el}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="scroll-mt-8"
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