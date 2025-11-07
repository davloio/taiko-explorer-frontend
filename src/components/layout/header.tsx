'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blocks', href: '/blocks' },
    { name: 'Transactions', href: '/transactions' },
  ];

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 sticky top-0 z-50 shadow-sm">
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
                  src="/taiko-icon.webp" 
                  alt="Taiko Logo" 
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
              </a>
              <Link href="/" className="flex flex-col group">
                <span className="text-xl font-bold text-gray-900 leading-none group-hover:text-taiko-pink transition-colors duration-200">
                  Taiko Explorer
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Block Explorer
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
                className="relative px-4 py-2 text-gray-700 hover:text-taiko-pink transition-all duration-300 font-semibold group rounded-lg"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-taiko-pink/10 to-taiko-purple/10 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-taiko-gradient group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-taiko-pink transition-colors duration-200" />
              </div>
              <input
                type="text"
                placeholder="Search blocks, transactions, addresses..."
                className="w-full pl-12 pr-6 py-3 border border-gray-200 rounded-xl bg-gray-50/50 backdrop-blur-sm 
                         focus:bg-white focus:ring-2 focus:ring-taiko-pink/20 focus:border-taiko-pink 
                         transition-all duration-300 text-gray-700 placeholder-gray-500
                         shadow-sm hover:shadow-md focus:shadow-lg taiko-focus"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
              />
              <div className="absolute inset-0 rounded-xl bg-taiko-gradient opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-10 h-10 rounded-lg hover:bg-taiko-pink/10 focus:bg-taiko-pink/10 
                       transition-colors duration-200 border border-gray-200 hover:border-taiko-pink/30"
            >
              <div className="relative">
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-gray-700 hover:text-taiko-pink transition-colors duration-200" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-700 hover:text-taiko-pink transition-colors duration-200" />
                )}
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-in slide-in-from-top-2 duration-300">
            <div className="px-4 pt-4 pb-6 space-y-3 border-t border-gray-100 bg-white/95 backdrop-blur-sm">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-taiko-pink 
                           hover:bg-taiko-gradient-subtle rounded-xl transition-all duration-200 
                           transform hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <div className="w-2 h-2 bg-taiko-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                </Link>
              ))}
              
              {/* Mobile Search */}
              <div className="px-2 pt-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-taiko-pink transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search blocks, transactions..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 
                             focus:bg-white focus:ring-2 focus:ring-taiko-pink/20 focus:border-taiko-pink 
                             transition-all duration-300 text-gray-700 placeholder-gray-500 taiko-focus"
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