
import React from "react";
import CloudShader from "./shaders/CloudShader";

const Ambient = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Use the CloudShader as the background across the entire app */}
      <CloudShader />
      
      {/* Subtle noise overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03] z-[-5]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
      }} />
    </div>
  );
};

export default Ambient;
