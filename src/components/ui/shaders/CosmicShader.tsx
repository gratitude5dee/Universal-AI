
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

  // Fragment shader source with simplified cosmic effect that works reliably
  const fragmentShaderSource = `
    precision highp float;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 p = 2.0 * uv - 1.0;
      p.x *= u_resolution.x / u_resolution.y;
      
      float time = u_time * 0.1;
      
      vec4 finalColor = vec4(0.0, 0.0, 0.1, 1.0);
      
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
          
          vec3 color = hsv2rgb(vec3(
            mod(index + time * 0.05, 1.0),
            0.8,
            brightness * depth
          ));
          
          finalColor.rgb += color * (1.0 - depth) * 0.3;
        }
      }
      
      // Add some background gradient
      vec3 bgColor = mix(
        vec3(0.0, 0.0, 0.1),
        vec3(0.0, 0.0, 0.2),
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
