'use client';

import Link from 'next/link';
import { Github, Twitter, MessageCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer className={theme === 'pink' ? 'bg-[#C2185B] border-t border-white/20' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 border-t border-gray-200'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <a 
                href="https://taiko.xyz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative w-12 h-12 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden block"
              >
                <img 
                  src="/Taiko Labs Logo.jpeg" 
                  alt="Taiko Labs Logo" 
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <div className="flex flex-col">
                <span className={`text-2xl font-bold leading-none ${
                  theme === 'pink' ? 'text-white' : 'text-gray-900'
                }`}>
                  Taiko Explorer
                </span>
                <span className={`text-sm font-medium ${
                  theme === 'pink' ? 'text-white/80' : 'text-gray-500'
                }`}>
                  Blockchain Explorer
                </span>
              </div>
            </div>
            <p className={`mb-8 max-w-md text-lg leading-relaxed ${
              theme === 'pink' ? 'text-white/90' : 'text-gray-600'
            }`}>
              Explore the Taiko blockchain with our fast and user-friendly block explorer. 
              Built with the latest technologies to provide the best experience for developers and users.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://github.com/taikoxyz" 
                className={`group p-3 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  theme === 'pink' 
                    ? 'bg-white/20 border-white/30 text-white/80 hover:text-white hover:border-white/50' 
                    : 'bg-white border-gray-200 text-gray-500 hover:text-taiko-pink hover:border-taiko-pink/30'
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              </Link>
              <Link 
                href="https://twitter.com/taikoxyz" 
                className={`group p-3 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  theme === 'pink' 
                    ? 'bg-white/20 border-white/30 text-white/80 hover:text-white hover:border-white/50' 
                    : 'bg-white border-gray-200 text-gray-500 hover:text-taiko-purple hover:border-taiko-purple/30'
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              </Link>
              <Link 
                href="https://discord.com/invite/taikoxyz" 
                className={`group p-3 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  theme === 'pink' 
                    ? 'bg-white/20 border-white/30 text-white/80 hover:text-white hover:border-white/50' 
                    : 'bg-white border-gray-200 text-gray-500 hover:text-yellow-500 hover:border-yellow-500/30'
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className={`text-lg font-bold mb-6 ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              Explorer
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className={`group flex items-center transition-all duration-200 font-medium ${
                  theme === 'pink' ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-[#C2185B]'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    theme === 'pink' ? 'bg-white' : 'bg-[#C2185B]'
                  }`}></div>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blocks" className={`group flex items-center transition-all duration-200 font-medium ${
                  theme === 'pink' ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-[#C2185B]'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    theme === 'pink' ? 'bg-white' : 'bg-[#C2185B]'
                  }`}></div>
                  Blocks
                </Link>
              </li>
              <li>
                <Link href="/transactions" className={`group flex items-center transition-all duration-200 font-medium ${
                  theme === 'pink' ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-[#C2185B]'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    theme === 'pink' ? 'bg-white' : 'bg-[#C2185B]'
                  }`}></div>
                  Transactions
                </Link>
              </li>
              <li>
                <Link href="/addresses" className={`group flex items-center transition-all duration-200 font-medium ${
                  theme === 'pink' ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-[#C2185B]'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    theme === 'pink' ? 'bg-white' : 'bg-[#C2185B]'
                  }`}></div>
                  Addresses
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className={`text-lg font-bold mb-6 ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="https://docs.taiko.xyz" 
                  className={`group flex items-center transition-all duration-200 font-medium ${
                    theme === 'pink' ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-[#C2185B]'
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className={`w-2 h-2 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    theme === 'pink' ? 'bg-white' : 'bg-[#C2185B]'
                  }`}></div>
                  Documentation
                </Link>
              </li>
              <li>
                <Link 
                  href="https://bridge.taiko.xyz" 
                  className={`group flex items-center transition-all duration-200 font-medium ${
                    theme === 'pink' ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-[#C2185B]'
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className={`w-2 h-2 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    theme === 'pink' ? 'bg-white' : 'bg-[#C2185B]'
                  }`}></div>
                  Bridge
                </Link>
              </li>
              <li>
                <Link 
                  href="https://taiko.xyz" 
                  className={`group flex items-center transition-all duration-200 font-medium ${
                    theme === 'pink' ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-[#C2185B]'
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className={`w-2 h-2 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    theme === 'pink' ? 'bg-white' : 'bg-[#C2185B]'
                  }`}></div>
                  Official Site
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`mt-12 pt-8 ${
          theme === 'pink' ? 'border-t border-white/20' : 'border-t border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className={`text-sm font-medium ${
              theme === 'pink' ? 'text-white/80' : 'text-gray-600'
            }`}>
              © 2025 Taiko Explorer. All rights reserved.
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <span className={theme === 'pink' ? 'text-white/80' : 'text-gray-600'}>
                Made by
              </span>
              <Link 
                href="https://davlo.io/" 
                className="group relative flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* Davloio Logo */}
                <img 
                  src="/davloio.png" 
                  alt="Davloio Logo" 
                  className="w-6 h-6 rounded group-hover:scale-110 transition-transform duration-300"
                />
                <span className="relative z-10 text-white group-hover:text-gray-100 transition-colors duration-300">
                  davloio
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}