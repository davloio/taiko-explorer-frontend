'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TOP_ADDRESSES } from '@/lib/graphql-queries';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { Users, TrendingUp, Activity, Hash, ArrowUpRight } from 'lucide-react';
import AddressGrowthChart from '@/components/charts/AddressGrowthChart';

export default function AddressesPage() {
  const { theme } = useTheme();
  const { data: topAddressesData, loading: topAddressesLoading } = useQuery(GET_TOP_ADDRESSES);

  const truncateAddress = (address: string | null | undefined) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatVolume = (volume: string) => {
    const eth = parseFloat(volume);
    if (eth >= 1000000) return `${(eth / 1000000).toFixed(2)}M ETH`;
    if (eth >= 1000) return `${(eth / 1000).toFixed(2)}K ETH`;
    return `${eth.toFixed(3)} ETH`;
  };

  return (
    <div className={theme === 'pink' ? 'min-h-screen bg-gradient-to-br from-[#C2185B] to-pink-500 relative overflow-hidden transition-colors duration-500' : 'min-h-screen bg-gradient-to-br from-white to-pink-100 relative overflow-hidden transition-colors duration-500'}>
      {/* Taiko-style animated background dots */}
      <div className="taiko-bg-dots">
        <div className="taiko-dot taiko-dot-pink" style={{ top: '10%', left: '5%' }}></div>
        <div className="taiko-dot taiko-dot-purple" style={{ top: '15%', left: '15%' }}></div>
        <div className="taiko-dot taiko-dot-yellow" style={{ top: '20%', left: '85%' }}></div>
        <div className="taiko-dot taiko-dot-cyan" style={{ top: '25%', right: '10%' }}></div>
        <div className="taiko-dot taiko-dot-pink" style={{ top: '40%', left: '8%' }}></div>
        <div className="taiko-dot taiko-dot-orange" style={{ top: '50%', left: '90%' }}></div>
        <div className="taiko-dot taiko-dot-purple" style={{ top: '60%', left: '12%' }}></div>
        <div className="taiko-dot taiko-dot-yellow" style={{ top: '70%', right: '15%' }}></div>
        <div className="taiko-dot taiko-dot-cyan" style={{ top: '75%', left: '20%' }}></div>
        <div className="taiko-dot taiko-dot-pink" style={{ top: '85%', right: '8%' }}></div>
        <div className="taiko-dot taiko-dot-purple" style={{ top: '30%', left: '50%' }}></div>
        <div className="taiko-dot taiko-dot-orange" style={{ top: '5%', right: '25%' }}></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className={`h-12 w-12 ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`} />
            <h1 className={`text-4xl lg:text-5xl font-bold ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              Addresses
            </h1>
          </div>
          <p className={`text-lg ${
            theme === 'pink' ? 'text-white/90' : 'text-gray-600'
          }`}>
            Explore top addresses by volume and activity on the Taiko network
          </p>
        </div>

        {/* Top Addresses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Top Addresses by Volume */}
          <div className={`rounded-3xl p-6 shadow-sm border ${
            theme === 'pink'
              ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-2xl border-white/40'
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className={`h-6 w-6 ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`} />
              <h2 className={`text-xl font-bold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                Top Addresses by Volume
              </h2>
            </div>
            
            <div className="space-y-3">
              {topAddressesLoading ? (
                <div className={`text-center py-12 ${
                  theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  Loading top addresses...
                </div>
              ) : topAddressesData?.topAddressesByVolume?.length > 0 ? (
                topAddressesData.topAddressesByVolume.map((address: any, index: number) => (
                  <Link
                    key={address.address}
                    href={`/addresses/${address.address}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        theme === 'pink' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Hash className={`h-4 w-4 ${
                            theme === 'pink' ? 'text-white/60' : 'text-gray-500'
                          }`} />
                          <span className={`font-mono text-sm ${
                            theme === 'pink' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {truncateAddress(address.address)}
                          </span>
                          <ArrowUpRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                            theme === 'pink' ? 'text-white/60' : 'text-gray-500'
                          }`} />
                        </div>
                        <div className={`text-xs ${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>
                          {address.totalTransactions} transactions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        theme === 'pink' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {formatVolume(address.totalVolumeInEth)}
                      </div>
                      <div className={`text-xs ${
                        theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        Score: {address.activityScore}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className={`text-center py-12 ${
                  theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  No address data available
                </div>
              )}
            </div>
          </div>

          {/* Top Addresses by Activity */}
          <div className={`rounded-3xl p-6 shadow-sm border ${
            theme === 'pink'
              ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-2xl border-white/40'
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <Activity className={`h-6 w-6 ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`} />
              <h2 className={`text-xl font-bold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                Top Addresses by Activity
              </h2>
            </div>
            
            <div className="space-y-3">
              {topAddressesLoading ? (
                <div className={`text-center py-12 ${
                  theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  Loading top addresses...
                </div>
              ) : topAddressesData?.topAddressesByActivity?.length > 0 ? (
                topAddressesData.topAddressesByActivity.map((address: any, index: number) => (
                  <Link
                    key={address.address}
                    href={`/addresses/${address.address}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        theme === 'pink' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Hash className={`h-4 w-4 ${
                            theme === 'pink' ? 'text-white/60' : 'text-gray-500'
                          }`} />
                          <span className={`font-mono text-sm ${
                            theme === 'pink' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {truncateAddress(address.address)}
                          </span>
                          <ArrowUpRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                            theme === 'pink' ? 'text-white/60' : 'text-gray-500'
                          }`} />
                        </div>
                        <div className={`text-xs ${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>
                          {address.uniqueCounterparties} unique counterparties
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        theme === 'pink' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {address.totalTransactions}
                      </div>
                      <div className={`text-xs ${
                        theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        transactions
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className={`text-center py-12 ${
                  theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  No activity data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Address Growth Chart */}
        <div className="mt-12 max-w-7xl mx-auto">
          <AddressGrowthChart />
        </div>

      </div>
    </div>
  );
}