
import React, { useRef, useEffect } from 'react';

interface EtherealCloudShaderProps {
  className?: string;
}

const EtherealCloudShader: React.FC<EtherealCloudShaderProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const mouseRef = useRef<{ x: number, y: number }>({ x: 0.5, y: 0.5 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Setup WebGL
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    
    // Create shader program
    const program = createShaderProgram(gl);
    if (!program) return;
    
    // Setup buffers and attributes
    const bufferInfo = setupBuffers(gl, program);
    
    // Load textures
    const noiseTexture = createNoiseTexture(gl, 256);
    const blueNoiseTexture = createBlueNoiseTexture(gl, 1024);
    
    // Setup viewport and bind textures
    gl.useProgram(program);
    setupViewport(canvas, gl);
    
    // Set uniforms
    const uniforms = getUniformLocations(gl, program);
    
    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      };
    };
    
    // Handle resize
    const handleResize = () => {
      setupViewport(canvas, gl);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const render = () => {
      if (!gl || !program || !uniforms) return;
      
      const time = (Date.now() - startTimeRef.current) / 1000;
      
      // Set uniforms
      gl.uniform1f(uniforms.iTime, time);
      gl.uniform2f(uniforms.iMouse, 
        mouseRef.current.x * canvas.width, 
        (1 - mouseRef.current.y) * canvas.height
      );
      gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
      
      // Bind textures
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, noiseTexture);
      gl.uniform1i(uniforms.iChannel0, 0);
      
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, blueNoiseTexture);
      gl.uniform1i(uniforms.iChannel1, 1);
      
      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      // Request next frame
      requestIdRef.current = requestAnimationFrame(render);
    };
    
    // Start animation
    render();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestIdRef.current);
      
      // Cleanup WebGL resources
      gl.deleteTexture(noiseTexture);
      gl.deleteTexture(blueNoiseTexture);
      gl.deleteBuffer(bufferInfo.vertexBuffer);
      gl.deleteProgram(program);
    };
  }, []);
  
  // Helper functions
  const createShaderProgram = (gl: WebGLRenderingContext) => {
    // Fragment shader source
    const fragmentShaderSource = `
      precision mediump float;
      
      // Uniforms
      uniform float iTime;
      uniform vec2 iMouse;
      uniform vec2 iResolution;
      uniform sampler2D iChannel0;
      uniform sampler2D iChannel1;
      
      // --- Constants for Tweaking ---
      
      // Raymarching
      const int   MAX_STEPS = 96;        // Max steps per ray (reduced for performance)
      const float MAX_DIST = 60.0;        // Max distance to march
      const float STEP_SIZE_BASE = 0.10;  // Base step size factor (increased for performance)
      const float STEP_SIZE_DIST_SCALE = 0.03; // How much step size increases with distance
      const float DENSITY_ABSORPTION = 6.0; // How much density contributes to opacity
      const float DITHER_STRENGTH = 0.1; // Strength of start distance dithering
      
      // Cloud Shape & Density
      const float CLOUD_SCALE = 0.35;      // Noise frequency scale (smaller = larger clouds)
      const float FBM_PERSISTENCE = 0.5;  // How much detail is preserved in higher octaves
      const float FBM_LACUNARITY = 2.1;   // How much frequency increases per octave
      const float DENSITY_THRESHOLD = 0.01; // Minimum density to be considered "inside" cloud
      const float DENSITY_MULTIPLIER = 1.8; // Overall density scaling
      const float HEIGHT_GRADIENT = 0.8;  // How much density decreases with height
      const float CLOUD_BASE_HEIGHT = -1.5; // Base altitude offset for density calculation
      const float SHAPE_SMOOTH_MIN = 0.2; // Lower edge for density smoothing
      const float SHAPE_SMOOTH_MAX = 0.7; // Upper edge for density smoothing
      
      // Cloud Boundaries
      const float CLOUD_LAYER_BOTTOM = -3.0;
      const float CLOUD_LAYER_TOP = 0.8;
      
      // Lighting & Color (Ethereal Palette)
      const vec3  SUN_DIRECTION = normalize(vec3(0.8, 0.2, -0.6)); // Sun direction
      const vec3  SUN_LIGHT_COLOR = vec3(1.0, 0.8, 0.7); // Warm sun color
      const vec3  AMBIENT_LIGHT_COLOR = vec3(0.3, 0.35, 0.5); // Cool ambient sky light
      const vec3  CLOUD_BASE_COLOR = vec3(0.8, 0.85, 1.0); // Base color (lit areas)
      const vec3  CLOUD_SHADOW_COLOR = vec3(0.4, 0.5, 0.7); // Color in shadow areas
      const float LIGHTING_SMOOTHNESS = 0.4; // Softness of the light gradient calculation
      const float AMBIENT_OCCLUSION_FACTOR = 0.7; // How much ambient light is reduced by density
      
      // Atmospheric Perspective / Fog
      const float FOG_DENSITY = 0.015;     // How quickly fog builds up with distance
      const float FOG_EXPONENT = 1.5;     // Controls fog curve
      
      // Sky Background
      const vec3  SKY_COLOR_ZENITH = vec3(0.3, 0.5, 0.8); // Sky color straight up
      const vec3  SKY_COLOR_HORIZON = vec3(0.7, 0.8, 0.9); // Sky color near horizon
      const vec3  SUN_GLARE_COLOR = vec3(1.0, 0.7, 0.3); // Color of the sun's glare
      const float SUN_GLARE_INTENSITY = 0.15;
      const float SUN_GLARE_POWER = 5.0;
      const float SKY_SUN_COLOR_BLEND = 0.3; // How much sun color influences sky near sun
      const float SKY_SUN_COLOR_POWER = 12.0;
      
      // Gamma Correction
      const float GAMMA = 2.2;
      
      // LOD Toggle (Level of Detail)
      #define USE_LOD 1
      
      // --- Noise Function ---
      float noise(in vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f*f*(3.0-2.0*f); // Smoothstep
      
        // Sample from noise texture
        vec2 uv = (p.xy + vec2(37.0, 239.0) * p.z) + f.xy;
        vec2 rg = texture2D(iChannel0, (uv + 0.5) / 256.0).yx;
      
        // Interpolate between the two noise values based on f.z
        return mix(rg.x, rg.y, f.z) * 2.0 - 1.0; // Remap to [-1,1]
      }
      
      // --- Fractional Brownian Motion (fBm) ---
      float fbm(in vec3 p, int maxOctaves) {
        float value = 0.0;
        float amplitude = 0.5;
        vec3 q = p;
      
        for (int i = 0; i < 8; ++i) {
          if (i >= maxOctaves) break;
          value += amplitude * noise(q);
          q *= FBM_LACUNARITY;
          amplitude *= FBM_PERSISTENCE;
        }
        return value;
      }
      
      // --- Cloud Density Function ---
      float cloudDensity(in vec3 p, int octaves) {
        vec3 q = p * CLOUD_SCALE;
        q.z -= iTime * 0.2; // Gentle movement
      
        // Base density from fBm noise
        float rawDensity = fbm(q, octaves);
      
        // Add height gradient and base offset
        float heightFactor = p.y * HEIGHT_GRADIENT + CLOUD_BASE_HEIGHT;
        rawDensity -= heightFactor;
      
        // Smoothstep for softer edges
        rawDensity = smoothstep(SHAPE_SMOOTH_MIN, SHAPE_SMOOTH_MAX, rawDensity);
      
        // Apply overall density multiplier
        rawDensity *= DENSITY_MULTIPLIER;
      
        return clamp(rawDensity, 0.0, 1.0);
      }
      
      // --- Camera Setup ---
      mat3 setCamera(in vec3 ro, in vec3 ta, float cr) {
        vec3 cw = normalize(ta-ro);
        vec3 cp = vec3(sin(cr), cos(cr), 0.0);
        vec3 cu = normalize(cross(cw,cp));
        vec3 cv = normalize(cross(cu,cw));
        return mat3(cu, cv, cw);
      }
      
      // --- Raymarcher ---
      vec4 raymarch(in vec3 rayOrigin, in vec3 rayDirection, in vec3 backgroundColor, in vec2 fragCoord) {
        vec4 accumulatedColor = vec4(0.0);
        float accumulatedTransmittance = 1.0;
      
        // Calculate ray intersection with cloud layer
        float tMin = 0.0;
        float tMax = MAX_DIST;
      
        // Intersect with bottom and top planes
        float tBottom = (CLOUD_LAYER_BOTTOM - rayOrigin.y) / rayDirection.y;
        float tTop = (CLOUD_LAYER_TOP - rayOrigin.y) / rayDirection.y;
      
        // Order intersections
        if (rayDirection.y > 0.0) {
          tMin = max(tMin, tBottom);
          tMax = min(tMax, tTop);
        } else if (rayDirection.y < 0.0) {
          tMin = max(tMin, tTop);
          tMax = min(tMax, tBottom);
        } else if (rayOrigin.y < CLOUD_LAYER_BOTTOM || rayOrigin.y > CLOUD_LAYER_TOP) {
          return vec4(0.0);
        }
        
        tMin = max(tMin, 0.0);
      
        if (tMin >= tMax) {
          return vec4(0.0);
        }
      
        // Dithered start distance
        float dither = texture2D(iChannel1, fragCoord / 1024.0).x;
        float t = tMin + DITHER_STRENGTH * dither;
      
        // Main raymarching loop
        for (int i = 0; i < MAX_STEPS; i++) {
          // Current position along the ray
          vec3 pos = rayOrigin + t * rayDirection;
      
          // Dynamic Level of Detail
          int octaves = 5;
          #if USE_LOD==1
            octaves = 5 - int(log2(1.0 + t * 0.3));
            octaves = max(octaves, 2);
          #endif
      
          // Sample cloud density
          float density = cloudDensity(pos, octaves);
      
          // Lighting and shading
          if (density > DENSITY_THRESHOLD) {
            // Light scattering approximation
            float densityTowardsSun = cloudDensity(pos + SUN_DIRECTION * LIGHTING_SMOOTHNESS, octaves);
            float directLight = clamp((density - densityTowardsSun) / LIGHTING_SMOOTHNESS, 0.0, 1.0);
            directLight = smoothstep(0.0, 1.0, directLight);
      
            // Combine direct and ambient light
            vec3 lightColor = AMBIENT_LIGHT_COLOR * (1.0 - density * AMBIENT_OCCLUSION_FACTOR) 
                            + SUN_LIGHT_COLOR * directLight;
      
            // Determine cloud color
            vec3 baseColor = mix(CLOUD_BASE_COLOR, CLOUD_SHADOW_COLOR, smoothstep(0.1, 0.9, density));
            vec3 scatteringColor = baseColor * lightColor;
      
            // Atmospheric perspective / fog
            float fogAmount = 1.0 - exp(-pow(t * FOG_DENSITY, FOG_EXPONENT));
            scatteringColor = mix(scatteringColor, backgroundColor, fogAmount);
      
            // Absorption and compositing
            float alpha = 1.0 - exp(-density * DENSITY_ABSORPTION * STEP_SIZE_BASE);
            alpha = clamp(alpha, 0.0, 1.0);
      
            // Add to accumulated color
            vec3 colorStep = scatteringColor * alpha * accumulatedTransmittance;
            accumulatedColor.rgb += colorStep;
            accumulatedTransmittance *= (1.0 - alpha);
            accumulatedColor.a += alpha * (1.0 - accumulatedColor.a);
      
            // Early exit conditions
            if (accumulatedTransmittance < 0.01 || accumulatedColor.a > 0.99) {
              accumulatedColor.a = min(accumulatedColor.a, 1.0);
              break;
            }
          }
      
          // Advance ray
          float dt = max(STEP_SIZE_BASE * 0.5, STEP_SIZE_BASE + STEP_SIZE_DIST_SCALE * t);
          t += dt;
      
          // Exit if ray goes beyond max distance
          if (t > tMax) break;
        }
      
        return clamp(accumulatedColor, 0.0, 1.0);
      }
      
      // --- Background Sky ---
      vec3 getBackgroundColor(vec3 rd) {
        float sunDot = clamp(dot(rd, SUN_DIRECTION), 0.0, 1.0);
      
        // Base sky gradient
        vec3 skyColor = mix(SKY_COLOR_HORIZON, SKY_COLOR_ZENITH, smoothstep(0.0, 0.4, rd.y));
      
        // Add sun color influence
        skyColor = mix(skyColor, SUN_LIGHT_COLOR, SKY_SUN_COLOR_BLEND * pow(sunDot, SKY_SUN_COLOR_POWER));
      
        return skyColor;
      }
      
      // --- Main Render Function ---
      vec4 render(in vec3 ro, in vec3 rd, in vec2 fragCoord) {
        // Calculate background sky color
        vec3 backgroundColor = getBackgroundColor(rd);
      
        // Perform raymarching
        vec4 cloudColor = raymarch(ro, rd, backgroundColor, fragCoord);
      
        // Composite clouds over background
        vec3 finalColor = cloudColor.rgb + backgroundColor * (1.0 - cloudColor.a);
      
        // Add Sun Glare
        float sunDot = clamp(dot(rd, SUN_DIRECTION), 0.0, 1.0);
        finalColor += SUN_GLARE_COLOR * SUN_GLARE_INTENSITY * pow(sunDot, SUN_GLARE_POWER);
      
        // Apply gamma correction
        finalColor = pow(finalColor, vec3(1.0 / GAMMA));
      
        return vec4(finalColor, 1.0);
      }
      
      // --- Main Function ---
      void main() {
        // Normalized pixel coordinates (from -1 to 1, aspect corrected)
        vec2 fragCoord = gl_FragCoord.xy;
        vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
      
        // Camera setup
        float cameraAngle = 3.0 * (iMouse.x / iResolution.x) * 3.14159;
        float cameraHeight = 1.5 + 1.5 * (iMouse.y / iResolution.y);
        vec3 rayOrigin = vec3(cos(cameraAngle) * 4.0, cameraHeight, sin(cameraAngle) * 4.0);
        vec3 target = vec3(0.0, -0.5, 0.0);
      
        // Add subtle camera roll animation
        float cameraRoll = 0.05 * cos(iTime * 0.2);
      
        // Create camera matrix
        mat3 cameraMatrix = setCamera(rayOrigin, target, cameraRoll);
      
        // Calculate ray direction
        vec3 rayDirection = cameraMatrix * normalize(vec3(p.xy, 1.5));
      
        // Render the scene
        gl_FragColor = render(rayOrigin, rayDirection, fragCoord);
      }
    `;

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 position;
      
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Compile shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) {
      console.error('Failed to create vertex shader');
      return null;
    }
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
      gl.deleteShader(vertexShader);
      return null;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) {
      console.error('Failed to create fragment shader');
      gl.deleteShader(vertexShader);
      return null;
    }
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return null;
    }

    // Link program
    const program = gl.createProgram();
    if (!program) {
      console.error('Failed to create shader program');
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader program linking error:', gl.getProgramInfoLog(program));
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
      return null;
    }

    // Cleanup shaders (they're now linked into the program)
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
  };

  const setupBuffers = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    // Create a full-screen quad (two triangles)
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0
    ]);

    // Create and bind vertex buffer
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Get attribute location and enable it
    const positionAttribute = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

    return { vertexBuffer };
  };

  const setupViewport = (canvas: HTMLCanvasElement, gl: WebGLRenderingContext) => {
    // Make canvas responsive
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * pixelRatio;
    canvas.height = canvas.clientHeight * pixelRatio;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  const getUniformLocations = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    return {
      iTime: gl.getUniformLocation(program, 'iTime'),
      iMouse: gl.getUniformLocation(program, 'iMouse'),
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      iChannel0: gl.getUniformLocation(program, 'iChannel0'),
      iChannel1: gl.getUniformLocation(program, 'iChannel1')
    };
  };

  // Create a noise texture for cloud generation
  const createNoiseTexture = (gl: WebGLRenderingContext, size: number) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // Generate noise data
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size * 4; i += 4) {
      data[i] = Math.floor(Math.random() * 256);     // R
      data[i + 1] = Math.floor(Math.random() * 256); // G
      data[i + 2] = Math.floor(Math.random() * 256); // B
      data[i + 3] = 255;                           // A
    }
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    
    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    return texture;
  };

  // Create a blue noise texture for dithering
  const createBlueNoiseTexture = (gl: WebGLRenderingContext, size: number) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // Generate simple noise data for dithering
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size * 4; i += 4) {
      // For true blue noise, you'd use a specific algorithm
      // This is just random noise for simplicity
      const value = Math.floor(Math.random() * 256);
      data[i] = value;     // R
      data[i + 1] = value; // G
      data[i + 2] = value; // B
      data[i + 3] = 255;   // A
    }
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    
    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    return texture;
  };

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ zIndex: -10 }}
    />
  );
};

export default EtherealCloudShader;
