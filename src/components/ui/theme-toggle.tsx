'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Palette, PaletteIcon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`relative w-10 h-10 rounded-lg transition-colors duration-200 border ${
        theme === 'pink'
          ? 'hover:bg-white/10 focus:bg-white/10 border-white/30 hover:border-white/50'
          : 'hover:bg-gray-100 focus:bg-gray-100 border-gray-300 hover:border-gray-400'
      }`}
      title={`Switch to ${theme === 'pink' ? 'white' : 'pink'} mode`}
    >
      <div className="relative">
        {theme === 'pink' ? (
          <div className="flex items-center justify-center w-5 h-5">
            <div className="w-4 h-4 bg-white rounded-full border border-white/30 shadow-sm"></div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-5 h-5">
            <div className="w-4 h-4 bg-[#C2185B] rounded-full border border-gray-300 shadow-sm"></div>
          </div>
        )}
      </div>
    </Button>
  );
}