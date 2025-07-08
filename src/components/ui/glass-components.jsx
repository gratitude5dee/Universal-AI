// Glass UI Components Library
// Save as: components/ui/glass-components.jsx

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

// Noise texture component (can be created as an SVG or use CSS)
export const NoiseTexture = ({ opacity = 0.03, className = "" }) => (
  <div className={`noise-overlay ${className}`} style={{ opacity }} />
);

// Floating orb component
export const FloatingOrb = ({
  color = "purple",
  size = "96",
  position = { top: 0, left: 0 },
  delay = 0,
  duration = 6
}) => (
  <motion.div
    className={`absolute rounded-full bg-${color}-500 mix-blend-multiply filter blur-3xl opacity-20`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      ...position
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

// Glass panel with all effects
export const GlassPanel = ({
  children,
  className = "",
  blur = "3xl",
  withNoise = true,
  withBorder = true,
  ...props
}) => (
  <div
    className={`
      relative backdrop-blur-${blur}
      bg-white/10 rounded-2xl
      ${withBorder ? 'border border-white/20' : ''}
      shadow-2xl overflow-hidden
      ${className}
    `}
    {...props}
  >
    {withNoise && <NoiseTexture />}
    {withBorder && (
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5" />
    )}
    <div className="relative z-10">{children}</div>
  </div>
);

// 3D tilt card component
export const Card3D = ({
  children,
  className = "",
  maxRotation = 15,
  scale = 1.05,
  withLiquid = true
}) => {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateY = useTransform(mouseX, [-0.5, 0.5], [maxRotation, -maxRotation]);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [-maxRotation, maxRotation]);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale }}
      style={{
        rotateY: springRotateY,
        rotateX: springRotateX,
        transformStyle: "preserve-3d",
      }}
    >
      {withLiquid && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) => `radial-gradient(circle at ${x * 100 + 50}% ${y * 100 + 50}%, rgba(120, 119, 198, 0.3), rgba(255, 119, 198, 0.1), transparent 40%)`
            ),
            filter: "blur(40px)",
          }}
        />
      )}
      {children}
    </motion.div>
  );
};

// Animated gradient border
export const GradientBorder = ({
  children,
  className = "",
  borderWidth = 2,
  animationDuration = 10,
  colors = ["from-cyan-500", "via-purple-500", "to-pink-500"]
}) => (
  <div className={`relative ${className}`}>
    <div
      className={`absolute inset-0 rounded-2xl p-[${borderWidth}px] bg-gradient-to-r ${colors.join(' ')} animate-hue-rotate`}
      style={{ animationDuration: `${animationDuration}s` }}
    />
    <div className="relative bg-black/90 rounded-2xl">
      {children}
    </div>
  </div>
);

// Magnetic button component
export const MagneticButton = ({ children, className = "", ...props }) => {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current || !isHovered) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * 0.1;
    const distanceY = (e.clientY - centerY) * 0.1;

    x.set(distanceX);
    y.set(distanceY);
  };

  useEffect(() => {
    if (!isHovered) {
      x.set(0);
      y.set(0);
    }
  }, [isHovered, x, y]);

  return (
    <motion.button
      ref={buttonRef}
      className={`magnetic-button ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        x: springX,
        y: springY,
      }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Holographic text component
export const HolographicText = ({ children, className = "", as: Component = "span" }) => (
  <Component className={`text-holographic ${className}`}>
    {children}
  </Component>
);

// Liquid background component
export const LiquidBackground = ({
  colors = ["purple", "cyan", "pink"],
  count = 3,
  baseSize = 96
}) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {colors.slice(0, count).map((color, i) => (
      <FloatingOrb
        key={i}
        color={color}
        size={baseSize}
        position={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
        delay={i * 2}
        duration={6 + i * 2}
      />
    ))}
  </div>
);

// Shimmer effect component
export const ShimmerEffect = ({ className = "" }) => (
  <div className={`absolute inset-0 -translate-x-full animate-shimmer ${className}`}>
    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
);

// Particle system component
export const ParticleField = ({ count = 50, className = "" }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default {
  NoiseTexture,
  FloatingOrb,
  GlassPanel,
  Card3D,
  GradientBorder,
  MagneticButton,
  HolographicText,
  LiquidBackground,
  ShimmerEffect,
  ParticleField,
};
