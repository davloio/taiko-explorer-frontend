'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from '@/contexts/ThemeContext';
import { isValidAddress, isValidTxHash } from '@/lib/utils';
import { Search, Menu, X, Activity, Hash, Users } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{type: string, label: string, icon: any}>>([]);
  const { theme } = useTheme();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blocks', href: '/blocks' },
    { name: 'Transactions', href: '/transactions' },
    { name: 'Addresses', href: '/addresses' },
  ];

  const updateSuggestions = (value: string) => {
    const trimmed = value.trim();
    const newSuggestions = [];
    
    if (!trimmed) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (/^\d+$/.test(trimmed)) {
      newSuggestions.push({
        type: 'block',
        label: `Block #${trimmed}`,
        icon: Activity
      });
    }

    if (/^0x[a-f0-9]+$/i.test(trimmed) && isValidTxHash(trimmed)) {
      newSuggestions.push({
        type: 'transaction',
        label: `Transaction ${trimmed.slice(0, 10)}...`,
        icon: Hash
      });
    }
      
    if (/^0x[a-f0-9]+$/i.test(trimmed) && isValidAddress(trimmed)) {
      newSuggestions.push({
        type: 'address',
        label: `Address ${trimmed.slice(0, 10)}...`,
        icon: Users
      });
    }

    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
  };

  const handleSuggestionClick = (suggestion: any) => {
    const trimmed = searchQuery.trim();
    setShowSuggestions(false);
    setSearchQuery('');
    setIsSearchOpen(false);

    if (suggestion.type === 'block') {
      router.push(`/blocks/${trimmed}`);
    } else if (suggestion.type === 'transaction') {
      router.push(`/transactions/${trimmed}`);
    } else if (suggestion.type === 'address') {
      router.push(`/addresses/${trimmed}`);
    }
  };

  const handleDirectSearch = (query: string) => {
    const trimmed = query.trim();
    setSearchQuery('');
    setShowSuggestions(false);
    
    if (/^\d+$/.test(trimmed)) {
      router.push(`/blocks/${trimmed}`);
      return;
    }

    if (isValidTxHash(trimmed)) {
      router.push(`/transactions/${trimmed}`);
      return;
    }

    if (isValidAddress(trimmed)) {
      router.push(`/addresses/${trimmed}`);
      return;
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateSuggestions(value);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleDirectSearch(searchQuery);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 pt-4 px-4">
      <div className={`max-w-6xl mx-auto border rounded-full backdrop-blur-2xl shadow-xl ${theme === 'pink' ? 'border-white/40 bg-gradient-to-r from-purple-500/40 to-pink-500/40' : 'border-gray-200 bg-white/90'}`}>
        <div className="flex justify-between items-center h-16 px-8">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-3 group"
            >
              <div className="relative w-10 h-10 rounded-full shadow-md transform transition-all duration-200 group-hover:scale-110 overflow-hidden">
                <img
                  src="/Taiko Labs Logo.jpeg"
                  alt="Taiko Labs Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className={`text-xl font-bold tracking-tight ${theme === 'pink' ? 'text-white' : 'text-gray-900'}`}>
                Taiko Explorer
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-5 py-2.5 text-base font-medium rounded-full transition-all duration-200 ${theme === 'pink' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-[#F9F9F9] text-[#0B101B] hover:bg-gray-200'}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className={`w-10 h-10 rounded-full transition-colors duration-200 ${theme === 'pink' ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
            <ThemeToggle />
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`w-10 h-10 rounded-full transition-colors duration-200 ${theme === 'pink' ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>


        {isMenuOpen && (
          <div className={`md:hidden px-6 pt-4 pb-6 space-y-3 border-t ${theme === 'pink' ? 'border-white/30' : 'border-gray-200'}`}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-5 py-3 text-base font-medium rounded-full transition-all duration-200 ${theme === 'pink' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-[#F9F9F9] text-gray-900 hover:bg-gray-200'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              theme === 'pink' ? 'bg-[#C2185B]/60' : 'bg-black/20'
            } backdrop-blur-sm`}
            onClick={toggleSearch}
          />

          {/* Search Container */}
          <div className="relative w-full max-w-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className={`relative rounded-3xl shadow-2xl overflow-hidden ${
                theme === 'pink'
                  ? 'bg-white/95 backdrop-blur-md'
                  : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center px-6 py-5">
                  <Search className={`h-6 w-6 mr-4 ${theme === 'pink' ? 'text-[#C2185B]' : 'text-gray-400'}`} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Search blocks, transactions, addresses..."
                    className="flex-1 text-lg outline-none bg-transparent placeholder-gray-400 text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="border-t border-gray-100">
                    {suggestions.map((suggestion, index) => {
                      const Icon = suggestion.icon;
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full px-6 py-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className={`p-2 rounded-full ${
                            theme === 'pink' ? 'bg-[#C2185B]/10' : 'bg-gray-100'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              theme === 'pink' ? 'text-[#C2185B]' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {suggestion.label}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {suggestion.type}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {searchQuery && !showSuggestions && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <p className="text-sm">No results found. Try a block number, transaction hash, or address.</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
