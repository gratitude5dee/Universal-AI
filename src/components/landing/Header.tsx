import React from 'react';
import { FiMenu } from 'react-icons/fi';
const Header = () => {
  return <header className="fixed top-5 left-1/2 transform -translate-x-1/2 w-[95%] max-w-[1400px] z-[1000]">
      <nav className="flex justify-between items-center px-6 py-3 rounded-full" style={{
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(var(--glass-blur))',
      WebkitBackdropFilter: 'blur(var(--glass-blur))',
      border: '1px solid var(--glass-border)'
    }}>
        <a href="/" className="flex items-center">
          <span className="text-white text-2xl font-bold">UniversalAI</span>
        </a>
        <div className="flex items-center gap-6">
          <button className="bg-none border-none text-white/70 cursor-pointer hidden md:block">
            <FiMenu size={24} />
          </button>
          <a href="/landing-preview" className="bg-white text-black font-semibold px-5 py-2.5 rounded-full text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg" style={{
          boxShadow: '0 0 20px rgba(240, 240, 245, 0.2)'
        }}>
            Enter App
          </a>
        </div>
      </nav>
    </header>;
};
export default Header;