'use client';

import { useState, useEffect } from 'react';
import { Activity, Zap, Layers, Timer } from 'lucide-react';

export function BlockCountdown() {
  const [countdown, setCountdown] = useState(12);
  const [progress, setProgress] = useState(0);
  const [currentBlock, setCurrentBlock] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCurrentBlock(b => b + 1);
          return 12;
        }
        return prev - 1;
      });
      
      setProgress((12 - countdown) / 12 * 100);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  return (
    <div className="relative bg-gradient-to-br from-white via-pink-50/30 to-white taiko-mode:from-white/20 taiko-mode:via-white/10 taiko-mode:to-white/20 taiko-mode:backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-100/50 taiko-mode:border-white/30 overflow-hidden">
      {/* Animated background with moving shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-4 right-8 w-20 h-20 bg-gradient-to-br from-[#D5775E]/10 to-[#E8469B]/10 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-6 left-4 w-16 h-16 bg-gradient-to-br from-[#E8469B]/10 to-[#D5775E]/10 rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-[#D5775E]/5 to-[#E8469B]/5 rounded-full animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D5775E] to-[#E8469B] rounded-2xl flex items-center justify-center shadow-lg taiko-block-icon">
              <img 
                src="/taiko-icon.webp" 
                alt="Taiko" 
                className="w-7 h-7 object-cover rounded-xl"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 taiko-mode:text-white">Next Block</h3>
          </div>
          <p className="text-gray-600 taiko-mode:text-white/90 font-medium">Taiko Layer 2 Network</p>
        </div>

        {/* Countdown Display */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {/* Countdown number with morphing background */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D5775E]/20 to-[#E8469B]/20 rounded-3xl taiko-morph-bg"></div>
              <div className="relative px-8 py-4">
                <span className="text-7xl font-black text-[#C2185B] taiko-mode:text-white taiko-countdown-bounce">
                  {countdown}
                </span>
                <div className="text-lg text-gray-600 taiko-mode:text-white/90 font-semibold mt-1">seconds</div>
              </div>
            </div>
          </div>
        </div>


        {/* Block Visualization */}
        <div className="grid grid-cols-12 gap-1 mb-8">
          {[...Array(12)].map((_, i) => {
            const isPast = i < (12 - countdown);
            const isCurrent = i === (12 - countdown);
            
            return (
              <div
                key={i}
                className={`h-4 rounded-lg transition-all duration-500 ${
                  isPast 
                    ? 'bg-gradient-to-r from-[#D5775E] to-[#E8469B] shadow-sm taiko-block-complete' 
                    : isCurrent
                    ? 'bg-gradient-to-r from-[#E8469B] to-[#D5775E] taiko-block-current shadow-md'
                    : 'bg-gray-200'
                }`}
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  transform: isCurrent ? 'scaleY(1.5)' : 'scaleY(1)'
                }}
              />
            );
          })}
        </div>


      </div>
    </div>
  );
}