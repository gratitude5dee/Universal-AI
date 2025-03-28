
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './CinematicIntro.module.css';

interface CinematicIntroProps {
  onComplete?: () => void; // Optional callback when animation finishes
  commandText?: string;
  matrixChars?: string;
  noiseColor?: string; // Base HSL color for noise (e.g., '270, 90%, 60%')
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onComplete,
  commandText = 'pip install $5dee',
  matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ',
  noiseColor = '270, 90%, 60%', // Purple/Violet base HSL
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

  // --- Animation Configuration ---
  const TYPING_SPEED_MS = 80;
  const MATRIX_ERUPTION_DURATION_MS = 2500;
  const TRANSFORM_DURATION_MS = 1500;
  const NOISE_DURATION_MS = 3000;
  const FADE_OUT_DURATION_MS = 1000;
  const FONT_SIZE = 16;
  const NOISE_PARTICLE_COUNT = 5000; // Adjust for performance/density

  // --- Stage Transition Logic ---
  useEffect(() => {
    clearTimeout(stageTimeoutRef.current); // Clear previous timeouts

    if (stage === 'typing') {
      let i = 0;
      const targetCommand = '$ ' + commandText;
      const intervalId = setInterval(() => {
        setTypedCommand((prev) => prev + targetCommand[i + 2]); // +2 to skip '$ '
        i++;
        if (i + 2 >= targetCommand.length) {
          clearInterval(intervalId);
          setShowCursor(false);
          stageTimeoutRef.current = setTimeout(() => setStage('erupting'), 500); // Pause before eruption
        }
      }, TYPING_SPEED_MS);
      return () => clearInterval(intervalId);

    } else if (stage === 'erupting') {
      setShowTerminal(false); // Fade out terminal
      setShowCanvas(true);    // Fade in canvas
      transitionProgressRef.current = 0; // Ensure we start with matrix
      stageTimeoutRef.current = setTimeout(() => setStage('transforming'), MATRIX_ERUPTION_DURATION_MS);

    } else if (stage === 'transforming') {
       stageTimeoutRef.current = setTimeout(() => setStage('noise'), TRANSFORM_DURATION_MS);

    } else if (stage === 'noise') {
      stageTimeoutRef.current = setTimeout(() => setStage('fading'), NOISE_DURATION_MS);

    } else if (stage === 'fading') {
       setContainerVisible(false); // Start fading out the whole container via CSS
       stageTimeoutRef.current = setTimeout(() => {
            setStage('done');
            if (onComplete) onComplete();
        }, FADE_OUT_DURATION_MS + 100); // Wait for CSS fade + buffer
    }

    return () => clearTimeout(stageTimeoutRef.current); // Cleanup timeout on unmount/stage change
  }, [stage, commandText, onComplete]);

  // --- Canvas Drawing Logic ---
  const draw = useCallback((ctx: CanvasRenderingContext2D, frameCount: number, columns: number) => {
    // --- Shared Drawing Setup ---
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'; // Slightly transparent black for fading trails/background
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = `${FONT_SIZE}px monospace`;

    // --- Calculate Transition Progress ---
    if (stage === 'transforming') {
      transitionProgressRef.current = Math.min(1, transitionProgressRef.current + 1 / (TRANSFORM_DURATION_MS / (1000 / 60))); // Approx frames
    } else if (stage === 'noise' || stage === 'fading') {
        transitionProgressRef.current = 1;
    }

    const progress = transitionProgressRef.current; // 0 = matrix, 1 = noise

    // --- Draw Matrix (if progress < 1) ---
    if (progress < 1) {
        const matrixAlpha = 1 - progress; // Fade out matrix
        ctx.globalAlpha = matrixAlpha;

        // Matrix Green Color (can transition this color too if desired)
        ctx.fillStyle = '#0f0'; // Green Matrix text

        dropsRef.current.forEach((y, i) => {
            const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            const x = i * FONT_SIZE;
            ctx.fillText(text, x, y * FONT_SIZE);

            // Randomly reset drop or move down
            if (y * FONT_SIZE > ctx.canvas.height && Math.random() > 0.975) {
                dropsRef.current[i] = 0;
            }
            dropsRef.current[i]++;
        });
        ctx.globalAlpha = 1; // Reset global alpha
    }

    // --- Draw Noise (if progress > 0) ---
    if (progress > 0) {
        const noiseAlpha = stage === 'fading' ? Math.max(0, 1 - (1 - (stageTimeoutRef.current ? 1 : 0))) : progress; // Crude fade during 'fading' stage, better handled by container fade
        ctx.globalAlpha = noiseAlpha;

        if (noiseParticlesRef.current.length === 0) {
            // Initialize noise particles only once when needed
            for (let i = 0; i < NOISE_PARTICLE_COUNT; i++) {
                noiseParticlesRef.current.push({
                    x: Math.random() * ctx.canvas.width,
                    y: Math.random() * ctx.canvas.height,
                    intensity: Math.random() // 0 to 1
                });
            }
        }

        // Update and draw noise particles
        noiseParticlesRef.current.forEach(p => {
            // Simple movement (optional, makes it less static)
            p.x += (Math.random() - 0.5) * 0.5;
            p.y += (Math.random() - 0.5) * 0.5;
            if (p.x < 0 || p.x > ctx.canvas.width) p.x = Math.random() * ctx.canvas.width; // Wrap around
            if (p.y < 0 || p.y > ctx.canvas.height) p.y = Math.random() * ctx.canvas.height; // Wrap around

            const lightness = 40 + p.intensity * 50; // Vary lightness based on intensity (40% to 90%)
            const alpha = 0.1 + p.intensity * 0.6;   // Vary alpha based on intensity (more intense = brighter/more opaque)
            ctx.fillStyle = `hsla(${noiseColor.split(',')[0]}, ${noiseColor.split(',')[1]}, ${lightness}%, ${alpha})`; // Use HSL for easy lightness/color control

            // Draw particle (small rectangle)
             ctx.fillRect(p.x, p.y, 1, 1); // Draw 1x1 pixel particles
        });

        ctx.globalAlpha = 1.0; // Reset global alpha
    }
  }, [stage, matrixChars, noiseColor]); // Dependencies for the drawing function

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
  if (stage === 'done') return null; // Don't render anything once done

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

export default CinematicIntro;
