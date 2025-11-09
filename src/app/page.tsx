'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_STATS, GET_RECENT_BLOCKS, GET_RECENT_TRANSACTIONS } from '@/lib/graphql-queries';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { ArrowRightIcon, BlocksIcon, Activity, TrendingUpIcon, Wifi, WifiOff, Hash, Clock, Users } from 'lucide-react';

export default function HomePage() {
  const { theme } = useTheme();
  const { data: statsData, loading: statsLoading } = useQuery(GET_STATS);
  const { data: blocksData, loading: blocksLoading } = useQuery(GET_RECENT_BLOCKS, {
    variables: { limit: 10 }
  });
  const { data: transactionsData, loading: transactionsLoading } = useQuery(GET_RECENT_TRANSACTIONS, {
    variables: { limit: 10 }
  });
  
  // Prepare initial data for WebSocket
  const initialBlocks = blocksData?.blocks?.blocks?.map((block: any) => ({
    number: block.number,
    hash: block.hash,
    timestamp: block.timestamp,
    transaction_count: block.transactionCount,
    gas_used: block.gasUsed,
    gas_limit: '30000000',
    miner: block.miner
  })) || [];

  const initialTransactions = transactionsData?.transactions?.transactions?.map((tx: any) => ({
    hash: tx.hash,
    block_number: tx.blockNumber,
    from_address: tx.fromAddress,
    to_address: tx.toAddress,
    value: tx.value,
    gas_used: tx.gasUsed,
    status: tx.status === 'SUCCESS' ? 1 : 0
  })) || [];


  // Memoize WebSocket options to prevent constant reconnections
  const webSocketOptions = useMemo(() => ({
    initialBlocks: initialBlocks,
    initialTransactions: initialTransactions
  }), [initialBlocks.length, initialTransactions.length]);

  const { 
    isConnected, 
    lastBlock, 
    recentBlocks, 
    recentTransactions, 
    totalBlocks, 
    totalTransactions,
    totalAddresses 
  } = useWebSocket('ws://localhost:3000/ws', webSocketOptions);

  
  const [countdown, setCountdown] = useState(12);
  const [progress, setProgress] = useState(0);

  // Reset countdown when new block arrives
  useEffect(() => {
    if (lastBlock && isConnected) {
      setCountdown(12); 
    }
  }, [lastBlock, isConnected]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 12;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setProgress(((12 - countdown) / 12) * 100);
  }, [countdown]);

  const formatTxValue = (value: string) => {
    const eth = parseInt(value) / 1e18;
    if (eth === 0) return '0 ETH';
    if (eth < 0.001) return '<0.001 ETH';
    return `${eth.toFixed(3)} ETH`;
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const getStatusColors = (status: number) => {
    if (theme === 'pink') {
      return status === 1 ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200';
    } else {
      return status === 1 ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white';
    }
  };

  return (
    <div className={theme === 'pink' ? 'min-h-screen bg-[#C2185B]' : 'min-h-screen bg-gray-50'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl lg:text-5xl font-bold mb-2 ${
            theme === 'pink' ? 'text-white' : 'text-gray-900'
          }`}>
            Taiko
            <span className={`block ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              Blockchain Explorer
            </span>
          </h1>
          <p className={`text-lg ${
            theme === 'pink' ? 'text-white/90' : 'text-gray-600'
          }`}>
            Real-time blockchain data with WebSocket updates
          </p>
        </div>

        {/* 4-Card Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          
          {/* Top Left: Latest Block with Loading Bar */}
          <div className={`rounded-2xl p-6 shadow-lg border ${
            theme === 'pink' 
              ? 'bg-white/20 backdrop-blur-sm border-white/30' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BlocksIcon className={`h-5 w-5 ${
                  theme === 'pink' ? 'text-white' : 'text-gray-600'
                }`} />
                <h2 className={`text-lg font-bold ${
                  theme === 'pink' ? 'text-white' : 'text-gray-900'
                }`}>Latest Block</h2>
              </div>
              {isConnected && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-xs ${theme === 'pink' ? 'text-white/80' : 'text-gray-700'}`}>Live</span>
                </div>
              )}
            </div>
            
            <div className="text-center mb-4">
              <div className={`text-5xl font-black mb-2 ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                #{(lastBlock?.number || totalBlocks || statsData?.stats?.totalBlocks || 0).toLocaleString()}
              </div>
              <div className={`text-sm ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                Next block in {countdown} seconds
              </div>
            </div>

            {/* 12-second progress bar */}
            <div className={`relative h-3 rounded-full overflow-hidden ${
              theme === 'pink' ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              <div 
                className={`absolute left-0 top-0 h-full transition-all duration-1000 ease-linear ${
                  theme === 'pink' 
                    ? 'bg-gradient-to-r from-white to-white/80' 
                    : 'bg-gradient-to-r from-[#C2185B] to-[#C2185B]/80'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {lastBlock && (
              <div className={`mt-4 text-xs ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                <div>Miner: {truncateHash(lastBlock.miner)}</div>
                <div>{lastBlock.transaction_count} transactions</div>
              </div>
            )}
          </div>

          {/* Top Right: Transaction Count */}
          <div className={`rounded-2xl p-6 shadow-lg border ${
            theme === 'pink' 
              ? 'bg-white/20 backdrop-blur-sm border-white/30' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <Activity className={`h-5 w-5 ${
                theme === 'pink' ? 'text-white' : 'text-gray-600'
              }`} />
              <h2 className={`text-lg font-bold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>Total Transactions</h2>
            </div>
            
            <div className="text-center">
              <div className={`text-5xl font-black mb-2 ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                {(totalTransactions || statsData?.stats?.totalTransactions || 0).toLocaleString()}
              </div>
              <div className={`text-sm ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                All transactions processed
              </div>
            </div>
          </div>

          {/* Bottom Left: Latest 10 Blocks */}
          <div className={`rounded-2xl p-6 shadow-lg border h-[900px] flex flex-col ${
            theme === 'pink' 
              ? 'bg-white/20 backdrop-blur-sm border-white/30' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${theme === 'pink' ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                <BlocksIcon className={`h-5 w-5 ${theme === 'pink' ? 'text-white' : 'text-gray-900'}`} />
                Latest Blocks
              </h2>
              <Link href="/blocks" className={`text-sm ${theme === 'pink' ? 'text-white' : 'text-gray-900'} hover:underline`}>
                View all →
              </Link>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <div>
                  {blocksLoading ? (
                  <div className={`text-center py-8 ${theme === 'pink' ? 'text-white' : 'text-gray-900'}/60`}>
                    Loading latest blocks...
                  </div>
                ) : recentBlocks.length > 0 ? (
                  recentBlocks.slice(0, 10).map((block: any, index: number) => (
                    <Link
                      key={block.hash}
                      href={`/blocks/${block.number}`}
                      className={`block p-3 mb-3 rounded-xl transition-colors cursor-pointer border ${
                        theme === 'pink' 
                          ? 'bg-white/10 hover:bg-white/20 border-white/20' 
                          : 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm'
                      } ${index === 0 ? 'animate-fadeIn' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-mono text-xs ${theme === 'pink' ? 'text-white' : 'text-gray-900'}`}>
                          Block #{block.number}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          theme === 'pink' 
                            ? 'bg-blue-500/20 text-blue-200' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {block.transaction_count} txns
                        </span>
                      </div>
                      <div className={`flex items-center justify-between text-xs ${theme === 'pink' ? 'text-white' : 'text-gray-900'}/80`}>
                        <div>
                          Miner: {truncateHash(block.miner)}
                        </div>
                        <div className="font-semibold">
                          {new Date(block.timestamp * 1000).toLocaleTimeString()}
                        </div>
                      </div>
                    </Link>
                  ))
                  ) : (
                    <div className={`text-center py-8 ${theme === 'pink' ? 'text-white' : 'text-gray-900'}/60`}>
                      {isConnected ? 'Waiting for blocks...' : 'Connecting...'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right: Latest 10 Transactions */}
          <div className={`rounded-2xl p-6 shadow-lg border h-[900px] flex flex-col ${
            theme === 'pink' 
              ? 'bg-white/20 backdrop-blur-sm border-white/30' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${theme === 'pink' ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                <Activity className={`h-5 w-5 ${theme === 'pink' ? 'text-white' : 'text-gray-900'}`} />
                Latest Transactions
              </h2>
              <Link href="/transactions" className={`text-sm ${theme === 'pink' ? 'text-white' : 'text-gray-900'} hover:underline`}>
                View all →
              </Link>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <div>
                  {transactionsLoading ? (
                  <div className={`text-center py-8 ${theme === 'pink' ? 'text-white' : 'text-gray-900'}/60`}>
                    Loading latest transactions...
                  </div>
                ) : recentTransactions.length > 0 ? (
                  recentTransactions.slice(0, 10).map((tx: any, index: number) => (
                    <Link
                      key={tx.hash}
                      href={`/transactions/${tx.hash}`}
                      className={`block p-3 mb-3 rounded-xl transition-colors cursor-pointer border ${
                        theme === 'pink' 
                          ? 'bg-white/10 hover:bg-white/20 border-white/20' 
                          : 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm'
                      } ${index === 0 ? 'animate-fadeIn' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-mono text-xs ${theme === 'pink' ? 'text-white' : 'text-gray-900'}`}>
                          {truncateHash(tx.hash)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          getStatusColors(tx.status)
                        }`}>
                          {tx.status === 1 ? 'Success' : 'Failed'}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between text-xs ${theme === 'pink' ? 'text-white' : 'text-gray-900'}/80`}>
                        <div>
                          From: {truncateHash(tx.from_address)}
                        </div>
                        <div className="font-semibold">
                          {formatTxValue(tx.value)}
                        </div>
                      </div>
                    </Link>
                  ))
                  ) : (
                    <div className={`text-center py-8 ${theme === 'pink' ? 'text-white' : 'text-gray-900'}/60`}>
                      {isConnected ? 'Waiting for transactions...' : 'Connecting...'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Users Card - Full Width */}
        <div className="mt-6 max-w-6xl mx-auto">
          <div className={`rounded-2xl p-6 shadow-lg border ${
            theme === 'pink' 
              ? 'bg-white/20 backdrop-blur-sm border-white/30' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className={`h-6 w-6 ${
                  theme === 'pink' ? 'text-white' : 'text-gray-600'
                }`} />
                <h2 className={`text-xl font-bold ${
                  theme === 'pink' ? 'text-white' : 'text-gray-900'
                }`}>Total Users</h2>
              </div>
              <Link href="/addresses" className={`text-sm ${
                theme === 'pink' ? 'text-white hover:text-white/80' : 'text-gray-900 hover:text-gray-700'
              } hover:underline flex items-center gap-1`}>
                View all addresses →
              </Link>
            </div>
            
            <div className="mt-6 text-center">
              <div className={`text-6xl font-black mb-2 ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                {statsLoading ? '...' : (totalAddresses || statsData?.stats?.totalAddresses || 0).toLocaleString()}
              </div>
              <div className={`text-sm ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                Total unique addresses
              </div>
            </div>
            
            <div className={`mt-6 text-center text-xs ${
              theme === 'pink' ? 'text-white/70' : 'text-gray-500'
            }`}>
              Addresses that have participated in blockchain transactions
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}