import React from 'react';
import { FiMenu } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full p-6 z-[1000]">
      <nav className="px-[5%] flex justify-between items-center max-w-[1600px] mx-auto">
        <a href="/" className="flex items-center">
          <span className="text-white text-2xl font-bold">FYI</span>
        </a>
        <div className="flex items-center gap-6">
          <button className="bg-none border-none text-white cursor-pointer">
            <FiMenu size={28} />
          </button>
          <a 
            href="#" 
            className="bg-white text-black font-bold px-6 py-3 rounded-full text-sm transition-transform duration-200 hover:scale-105"
          >
            DOWNLOAD
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;