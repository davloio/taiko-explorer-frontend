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
  
  const initialBlocks = blocksData?.blocks?.blocks?.map((block: any) => {
    return {
      number: block.number,
      hash: block.hash,
      timestamp: block.timestamp,
      transaction_count: block.transactionCount,
      gas_used: block.gasUsed,
      gas_limit: '30000000',
      miner: block.miner
    };
  }) || [];

  const initialTransactions = transactionsData?.transactions?.transactions?.map((tx: any) => {
    return {
      hash: tx.hash,
      block_number: tx.blockNumber,
      from_address: tx.fromAddress,
      to_address: tx.toAddress,
      value: tx.value,
      gas_used: tx.gasUsed,
      status: tx.status === 'SUCCESS' ? 1 : (tx.status === 1 || tx.status === true) ? 1 : 0
    };
  }) || [];
  const webSocketOptions = useMemo(() => ({
    initialBlocks: initialBlocks,
    initialTransactions: initialTransactions
  }), [initialBlocks.length, initialTransactions.length]);

  const { 
    isConnected, 
    lastBlock, 
    latestBlockNumber,
    isBlockProcessing,
    processingBlocks,
    recentBlocks, 
    recentTransactions, 
    totalBlocks, 
    totalTransactions,
    totalAddresses 
  } = useWebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT, webSocketOptions);


  
  const [countdown, setCountdown] = useState(6);
  const [progress, setProgress] = useState(0);
  const [isBlockLate, setIsBlockLate] = useState(false);
  const [lateSeconds, setLateSeconds] = useState(0);

  useEffect(() => {
    if (latestBlockNumber && isConnected) {
      setCountdown(6);
      setIsBlockLate(false);
      setLateSeconds(0);
    }
  }, [latestBlockNumber, isConnected]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsBlockLate(true);
          setLateSeconds(prevLate => prevLate + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isBlockLate) {
      setProgress(100);
    } else {
      setProgress(((6 - countdown) / 6) * 100);
    }
  }, [countdown, isBlockLate]);

  const formatTxValue = (value: string | null | undefined) => {
    if (!value) return '0 ETH';
    const eth = parseInt(value) / 1e18;
    if (eth === 0) return '0 ETH';
    if (eth < 0.001) return '<0.001 ETH';
    return `${eth.toFixed(3)} ETH`;
  };

  const truncateHash = (hash: string | null | undefined) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const getStatusColors = (status: number) => {
    const isSuccess = status === 1;
    if (theme === 'pink') {
      return isSuccess ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200';
    } else {
      return isSuccess ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white';
    }
  };

  const getStatusText = (status: number) => {
    return status === 1 ? 'Success' : 'Failed';
  };

  const getGasUsageLabel = (gasUsed: string, gasLimit: string) => {
    const used = parseInt(gasUsed || '0');
    const limit = parseInt(gasLimit || '30000000');
    if (used === 0) return '0% gas';
    const percentage = Math.round((used / limit) * 100);
    return `${percentage}% gas`;
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
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

        <div className="text-center mb-12">
          <h1 className={`text-5xl lg:text-6xl font-black mb-2 ${
            theme === 'pink' ? 'text-white' : 'text-gray-900'
          }`}>
            Taiko
            <span className={`block ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              Blockchain Explorer
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">

          <div className={`rounded-3xl p-8 shadow-xl border relative ${
            theme === 'pink'
              ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-2xl border-white/40'
              : 'bg-white border-gray-100'
          }`}>
            <div className="mb-6">
              <h2 className={`text-3xl font-bold ${theme === 'pink' ? 'text-white' : 'text-gray-900'}`}>
                Latest Block
              </h2>
            </div>

            <div className="text-center py-8 mb-6">
              <div className={`text-6xl font-black mb-3 ${theme === 'pink' ? 'text-white' : 'text-gray-900'}`}>
                {statsLoading && !latestBlockNumber && !totalBlocks ? (
                  <div className="flex items-center justify-center">
                    <div className={`animate-spin rounded-full h-8 w-8 border-2 ${
                      theme === 'pink' ? 'border-white/30 border-t-white' : 'border-gray-300 border-t-gray-600'
                    }`}></div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>
                      #{(latestBlockNumber || lastBlock?.number || statsData?.stats?.latestBlockNumber || totalBlocks || statsData?.stats?.totalBlocks || 0).toLocaleString()}
                    </span>
                    {isBlockProcessing && (
                      <div className={`animate-spin rounded-full h-4 w-4 border-2 ${
                        theme === 'pink' ? 'border-white/40 border-t-white' : 'border-gray-400 border-t-gray-600'
                      }`}></div>
                    )}
                  </div>
                )}
              </div>
              <div className={`text-sm ${theme === 'pink' ? 'text-white/90' : 'text-gray-600'}`}>
                {isBlockProcessing ? (
                  <span className={`flex items-center justify-center gap-1 ${
                    theme === 'pink' ? 'text-yellow-100' : 'text-yellow-600'
                  }`}>
                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
                    Processing transactions...
                  </span>
                ) : isBlockLate ? (
                  <span className={theme === 'pink' ? 'text-red-100' : 'text-red-600'}>
                    Block late for {lateSeconds} second{lateSeconds !== 1 ? 's' : ''}
                  </span>
                ) : (
                  `Next block in ${countdown} seconds`
                )}
              </div>
            </div>

            <div className={`relative h-2 rounded-full overflow-hidden mb-6 ${
              theme === 'pink' ? 'bg-white/30' : 'bg-gray-100'
            }`}>
              <div
                className={`absolute left-0 top-0 h-full transition-all duration-1000 ease-linear ${
                  isBlockLate
                    ? 'bg-gradient-to-r from-red-500 to-red-400'
                    : theme === 'pink'
                      ? 'bg-gradient-to-r from-white to-white/80'
                      : 'bg-gradient-to-r from-pink-500 to-pink-400'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className={`text-sm space-y-1 ${theme === 'pink' ? 'text-white/90' : 'text-gray-600'}`}>
              {isConnected && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              )}
              {lastBlock && (
                <>
                  <div>Miner: {truncateHash(lastBlock.miner)}</div>
                  <div>{lastBlock.transaction_count} transactions</div>
                </>
              )}
            </div>
          </div>

          <div className={`rounded-3xl p-8 shadow-xl border relative ${
            theme === 'pink'
              ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-2xl border-white/40'
              : 'bg-white border-gray-100'
          }`}>
            <div className="mb-6">
              <h2 className={`text-3xl font-bold ${theme === 'pink' ? 'text-white' : 'text-gray-900'}`}>
                Total Transactions
              </h2>
            </div>

            <div className="text-center py-8">
              <div className={`text-6xl font-black mb-3 ${theme === 'pink' ? 'text-white' : 'text-gray-900'}`}>
                {statsLoading && !totalTransactions && !statsData?.stats?.totalTransactions ? (
                  <div className="flex items-center justify-center">
                    <div className={`animate-spin rounded-full h-8 w-8 border-2 ${
                      theme === 'pink' ? 'border-white/30 border-t-white' : 'border-gray-300 border-t-gray-600'
                    }`}></div>
                  </div>
                ) : (
                  (totalTransactions || statsData?.stats?.totalTransactions || 0).toLocaleString()
                )}
              </div>
              <div className={`text-sm ${theme === 'pink' ? 'text-white/90' : 'text-gray-600'}`}>
                Transactions processed on the blockchain
              </div>
            </div>
          </div>

          <div className={`rounded-3xl p-8 shadow-sm border ${
            theme === 'pink'
              ? 'bg-white/10 backdrop-blur-md border-white/20'
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-3xl font-bold ${theme === 'pink' ? 'text-white' : 'text-gray-900'}`}>
                Latest Blocks
              </h2>
              <Link
                href="/blocks"
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors group ${
                  theme === 'pink'
                    ? 'bg-white/20 hover:bg-white/30'
                    : 'bg-pink-500 hover:bg-pink-600'
                }`}
              >
                <ArrowRightIcon className={`h-5 w-5 transform rotate-[-45deg] ${
                  theme === 'pink' ? 'text-white' : 'text-white'
                }`} />
              </Link>
            </div>

            <div>
                  {blocksLoading && recentBlocks.length === 0 ? (
                  <div className={`text-center py-8 ${theme === 'pink' ? 'text-white/80' : 'text-gray-500'}`}>
                    Loading latest blocks...
                  </div>
                ) : recentBlocks.length > 0 ? (
                  recentBlocks.slice(0, 10).map((block: any, index: number) => (
                    <Link
                      key={block.hash}
                      href={`/blocks/${block.number}`}
                      className={`block p-4 mb-3 rounded-2xl transition-all cursor-pointer border ${
                        theme === 'pink'
                          ? 'bg-white/20 hover:bg-white/30 border-white/40 shadow-lg'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      } ${index === 0 ? 'animate-fadeIn' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-mono text-sm font-semibold ${
                          theme === 'pink' ? 'text-white' : 'text-gray-900'
                        }`}>
                          Block #{block.number}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          theme === 'pink'
                            ? 'bg-white/20 text-white'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {block.transaction_count || block.transactionCount || 0} txns
                        </span>
                      </div>
                      <div className={`flex items-center justify-between text-xs ${
                        theme === 'pink' ? 'text-white/90' : 'text-gray-600'
                      }`}>
                        <div>
                          Miner: {truncateHash(block.miner)}
                        </div>
                        <div className="font-semibold">
                          {getTimeAgo(block.timestamp)}
                        </div>
                      </div>
                    </Link>
                  ))
                  ) : (
                    <div className={`text-center py-8 ${theme === 'pink' ? 'text-white/80' : 'text-gray-500'}`}>
                      {isConnected ? 'Waiting for blocks...' : 'Connecting...'}
                    </div>
                  )}
            </div>
          </div>

          <div className={`rounded-3xl p-8 shadow-sm border ${
            theme === 'pink'
              ? 'bg-white/10 backdrop-blur-md border-white/20'
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-3xl font-bold ${theme === 'pink' ? 'text-white' : 'text-gray-900'}`}>
                Latest Transactions
              </h2>
              <Link
                href="/transactions"
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors group ${
                  theme === 'pink'
                    ? 'bg-white/20 hover:bg-white/30'
                    : 'bg-pink-500 hover:bg-pink-600'
                }`}
              >
                <ArrowRightIcon className="h-5 w-5 text-white transform rotate-[-45deg]" />
              </Link>
            </div>

            <div>
                  {transactionsLoading && recentTransactions.length === 0 ? (
                  <div className={`text-center py-8 ${theme === 'pink' ? 'text-white/80' : 'text-gray-500'}`}>
                    Loading latest transactions...
                  </div>
                ) : recentTransactions.length > 0 ? (
                  recentTransactions.slice(0, 10).map((tx: any, index: number) => (
                    <Link
                      key={tx.hash}
                      href={`/transactions/${tx.hash}`}
                      className={`block p-4 mb-3 rounded-2xl transition-all cursor-pointer border ${
                        theme === 'pink'
                          ? 'bg-white/20 hover:bg-white/30 border-white/40 shadow-lg'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      } ${index === 0 ? 'animate-fadeIn' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-mono text-sm font-semibold ${
                          theme === 'pink' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {truncateHash(tx.hash)}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          tx.status === 1
                            ? theme === 'pink'
                              ? 'bg-emerald-400/30 text-white'
                              : 'bg-emerald-100 text-emerald-700'
                            : theme === 'pink'
                              ? 'bg-rose-400/30 text-white'
                              : 'bg-rose-100 text-rose-700'
                        }`}>
                          {getStatusText(tx.status)}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between text-xs ${
                        theme === 'pink' ? 'text-white/90' : 'text-gray-600'
                      }`}>
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
                    <div className={`text-center py-8 ${theme === 'pink' ? 'text-white/80' : 'text-gray-500'}`}>
                      {isConnected ? 'Waiting for transactions...' : 'Connecting...'}
                    </div>
                  )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className={`rounded-3xl p-8 shadow-sm border ${
            theme === 'pink'
              ? 'bg-white/10 backdrop-blur-md border-white/20'
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-3xl font-bold ${theme === 'pink' ? 'text-white' : 'text-gray-900'}`}>
                Total Users
              </h2>
              <Link
                href="/addresses"
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors group ${
                  theme === 'pink'
                    ? 'bg-white/20 hover:bg-white/30'
                    : 'bg-pink-500 hover:bg-pink-600'
                }`}
              >
                <ArrowRightIcon className="h-5 w-5 text-white transform rotate-[-45deg]" />
              </Link>
            </div>

            <div className="text-center py-8">
              <div className={`text-6xl font-black mb-3 ${theme === 'pink' ? 'text-white' : 'text-gray-900'}`}>
                {statsLoading ? '...' : (totalAddresses || statsData?.stats?.totalAddresses || 0).toLocaleString()}
              </div>
              <div className={`text-sm ${theme === 'pink' ? 'text-white/90' : 'text-gray-600'}`}>
                Total unique addresses
              </div>
            </div>

            <div className={`mt-6 text-center text-sm ${theme === 'pink' ? 'text-white/90' : 'text-gray-500'}`}>
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