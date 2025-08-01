import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Header from '@/components/landing/Header';
import PhoneMockup from '@/components/landing/PhoneMockup';

// Import feature images
import featureAiChat from '@/assets/feature-ai-chat.jpg';
import featureIdeasToProjects from '@/assets/feature-ideas-to-projects.jpg';
import featureInTheLoop from '@/assets/feature-in-the-loop.jpg';
import featureBuildProjects from '@/assets/feature-build-projects.jpg';
import featureCalendar from '@/assets/feature-calendar.jpg';

// Section component for alternating content and mockups
const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  mockupSrc: string;
  mockupAlt: string;
  reverse?: boolean;
}> = ({ title, children, mockupSrc, mockupAlt, reverse = false }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section 
      ref={ref}
      className={`py-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center ${
        reverse ? 'lg:grid-flow-dense' : ''
      }`}
    >
      <motion.div
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`space-y-6 ${reverse ? 'lg:col-start-2' : ''}`}
      >
        <h2 
          className="text-5xl font-semibold leading-tight"
          style={{
            background: 'linear-gradient(180deg, #ffffff 70%, #a3a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}
        >
          {title}
        </h2>
        <p 
          className="text-xl leading-relaxed max-w-md"
          style={{ color: 'var(--text-secondary)' }}
        >
          {children}
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        className={reverse ? 'lg:col-start-1 lg:row-start-1' : ''}
      >
        <PhoneMockup screenContentSrc={mockupSrc} alt={mockupAlt} />
      </motion.div>
    </section>
  );
};

const FYILanding = () => {
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div className="min-h-screen text-white overflow-hidden">
      <Header />
      
      <main className="w-full max-w-6xl mx-auto px-8">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="min-h-screen flex flex-col items-center justify-center text-center space-y-12 pt-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut", staggerChildren: 0.15 }}
            className="space-y-6"
          >
            <motion.h1 
              className="text-4xl md:text-7xl font-bold leading-tight max-w-4xl"
              style={{
                background: 'linear-gradient(180deg, #ffffff 70%, #a3a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-2px',
                textShadow: '0 0 80px rgba(255, 255, 255, 0.15)'
              }}
            >
              The ultimate productivity tool for creatives{' '}
              <span role="img" aria-label="fire">🔥</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Brainstorm, collaborate, and manage your projects from idea to reality. All in one place.
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            <PhoneMockup screenContentSrc={featureAiChat} alt="AI chat for music video idea" />
          </motion.div>
        </section>

        {/* Feature Sections */}
        <Section 
          title="Turn ideas into projects" 
          mockupSrc={featureIdeasToProjects}
          mockupAlt="Turning an idea into a Formula 1 project"
        >
          FYI.AI takes your ideas to the next level by turning them into Projects. Turn dialogue into film treatments, verses into albums, and sketches into business plans. The applications are infinite.
        </Section>
        
        <Section 
          title="Stay in the loop" 
          mockupSrc={featureInTheLoop}
          mockupAlt="AI summarizing a team chat"
          reverse={true}
        >
          Add FYI.AI to group chats to summarize conversations, recall key information, and schedule follow-ups. Never lose track of an important decision again.
        </Section>
        
        <Section 
          title="Build and present" 
          mockupSrc={featureBuildProjects}
          mockupAlt="Project gallery view"
        >
          Organize your work into beautiful project spaces. Store files, manage assets, add team members, and present your work in a whole new way.
        </Section>

        <Section 
          title="Never miss a deadline" 
          mockupSrc={featureCalendar}
          mockupAlt="Scheduling an event in FYI Calendar"
          reverse={true}
        >
          Keep track of project deadlines and deliverables with an integrated calendar. Schedule team meetings and launch calls directly from your workspace.
        </Section>
      </main>
      
      {/* Footer */}
      <footer 
        className="text-center py-20 px-8 mt-20"
        style={{
          borderTop: '1px solid var(--glass-border)',
          color: 'var(--text-secondary)'
        }}
      >
        <p className="text-sm">
          © {new Date().getFullYear()} FYI. A UniversalAI Product.
        </p>
      </footer>
    </div>
  );
};

export default FYILanding;