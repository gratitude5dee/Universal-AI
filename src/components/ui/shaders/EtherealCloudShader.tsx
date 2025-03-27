
import React, { useState, useEffect } from 'react';
import CloudShader from './CloudShader';

interface EtherealCloudShaderProps {
  className?: string;
}

const EtherealCloudShader: React.FC<EtherealCloudShaderProps> = ({ className }) => {
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setIsWebGLSupported(!!gl);

    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleReducedMotionChange);
    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  // If WebGL is not supported or user prefers reduced motion, show fallback gradient
  if (!isWebGLSupported || prefersReducedMotion) {
    return (
      <div
        className={`fixed inset-0 ${className}`}
        style={{
          background: 'linear-gradient(135deg, var(--color-base-deep) 0%, var(--color-base-deep-lighter) 100%)',
          zIndex: -10
        }}
      >
        {/* Add subtle noise texture for more visual interest in the fallback */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px'
          }}
        />
      </div>
    );
  }

  // If everything is supported, render the WebGL shader
  return <CloudShader />;
};

export default EtherealCloudShader;
