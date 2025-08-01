import React from 'react';

interface PhoneMockupProps {
  screenContentSrc: string;
  alt: string;
  className?: string;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ screenContentSrc, alt, className = '' }) => {
  return (
    <div className={`relative w-full max-w-sm mx-auto ${className}`}>
      {/* Phone Frame */}
      <div className="relative">
        {/* Outer frame with rounded corners */}
        <div className="relative bg-gray-800 rounded-[3rem] p-2 shadow-2xl">
          {/* Inner frame */}
          <div className="bg-black rounded-[2.5rem] p-1">
            {/* Screen area */}
            <div className="relative bg-black rounded-[2.2rem] overflow-hidden aspect-[9/19.5]">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
              
              {/* Screen content */}
              <img 
                src={screenContentSrc} 
                alt={alt} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Side buttons */}
        <div className="absolute -left-1 top-20 w-1 h-8 bg-gray-700 rounded-r"></div>
        <div className="absolute -left-1 top-32 w-1 h-12 bg-gray-700 rounded-r"></div>
        <div className="absolute -left-1 top-48 w-1 h-12 bg-gray-700 rounded-r"></div>
        <div className="absolute -right-1 top-36 w-1 h-16 bg-gray-700 rounded-l"></div>
      </div>
    </div>
  );
};

export default PhoneMockup;