'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function BlockCountdown() {
  const [countdown, setCountdown] = useState(12);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setProgress(0);
          return 12;
        }
        return prev - 1;
      });
      
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return (12 - countdown) / 12 * 100;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  return (
    <div className="relative bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-200 overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-taiko-pink/5 via-transparent to-taiko-purple/5 animate-pulse"></div>
      
      {/* Floating particles */}
      <div className="absolute top-4 right-6 w-2 h-2 bg-taiko-pink/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-taiko-purple/30 rounded-full animate-bounce" style={{ animationDelay: '1.2s' }}></div>
      
      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Header with icon */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-taiko-pink to-taiko-purple rounded-full flex items-center justify-center taiko-hero-logo shadow-md">
            <img 
              src="/taiko-icon.webp" 
              alt="Taiko" 
              className="w-9 h-9 object-cover rounded-full"
            />
          </div>
          <div>
            <h3 className="text-gray-800 font-bold text-xl">Next Block</h3>
            <p className="text-gray-500 text-sm font-medium">Taiko Network</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mb-8">
          <div className="text-5xl font-extrabold text-gray-800 mb-2 taiko-countdown-number">
            {countdown}<span className="text-2xl text-gray-500 font-normal">s</span>
          </div>
          <p className="text-gray-500 text-base font-medium">until next block arrives</p>
        </div>

        {/* Innovative Progress Bar */}
        <div className="relative mb-6">
          {/* Track */}
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            {/* Progress fill with liquid effect */}
            <div 
              className="h-full bg-gradient-to-r from-taiko-pink via-pink-400 to-taiko-pink transition-all duration-1000 ease-out taiko-liquid-progress rounded-full relative"
              style={{ 
                width: `${progress}%`,
                boxShadow: 'inset 0 2px 4px rgba(232, 24, 153, 0.3)'
              }}
            >
              {/* Flowing shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent taiko-shine-flow rounded-full"></div>
            </div>
          </div>
          
          {/* Glowing progress indicator */}
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-taiko-pink rounded-full shadow-lg taiko-progress-glow flex items-center justify-center"
            style={{ left: `calc(${progress}% - 12px)` }}
          >
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Enhanced stats */}
        <div className="grid grid-cols-2 gap-6 text-center">
          <div className="bg-white/70 rounded-xl p-4 border border-gray-100">
            <div className="text-taiko-pink font-bold text-xl">~12s</div>
            <div className="text-gray-500 text-sm font-medium">Block Time</div>
          </div>
          <div className="bg-white/70 rounded-xl p-4 border border-gray-100">
            <div className="text-taiko-purple font-bold text-xl">{Math.floor(progress)}%</div>
            <div className="text-gray-500 text-sm font-medium">Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
}