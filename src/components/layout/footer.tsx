'use client';

import Link from 'next/link';
import { Github, Twitter, MessageCircle, BookOpen, Code, Users, Zap, Globe } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={`relative overflow-hidden ${
      theme === 'pink'
        ? 'bg-gradient-to-b from-pink-500 to-[#C2185B]'
        : 'bg-gradient-to-b from-pink-100 to-white'
    }`}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
          theme === 'pink' ? 'bg-white/5' : 'bg-[#C2185B]/5'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
          theme === 'pink' ? 'bg-white/5' : 'bg-purple-500/5'
        }`}></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className={`border-b ${theme === 'pink' ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Brand Section */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <a
                    href="https://taiko.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-12 h-12 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden block group"
                  >
                    <img
                      src="/Taiko Labs Logo.jpeg"
                      alt="Taiko Labs Logo"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      theme === 'pink' ? 'bg-white/10' : 'bg-gradient-to-r from-[#C2185B]/20 to-transparent'
                    }`}></div>
                  </a>
                  <div className="flex flex-col">
                    <span className={`text-2xl font-bold leading-none ${
                      theme === 'pink' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Taiko Explorer
                    </span>
                    <span className={`text-sm font-medium mt-1 ${
                      theme === 'pink' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      Explore the Future
                    </span>
                  </div>
                </div>
                <p className={`mb-8 max-w-md text-base leading-relaxed ${
                  theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  The most advanced block explorer for Taiko. Fast, reliable, and built for developers and the community.
                </p>

                {/* Social Links */}
                <div className="flex space-x-3">
                  <Link
                    href="https://github.com/taikoxyz"
                    className={`group p-3 rounded-xl transition-all duration-300 hover:-translate-y-1 ${
                      theme === 'pink'
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 shadow-sm hover:shadow-md'
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="https://twitter.com/taikoxyz"
                    className={`group p-3 rounded-xl transition-all duration-300 hover:-translate-y-1 ${
                      theme === 'pink'
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 shadow-sm hover:shadow-md'
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="https://discord.com/invite/taikoxyz"
                    className={`group p-3 rounded-xl transition-all duration-300 hover:-translate-y-1 ${
                      theme === 'pink'
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 shadow-sm hover:shadow-md'
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

              {/* Explorer Section */}
              <div>
                <h3 className={`text-sm font-bold mb-5 uppercase tracking-wider ${
                  theme === 'pink' ? 'text-white/90' : 'text-gray-900'
                }`}>
                  Explorer
                </h3>
                <ul className="space-y-3">
                  {[
                    { href: '/', label: 'Home' },
                    { href: '/blocks', label: 'Blocks' },
                    { href: '/transactions', label: 'Transactions' },
                    { href: '/addresses', label: 'Addresses' },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`group inline-flex items-center text-sm transition-all duration-200 ${
                          theme === 'pink'
                            ? 'text-white/70 hover:text-white'
                            : 'text-gray-600 hover:text-[#C2185B]'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-2.5 transition-all duration-200 ${
                          theme === 'pink'
                            ? 'bg-white/40 group-hover:bg-white group-hover:w-2'
                            : 'bg-gray-400 group-hover:bg-[#C2185B] group-hover:w-2'
                        }`}></span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources Section */}
              <div>
                <h3 className={`text-sm font-bold mb-5 uppercase tracking-wider ${
                  theme === 'pink' ? 'text-white/90' : 'text-gray-900'
                }`}>
                  Resources
                </h3>
                <ul className="space-y-3">
                  {[
                    { href: 'https://docs.taiko.xyz', label: 'Documentation' },
                    { href: 'https://bridge.taiko.xyz', label: 'Bridge' },
                    { href: 'https://taiko.xyz', label: 'Official Site' },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`group inline-flex items-center text-sm transition-all duration-200 ${
                          theme === 'pink'
                            ? 'text-white/70 hover:text-white'
                            : 'text-gray-600 hover:text-[#C2185B]'
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-2.5 transition-all duration-200 ${
                          theme === 'pink'
                            ? 'bg-white/40 group-hover:bg-white group-hover:w-2'
                            : 'bg-gray-400 group-hover:bg-[#C2185B] group-hover:w-2'
                        }`}></span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className={`text-sm ${
              theme === 'pink' ? 'text-white/60' : 'text-gray-500'
            }`}>
              <span className="font-medium">© 2025 Taiko Explorer.</span> All rights reserved.
            </div>

            <Link
              href="https://davlo.io/"
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 ${
                theme === 'pink'
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl'
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/davloio.png"
                alt="Davloio"
                className="w-5 h-5 rounded group-hover:scale-110 transition-transform duration-300"
              />
              <span>Built by davloio</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}