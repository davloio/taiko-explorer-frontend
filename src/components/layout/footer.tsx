'use client';

import Link from 'next/link';
import { Github, Twitter, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 via-white to-gray-50 border-t border-gray-200">
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
                  src="/taiko-icon.webp" 
                  alt="Taiko Logo" 
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 leading-none">
                  Taiko Explorer
                </span>
                <span className="text-sm text-gray-500 font-medium">
                  Blockchain Explorer
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-8 max-w-md text-lg leading-relaxed">
              Explore the Taiko blockchain with our fast and user-friendly block explorer. 
              Built with the latest technologies to provide the best experience for developers and users.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://github.com/taikoxyz" 
                className="group p-3 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-taiko-pink hover:border-taiko-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              </Link>
              <Link 
                href="https://twitter.com/taikoxyz" 
                className="group p-3 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-taiko-purple hover:border-taiko-purple/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              </Link>
              <Link 
                href="https://discord.com/invite/taikoxyz" 
                className="group p-3 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-yellow-500 hover:border-yellow-500/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 relative">
              Explorer
              <div className="absolute bottom-0 left-0 w-8 h-1 bg-taiko-gradient rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="group flex items-center text-gray-600 hover:text-taiko-pink transition-all duration-200 font-medium">
                  <div className="w-2 h-2 bg-taiko-pink rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blocks" className="group flex items-center text-gray-600 hover:text-taiko-pink transition-all duration-200 font-medium">
                  <div className="w-2 h-2 bg-taiko-pink rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  Blocks
                </Link>
              </li>
              <li>
                <Link href="/transactions" className="group flex items-center text-gray-600 hover:text-taiko-pink transition-all duration-200 font-medium">
                  <div className="w-2 h-2 bg-taiko-pink rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  Transactions
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 relative">
              Resources
              <div className="absolute bottom-0 left-0 w-8 h-1 bg-taiko-gradient rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="https://docs.taiko.xyz" 
                  className="group flex items-center text-gray-600 hover:text-taiko-purple transition-all duration-200 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-2 h-2 bg-taiko-purple rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  Documentation
                </Link>
              </li>
              <li>
                <Link 
                  href="https://bridge.taiko.xyz" 
                  className="group flex items-center text-gray-600 hover:text-taiko-purple transition-all duration-200 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-2 h-2 bg-taiko-purple rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  Bridge
                </Link>
              </li>
              <li>
                <Link 
                  href="https://taiko.xyz" 
                  className="group flex items-center text-gray-600 hover:text-taiko-purple transition-all duration-200 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-2 h-2 bg-taiko-purple rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  Official Site
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm font-medium">
              © 2025 Taiko Explorer. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Made with</span>
              <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse"></div>
              <span className="text-gray-600">by</span>
              <Link 
                href="https://github.com/Davloio" 
                className="group relative px-3 py-1 bg-gradient-to-r from-taiko-pink to-taiko-purple text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="relative z-10">Davloio</span>
                <div className="absolute inset-0 bg-gradient-to-r from-taiko-purple to-taiko-pink rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}