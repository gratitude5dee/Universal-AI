import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/landing/Header';
import FeatureSection from '@/components/landing/FeatureSection';
import { useInView } from 'react-intersection-observer';

function FYILanding() {
  const { ref: heroTextRef, inView: heroTextInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: heroImageRef, inView: heroImageInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: centeredImageRef, inView: centeredImageInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: buildProjectsRef, inView: buildProjectsInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 to-blue-800 min-h-screen flex items-center pt-24 overflow-hidden">
          <div className="px-[5%] max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
            <motion.div 
              ref={heroTextRef}
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 30 }}
              animate={heroTextInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-8">
                FYI is the ultimate productivity tool for creatives{' '}
                <span role="img" aria-label="fire">🔥</span>
              </h1>
            </motion.div>
            <motion.div 
              ref={heroImageRef}
              className="lg:col-span-1 relative left-[5%]"
              initial={{ opacity: 0, x: 50 }}
              animate={heroImageInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            >
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop" 
                alt="FYI app on a laptop" 
                className="w-full max-w-lg rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </section>

        {/* Centered AI Chat Image Section */}
        <section className="py-32 flex justify-center items-center">
          <motion.div
            ref={centeredImageRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={centeredImageInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <img 
              src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=600&fit=crop" 
              alt="AI chat brainstorming for a music video" 
              className="max-w-sm w-full rounded-lg shadow-xl"
            />
          </motion.div>
        </section>

        {/* Turn Ideas Into Projects Section */}
        <FeatureSection 
          title="Turn your ideas into projects" 
          image="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=800&fit=crop"
        >
          FYI.AI takes your ideas to the next level by turning them into Projects. FYI.AI will save and organize all your content, help you fill in the gaps, and organize a plan of action. Turn dialogue into film treatments. Turn verses into songs and albums. Turn product ideas into full-fledged business plans. The applications are infinite. FYI.AI accelerates your creative flow, transforming ambitious ideas into reality.
        </FeatureSection>

        {/* FYI in the Loop Section */}
        <FeatureSection 
          title="FYI in the Loop" 
          image="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=600&h=800&fit=crop" 
          imageSide="left"
        >
          Add FYI.AI to group chats and project chats to collaborate with your entire team. FYI.AI can summarize team chats and recall information that's been lost in a fast-moving conversation. Never lose track of important information again.
        </FeatureSection>

        {/* Build Projects Section */}
        <section className="bg-blue-600 py-40 relative z-10">
          <div className="max-w-[1400px] mx-auto px-[5%] grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
            <motion.div 
              className="absolute top-1/2 left-[10%] transform -translate-y-1/2 w-1/4 max-w-sm z-20 hidden lg:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <img 
                src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=600&fit=crop" 
                alt="Building projects in FYI" 
                className="w-full rounded-lg shadow-2xl"
                style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.4))' }}
              />
            </motion.div>
            
            <div className="lg:col-start-2 flex flex-col gap-6">
              <motion.div
                ref={buildProjectsRef}
                initial={{ opacity: 0, y: 20 }}
                animate={buildProjectsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h2 className="text-4xl font-extrabold leading-tight uppercase text-white mb-6">
                  BUILD PROJECTS
                </h2>
                <p className="text-lg leading-relaxed max-w-lg mb-8">
                  Organize your work into Projects. Store files, manage assets, add team members and guests. Use projects as your collaborative workspace, a personal archive, or a new way to present your work.
                </p>
                <a 
                  href="#" 
                  className="bg-white text-black px-8 py-4 rounded-full font-bold inline-block transition-transform duration-200 hover:scale-105"
                >
                  READ MORE
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FYI Calendar Section */}
        <FeatureSection 
          title="FYI Calendar" 
          image="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=800&fit=crop" 
          imageSide="left"
        >
          Keep track of Project deadlines and deliverables. Schedule team meetings and launch calls easily from event reminders. Create 1-1 or group events with any of your FYI contacts.
        </FeatureSection>
      </main>
      
      <footer className="text-center py-16 text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} FYI. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default FYILanding;