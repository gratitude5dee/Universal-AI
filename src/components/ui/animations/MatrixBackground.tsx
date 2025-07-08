import React, { useRef, useEffect } from 'react';

interface MatrixBackgroundProps {
  // Props can be added here if needed in the future, e.g., character set, colors
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Set canvas dimensions to fill the window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const numbers = '0123456789';
    const characters = katakana + numbers;
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);

    // Initialize drops (y-position for each column)
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1 + Math.random() * canvas.height; // Start at random y positions
    }

    const draw = () => {
      // Semi-transparent black background to create fading effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0f0'; // Green color for characters
      // Glow effect (subtle, can be enhanced)
      ctx.shadowColor = '#00FF41'; // Brighter green glow
      ctx.shadowBlur = 10;

      ctx.font = `${fontSize}px monospace`; // Monospaced font

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // Send drop back to top randomly after it crosses the screen
        // or with a random chance to create more dynamic effect
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Increment y coordinate
        drops[i]++;

        // Randomly make some characters brighter (simulating leading char)
        // This is a simplified approach. A more complex one would track individual chars in a stream.
        if (Math.random() > 0.95) {
            ctx.fillStyle = '#9f9'; // Lighter green
            ctx.shadowColor = '#9f9';
            ctx.shadowBlur = 15;
            ctx.fillText(text, x, y); // Redraw brighter char
            ctx.fillStyle = '#0f0'; // Reset to default green
            ctx.shadowColor = '#00FF41';
            ctx.shadowBlur = 10;
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      // Clear canvas on unmount
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1, // Ensure it's behind other content
        display: 'block', // Remove extra space below canvas
      }}
    />
  );
};

export default MatrixBackground;
