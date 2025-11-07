'use client';

import { useQuery } from '@apollo/client';
import { GET_STATS } from '@/lib/graphql-queries';
import { BlockCountdown } from '@/components/ui/block-countdown';
import Link from 'next/link';
import { ArrowRightIcon, BlocksIcon, Activity, TrendingUpIcon } from 'lucide-react';

export default function HomePage() {
  const { data: statsData, loading: statsLoading } = useQuery(GET_STATS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="pt-16 pb-24 text-center">
          {/* Hero Title */}
          <div className="mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Taiko
              <span className="block bg-gradient-to-r from-[#D5775E] via-[#E8469B] to-[#D5775E] bg-clip-text text-transparent">
                Blockchain Explorer
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Explore the Taiko Layer 2 blockchain with real-time data, 
              transparent transactions, and comprehensive network insights.
            </p>
          </div>

          {/* Main Network Stats */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              
              {/* Total Blocks Card */}
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <div className="absolute top-4 right-4 w-2 h-16 bg-[#D5775E] transform rotate-12"></div>
                  <div className="absolute top-6 right-8 w-2 h-12 bg-[#E8469B] transform -rotate-12"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#D5775E] to-[#E8469B] rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <BlocksIcon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {statsLoading ? (
                        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded-lg mx-auto w-32"></div>
                      ) : (
                        <span style={{ color: '#D5775E' }}>
                          {(statsData?.stats?.totalBlocks || 0).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-medium text-gray-600 mb-4">Total Blocks</p>
                    <p className="text-sm text-gray-500">All blocks mined on the network</p>
                  </div>
                </div>
              </div>

              {/* Total Transactions Card */}
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <div className="absolute top-4 right-4 w-2 h-16 bg-[#E8469B] transform rotate-45"></div>
                  <div className="absolute top-6 right-8 w-2 h-12 bg-[#D5775E] transform -rotate-45"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#E8469B] to-[#D5775E] rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {statsLoading ? (
                        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded-lg mx-auto w-40"></div>
                      ) : (
                        <span style={{ color: '#E8469B' }}>
                          {(statsData?.stats?.totalTransactions || 0).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-medium text-gray-600 mb-4">Total Transactions</p>
                    <p className="text-sm text-gray-500">All transactions processed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Block Countdown - Centered */}
            <div className="flex justify-center mb-12">
              <div className="w-full max-w-lg">
                <BlockCountdown />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/blocks">
                <button className="group flex items-center gap-3 bg-[#D5775E] hover:bg-[#C26650] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <BlocksIcon className="h-6 w-6" />
                  Explore Blocks
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <Link href="/transactions">
                <button className="group flex items-center gap-3 bg-[#E8469B] hover:bg-[#D93B8B] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Activity className="h-6 w-6" />
                  View Transactions
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Network Status Indicator */}
            <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-[#D5775E] rounded-full animate-pulse"></div>
              <span>Network Status: Active</span>
              <div className="ml-4 flex items-center gap-1">
                <TrendingUpIcon className="h-4 w-4 text-[#D5775E]" />
                <span>Block time: ~12s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}