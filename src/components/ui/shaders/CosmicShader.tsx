
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

  // Fragment shader source with the provided shader code
  const fragmentShaderSource = `
    precision highp float;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    
    // HSV to RGB conversion
    vec3 hsv(float h, float s, float v) {
      vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
      return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
    }
    
    // 3D rotation matrix
    mat3 rotate3D(float angle, vec3 axis) {
      axis = normalize(axis);
      float s = sin(angle);
      float c = cos(angle);
      float oc = 1.0 - c;
      
      return mat3(
        oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,
        oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s,
        oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c
      );
    }
    
    void main() {
      vec2 r = u_resolution;
      vec2 FC = gl_FragCoord.xy;
      float t = u_time;
      
      vec4 o = vec4(0.0, 0.0, 0.0, 1.0); // Output color
      
      // Fixed GLSL for-loop initialization
      float i = 0.0;
      float g = 0.0;
      float e = 0.0;
      float s = 0.0;
      
      for(; ++i < 99.0; o.rgb += 0.01 - hsv(0.1, g * 0.013, s / 2e2)) {
        vec3 p = vec3((FC.xy - 0.5 * r) / r.y * 7.0 + vec2(-2.0, 8.0), g + 4.0) * 
                rotate3D(sin(t * 0.5) * 0.005 - 1.8, vec3(0.0, 9.0, -1.0));
        
        s = 1.8;
        
        for(int j = 0; j < 19; j++) {
          p = vec3(0.05, 4.0, -1.0) - abs(abs(p) * e - vec3(3.1, 4.0, 2.9));
          s *= e = 7.1 / dot(p, p * 0.5);
        }
        
        g += p.y / s;
        s = log(s) / exp(e);
      }
      
      gl_FragColor = o;
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
