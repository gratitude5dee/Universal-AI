import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface FeatureSectionProps {
  title: string;
  children: React.ReactNode;
  image: string;
  imageSide?: 'left' | 'right';
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ 
  title, 
  children, 
  image, 
  imageSide = 'right' 
}) => {
  const { ref: textRef, inView: textInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: imageRef, inView: imageInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const textContent = (
    <motion.div 
      ref={textRef}
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={textInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h2 className="text-4xl font-extrabold leading-tight tracking-wide uppercase text-white">
        {title}
      </h2>
      <p className="text-lg leading-relaxed text-gray-300 max-w-[500px]">
        {children}
      </p>
    </motion.div>
  );

  const imageContent = (
    <motion.div 
      ref={imageRef}
      className="flex justify-center"
      initial={{ opacity: 0, x: imageSide === 'right' ? 50 : -50 }}
      animate={imageInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <img src={image} alt={title} className="w-full max-w-[550px] mx-auto" />
    </motion.div>
  );

  return (
    <section className={`py-40 min-h-screen flex items-center`}>
      <div className="px-[5%] max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {imageSide === 'left' ? [imageContent, textContent] : [textContent, imageContent]}
      </div>
    </section>
  );
};

export default FeatureSection;