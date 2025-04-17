
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './CinematicIntro.module.css';

interface CinematicIntroProps {
  onComplete?: () => void;
  commandText?: string;
  matrixChars?: string;
  noiseColor?: string;
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onComplete,
  commandText = 'pip install universalai',
  matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ',
  noiseColor = '270, 90%, 60%',
}) => {
  const [typedCommand, setTypedCommand] = useState('$ ');
  const [showCursor, setShowCursor] = useState(true);
  const [stage, setStage] = useState<'typing' | 'erupting' | 'transforming' | 'noise' | 'fading' | 'done'>('typing');
  const [showTerminal, setShowTerminal] = useState(true);
  const [showCanvas, setShowCanvas] = useState(false);
  const [containerVisible, setContainerVisible] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const stageTimeoutRef = useRef<NodeJS.Timeout>();

  // --- Canvas Animation State ---
  const dropsRef = useRef<number[]>([]); // Y position for matrix drops per column
  const noiseParticlesRef = useRef<{ x: number; y: number; intensity: number; }[]>([]);
  const transitionProgressRef = useRef(0); // 0 = matrix, 1 = noise

  // Enhanced timing configuration
  const TYPING_SPEED_MS = 60; // Faster typing for better engagement
  const MATRIX_ERUPTION_DURATION_MS = 3000; // Longer matrix effect
  const TRANSFORM_DURATION_MS = 2000; // Smoother transition
  const NOISE_DURATION_MS = 2500; // Balanced noise duration
  const FADE_OUT_DURATION_MS = 1500; // Smoother fade out
  const FONT_SIZE = 16;
  const NOISE_PARTICLE_COUNT = 7000; // More particles for richer effect

  // Enhanced stage transition logic
  useEffect(() => {
    clearTimeout(stageTimeoutRef.current);

    if (stage === 'typing') {
      let i = 0;
      const targetCommand = '$ ' + commandText;
      const intervalId = setInterval(() => {
        setTypedCommand((prev) => {
          // Add random glitch effect to previously typed characters
          const glitched = prev.split('').map(char => 
            Math.random() < 0.05 ? matrixChars[Math.floor(Math.random() * matrixChars.length)] : char
          ).join('');
          return glitched + targetCommand[i + 2];
        });
        i++;
        if (i + 2 >= targetCommand.length) {
          clearInterval(intervalId);
          setShowCursor(false);
          stageTimeoutRef.current = setTimeout(() => setStage('erupting'), 800);
        }
      }, TYPING_SPEED_MS);
      return () => clearInterval(intervalId);
    } else if (stage === 'erupting') {
      setShowTerminal(false);
      setShowCanvas(true);
      transitionProgressRef.current = 0;
      stageTimeoutRef.current = setTimeout(() => setStage('transforming'), MATRIX_ERUPTION_DURATION_MS);
    } else if (stage === 'transforming') {
      stageTimeoutRef.current = setTimeout(() => setStage('noise'), TRANSFORM_DURATION_MS);
    } else if (stage === 'noise') {
      stageTimeoutRef.current = setTimeout(() => setStage('fading'), NOISE_DURATION_MS);
    } else if (stage === 'fading') {
      setContainerVisible(false);
      stageTimeoutRef.current = setTimeout(() => {
        setStage('done');
        if (onComplete) onComplete();
      }, FADE_OUT_DURATION_MS + 100);
    }

    return () => clearTimeout(stageTimeoutRef.current);
  }, [stage, commandText, onComplete, matrixChars]);

  // Enhanced drawing logic with improved transitions
  const draw = useCallback((ctx: CanvasRenderingContext2D, frameCount: number, columns: number) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; // Slightly more transparent for smoother trails
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = `${FONT_SIZE}px monospace`;

    if (stage === 'transforming') {
      const easedProgress = 1 - Math.cos((transitionProgressRef.current * Math.PI) / 2); // Smooth easing
      transitionProgressRef.current = Math.min(1, transitionProgressRef.current + 1 / (TRANSFORM_DURATION_MS / (1000 / 60)));
    } else if (stage === 'noise' || stage === 'fading') {
      transitionProgressRef.current = 1;
    }

    const progress = transitionProgressRef.current;

    if (progress < 1) {
      const matrixAlpha = 1 - easedProgress(progress); // Smooth fade out
      ctx.globalAlpha = matrixAlpha;
      ctx.fillStyle = '#0f0';

      dropsRef.current.forEach((y, i) => {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * FONT_SIZE;
        
        // Add subtle vertical movement
        const offset = Math.sin(frameCount * 0.02 + i * 0.1) * 2;
        ctx.fillText(text, x, (y * FONT_SIZE) + offset);

        if (y * FONT_SIZE > ctx.canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }
        dropsRef.current[i]++;
      });
      ctx.globalAlpha = 1;
    }

    if (progress > 0) {
      const noiseAlpha = stage === 'fading' ? 
        Math.max(0, 1 - (frameCount % FADE_OUT_DURATION_MS) / FADE_OUT_DURATION_MS) : 
        easedProgress(progress);
      ctx.globalAlpha = noiseAlpha;

      if (noiseParticlesRef.current.length === 0) {
        for (let i = 0; i < NOISE_PARTICLE_COUNT; i++) {
          noiseParticlesRef.current.push({
            x: Math.random() * ctx.canvas.width,
            y: Math.random() * ctx.canvas.height,
            intensity: Math.random()
          });
        }
      }

      noiseParticlesRef.current.forEach(p => {
        p.x += (Math.random() - 0.5) * 0.8;
        p.y += (Math.random() - 0.5) * 0.8;
        if (p.x < 0 || p.x > ctx.canvas.width) p.x = Math.random() * ctx.canvas.width;
        if (p.y < 0 || p.y > ctx.canvas.height) p.y = Math.random() * ctx.canvas.height;

        const lightness = 40 + p.intensity * 50;
        const alpha = 0.1 + p.intensity * 0.7;
        ctx.fillStyle = `hsla(${noiseColor.split(',')[0]}, ${noiseColor.split(',')[1]}, ${lightness}%, ${alpha})`;
        
        // Larger particles with dynamic size
        const size = 1 + p.intensity * 2;
        ctx.fillRect(p.x, p.y, size, size);
      });

      ctx.globalAlpha = 1.0;
    }
  }, [stage, matrixChars, noiseColor]);

  // --- Animation Loop ---
  useEffect(() => {
    if (!showCanvas || stage === 'done') {
      cancelAnimationFrame(animationFrameRef.current!);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;
    const columns = Math.floor(canvas.width / FONT_SIZE);

    // Initialize drops only once or on resize
    if (dropsRef.current.length !== columns) {
       dropsRef.current = Array(columns).fill(1);
    }
     // Reset noise particles when transition starts or canvas shows
    if (stage === 'erupting' || stage === 'transforming' || (stage === 'noise' && noiseParticlesRef.current.length === 0)) {
         noiseParticlesRef.current = []; // Clear for re-initialization in draw loop if needed
    }

    const render = () => {
      frameCount++;
      draw(ctx, frameCount, columns);
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render(); // Start loop

    return () => {
      cancelAnimationFrame(animationFrameRef.current!); // Cleanup loop
    };
  }, [showCanvas, draw, stage]); // Re-run effect if canvas visibility or stage changes

  // --- Handle Resize ---
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Re-initialize drops based on new width
        const columns = Math.floor(window.innerWidth / FONT_SIZE);
        dropsRef.current = Array(columns).fill(1);
        noiseParticlesRef.current = []; // Force reinitialization of noise particles
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size setup

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Render ---
  if (stage === 'done') return null;

  return (
    <div className={`${styles.introContainer} ${!containerVisible ? styles.hidden : ''}`}>
      <div className={`${styles.terminal} ${!showTerminal ? styles.hidden : ''}`}>
        <span>{typedCommand}</span>
        {showCursor && <span className={styles.cursor}></span>}
      </div>
      <canvas ref={canvasRef} className={`${styles.matrixCanvas} ${showCanvas ? styles.visible : ''}`} />
    </div>
  );
};

// Easing function
function easedProgress(progress: number): number {
    return 1 - Math.cos((progress * Math.PI) / 2);
}

export default CinematicIntro;
