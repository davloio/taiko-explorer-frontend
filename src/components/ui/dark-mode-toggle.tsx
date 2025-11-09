'use client';

import { useState, useEffect } from 'react';
import { Palette, Circle } from 'lucide-react';

export function DarkModeToggle() {
  const [isPinkMode, setIsPinkMode] = useState(false);

  useEffect(() => {
    // Check if user has a preference stored
    const stored = localStorage.getItem('taikoMode');
    const shouldBePink = stored === 'true';
    setIsPinkMode(shouldBePink);
    
    if (shouldBePink) {
      document.documentElement.classList.add('taiko-mode');
    }
  }, []);

  const toggle = () => {
    const newValue = !isPinkMode;
    setIsPinkMode(newValue);
    localStorage.setItem('taikoMode', newValue.toString());
    
    if (newValue) {
      document.documentElement.classList.add('taiko-mode');
    } else {
      document.documentElement.classList.remove('taiko-mode');
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={toggle}
        className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 taiko-mode:bg-white/30 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#D5775E] focus:ring-offset-2 focus:ring-offset-white taiko-mode:focus:ring-offset-pink-300"
        role="switch"
        aria-checked={isPinkMode}
      >
        <span className="sr-only">Toggle Taiko mode</span>
        
        {/* Toggle circle */}
        <span
          className={`${
            isPinkMode ? 'translate-x-7' : 'translate-x-1'
          } inline-block h-6 w-6 transform rounded-full bg-white taiko-mode:bg-white shadow-lg ring-0 transition-all duration-200 ease-in-out`}
        >
          {/* Icons inside the circle */}
          <span className="flex h-full w-full items-center justify-center">
            {isPinkMode ? (
              <Circle className="h-3 w-3 text-[#D5775E] fill-current" />
            ) : (
              <Circle className="h-3 w-3 text-gray-400" />
            )}
          </span>
        </span>
        
        {/* Background track with icons */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <Circle className="h-3 w-3 text-gray-400 taiko-mode:text-white/60" />
          <Palette className="h-3 w-3 text-gray-400 taiko-mode:text-white/60" />
        </div>
      </button>
    </div>
  );
}