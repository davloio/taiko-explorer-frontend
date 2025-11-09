'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from '@/contexts/ThemeContext';
import { Search, Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blocks', href: '/blocks' },
    { name: 'Transactions', href: '/transactions' },
    { name: 'Addresses', href: '/addresses' },
  ];

  return (
    <header className={`border-b sticky top-0 z-50 shadow-sm backdrop-blur ${
      theme === 'pink' 
        ? 'border-white/30 bg-[#C2185B] supports-[backdrop-filter]:bg-[#C2185B]/90' 
        : 'border-gray-200 bg-white supports-[backdrop-filter]:bg-white/90'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <a 
                href="https://taiko.xyz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative w-10 h-10 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-110 hover:shadow-xl overflow-hidden block"
              >
                <img 
                  src="/Taiko Labs Logo.jpeg" 
                  alt="Taiko Labs Logo" 
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
              </a>
              <Link href="/" className="flex flex-col group">
                <span className={`text-xl font-bold leading-none transition-colors duration-200 ${
                  theme === 'pink' 
                    ? 'text-white group-hover:text-white/80' 
                    : 'text-gray-900 group-hover:text-gray-700'
                }`}>
                  Taiko Explorer
                </span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 transition-all duration-300 font-semibold group rounded-lg ${
                  theme === 'pink'
                    ? 'text-white/90 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-white/10 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                <div className={`absolute bottom-0 left-1/2 w-0 h-0.5 group-hover:w-full group-hover:left-0 transition-all duration-300 ${
                  theme === 'pink' ? 'bg-white' : 'bg-gray-900'
                }`}></div>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 transition-colors duration-200 ${
                  theme === 'pink'
                    ? 'text-white/60 group-focus-within:text-white'
                    : 'text-gray-400 group-focus-within:text-gray-600'
                }`} />
              </div>
              <input
                type="text"
                placeholder="Search blocks, transactions, addresses..."
                className={`w-full pl-12 pr-6 py-3 border rounded-xl backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg ${
                  theme === 'pink'
                    ? 'border-white/30 bg-white/20 focus:bg-white/30 focus:ring-2 focus:ring-white/50 focus:border-white text-white placeholder-white/60'
                    : 'border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-taiko-pink focus:border-taiko-pink text-gray-900 placeholder-gray-500'
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
              />
            </div>
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`relative w-10 h-10 rounded-lg transition-colors duration-200 ${
                  theme === 'pink'
                    ? 'hover:bg-white/10 focus:bg-white/10 border border-white/30 hover:border-white/50'
                    : 'hover:bg-gray-100 focus:bg-gray-100 border border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="relative">
                  {isMenuOpen ? (
                    <X className={`h-5 w-5 transition-colors duration-200 ${
                      theme === 'pink' ? 'text-white hover:text-white/80' : 'text-gray-600 hover:text-gray-800'
                    }`} />
                  ) : (
                    <Menu className={`h-5 w-5 transition-colors duration-200 ${
                      theme === 'pink' ? 'text-white hover:text-white/80' : 'text-gray-600 hover:text-gray-800'
                    }`} />
                  )}
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-in slide-in-from-top-2 duration-300">
            <div className={`px-4 pt-4 pb-6 space-y-3 border-t backdrop-blur-sm ${
              theme === 'pink'
                ? 'border-white/30 bg-white/20'
                : 'border-gray-200 bg-gray-50'
            }`}>
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                    theme === 'pink'
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                </Link>
              ))}
              
              {/* Mobile Search */}
              <div className="px-2 pt-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className={`h-5 w-5 transition-colors duration-200 ${
                      theme === 'pink'
                        ? 'text-white/60 group-focus-within:text-white'
                        : 'text-gray-400 group-focus-within:text-gray-600'
                    }`} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search blocks, transactions..."
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl transition-all duration-300 ${
                      theme === 'pink'
                        ? 'border-white/30 bg-white/20 focus:bg-white/30 focus:ring-2 focus:ring-white/50 focus:border-white text-white placeholder-white/60'
                        : 'border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-taiko-pink focus:border-taiko-pink text-gray-900 placeholder-gray-500'
                    }`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                        setIsMenuOpen(false);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}