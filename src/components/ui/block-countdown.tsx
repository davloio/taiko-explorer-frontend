'use client';

import { useState, useEffect } from 'react';
import { Activity, Zap } from 'lucide-react';

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

  // Calculate circle progress
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D5775E]/5 via-[#E8469B]/5 to-[#D5775E]/5"></div>
      
      {/* Floating particles */}
      <div className="absolute top-6 right-8 w-2 h-2 bg-[#D5775E]/40 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-12 left-6 w-1.5 h-1.5 bg-[#E8469B]/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-8 right-12 w-1 h-1 bg-[#D5775E]/30 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-16 left-16 w-2 h-2 bg-[#E8469B]/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Title */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Next Block Production</h3>
          <p className="text-gray-600 font-medium">Taiko Layer 2 Network</p>
        </div>

        {/* Circular Progress */}
        <div className="relative mb-8 flex justify-center">
          <div className="relative w-64 h-64">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
              <circle
                cx="128"
                cy="128"
                r={radius}
                stroke="rgba(229, 231, 235, 0.3)"
                strokeWidth="8"
                fill="transparent"
              />
              
              {/* Progress Circle */}
              <circle
                cx="128"
                cy="128"
                r={radius}
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(213, 119, 94, 0.4))'
                }}
              />
              
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D5775E" />
                  <stop offset="50%" stopColor="#E8469B" />
                  <stop offset="100%" stopColor="#D5775E" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-[#D5775E] to-[#E8469B] rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-pulse">
                <img 
                  src="/taiko-icon.webp" 
                  alt="Taiko" 
                  className="w-10 h-10 object-cover rounded-xl"
                />
              </div>
              
              {/* Countdown */}
              <div className="text-6xl font-bold text-gray-800 mb-2" style={{ animation: 'countdownGlowPink 3s ease-in-out infinite' }}>
                {countdown}
              </div>
              
              {/* Seconds label */}
              <div className="text-lg text-gray-600 font-medium">seconds</div>
            </div>

            {/* Animated dots around circle */}
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30) - 90; // Start from top
                const x = 128 + (radius + 20) * Math.cos(angle * Math.PI / 180);
                const y = 128 + (radius + 20) * Math.sin(angle * Math.PI / 180);
                const isActive = i < (12 - countdown);
                
                return (
                  <div
                    key={i}
                    className={`absolute w-3 h-3 rounded-full transition-all duration-500 ${
                      isActive 
                        ? 'bg-[#D5775E] shadow-lg animate-pulse' 
                        : 'bg-gray-200'
                    }`}
                    style={{
                      left: `${x - 6}px`,
                      top: `${y - 6}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="bg-white/60 rounded-2xl p-4 border border-white/30 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-5 w-5 text-[#D5775E] mr-2" />
              <span className="text-lg font-bold" style={{ color: '#D5775E' }}>~12s</span>
            </div>
            <div className="text-sm text-gray-600 font-medium">Block Time</div>
          </div>
          
          <div className="bg-white/60 rounded-2xl p-4 border border-white/30 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-5 w-5 text-[#E8469B] mr-2" />
              <span className="text-lg font-bold" style={{ color: '#E8469B' }}>{Math.floor(progress)}%</span>
            </div>
            <div className="text-sm text-gray-600 font-medium">Progress</div>
          </div>
          
          <div className="bg-white/60 rounded-2xl p-4 border border-white/30 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-2">
              <div className="w-5 h-5 bg-gradient-to-r from-[#D5775E] to-[#E8469B] rounded-md mr-2"></div>
              <span className="text-lg font-bold text-gray-800">#{currentBlock}</span>
            </div>
            <div className="text-sm text-gray-600 font-medium">Next Block</div>
          </div>
        </div>

        {/* Pulse animation for "mining" */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-[#D5775E] rounded-full animate-pulse"></div>
          <span>Mining next block...</span>
        </div>
      </div>
    </div>
  );
}