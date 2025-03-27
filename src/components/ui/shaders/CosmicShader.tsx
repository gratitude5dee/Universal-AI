
import React, { useRef, useEffect } from 'react';
import { useWebGLSetup } from '@/hooks/useWebGLSetup';

const CosmicShader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Vertex shader source
  const vertexShaderSource = `
    attribute vec2 position;
    
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  // Fragment shader source with colors matching our new palette
  const fragmentShaderSource = `
    precision highp float;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    
    vec3 colorPalette(float t) {
      // Blend between deep base color, accent color, and highlight color
      vec3 baseDeep = vec3(0.039, 0.059, 0.153);      // #0A0F27
      vec3 accentColor = vec3(1.0, 0.42, 0.0);        // #FF6B00
      vec3 highlightColor = vec3(0.0, 0.941, 1.0);    // #00F0FF
      
      float t1 = fract(t + 0.0);
      float t2 = fract(t + 0.33);
      float t3 = fract(t + 0.66);
      
      // Sharper transitions
      t1 = smoothstep(0.0, 0.5, t1) - smoothstep(0.5, 1.0, t1);
      t2 = smoothstep(0.0, 0.5, t2) - smoothstep(0.5, 1.0, t2);
      t3 = smoothstep(0.0, 0.5, t3) - smoothstep(0.5, 1.0, t3);
      
      return baseDeep * t1 + accentColor * t2 + highlightColor * t3;
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 p = 2.0 * uv - 1.0;
      p.x *= u_resolution.x / u_resolution.y;
      
      float time = u_time * 0.1;
      
      vec4 finalColor = vec4(0.039, 0.059, 0.153, 1.0); // Base deep color #0A0F27
      
      for (int i = 0; i < 5; i++) {
        float depth = 1.0 - float(i) * 0.2;
        
        for (int j = 0; j < 20; j++) {
          float t = time * (1.0 - depth) * 3.0;
          float index = float(j) / 20.0;
          
          float angle = index * 6.28 + t;
          float radius = mix(0.2, 1.0, index) + sin(t * 0.5) * 0.1;
          vec2 center = vec2(
            cos(angle) * radius * depth,
            sin(angle) * radius * depth
          );
          
          float dist = length(p - center);
          float brightness = 0.01 / dist;
          
          // Use our color palette instead of HSV
          vec3 color = colorPalette(index + time * 0.05) * brightness * depth;
          
          finalColor.rgb += color * (1.0 - depth) * 0.3;
        }
      }
      
      // Add some background gradient matching our color palette
      vec3 bgColor = mix(
        vec3(0.039, 0.059, 0.153),  // #0A0F27 at bottom
        vec3(0.078, 0.109, 0.267),  // #141C44 at top
        uv.y
      );
      
      finalColor.rgb = mix(bgColor, finalColor.rgb, 1.0);
      
      gl_FragColor = finalColor;
    }
  `;

  // Use the custom hook for WebGL setup
  useWebGLSetup({
    canvasRef,
    vertexShaderSource,
    fragmentShaderSource,
    startTimeRef
  });

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: -10 }}
    />
  );
};

export default CosmicShader;
