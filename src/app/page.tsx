'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GET_STATS, GET_LATEST_BLOCK, GET_RECENT_BLOCKS, GET_RECENT_TRANSACTIONS } from '@/lib/graphql-queries';
import { formatEther, formatTimestamp, truncateAddress } from '@/lib/utils';
import { TaikoBackground } from '@/components/ui/taiko-lines';
import { BlockCountdown } from '@/components/ui/block-countdown';
import Link from 'next/link';
import { ArrowRightIcon, BlocksIcon, Activity, Clock } from 'lucide-react';

export default function HomePage() {
  const { data: statsData, loading: statsLoading } = useQuery(GET_STATS);
  const { data: latestBlockData, loading: latestBlockLoading } = useQuery(GET_LATEST_BLOCK);
  const { data: blocksData, loading: blocksLoading } = useQuery(GET_RECENT_BLOCKS, {
    variables: { limit: 5 }
  });
  const { data: transactionsData, loading: transactionsLoading } = useQuery(GET_RECENT_TRANSACTIONS, {
    variables: { limit: 8 }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Block Countdown */}
        <div className="mb-16 flex justify-center animate-in fade-in-50 duration-1000 delay-600">
          <div className="w-full max-w-md">
            <BlockCountdown />
          </div>
        </div>

        {/* Network Overview */}
        <div className="mb-16 relative">
          <h2 className="taiko-heading-lg text-center mb-8 animate-in fade-in-50 duration-1000 delay-700">
            Network Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Subtle background lines for stats section */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-taiko-pink to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-taiko-purple to-transparent"></div>
            </div>
            
            <div className="taiko-card group hover:taiko-glow animate-in fade-in-50 duration-1000 delay-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                <div className="absolute top-2 right-2 w-1 h-8 bg-taiko-pink transform rotate-12"></div>
                <div className="absolute top-4 right-6 w-1 h-6 bg-taiko-purple transform -rotate-12"></div>
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Latest Block</CardTitle>
                <div className="p-2 bg-taiko-gradient rounded-lg group-hover:shadow-lg transition-all duration-300">
                  <BlocksIcon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {latestBlockLoading ? (
                    <div className="h-8 taiko-shimmer rounded-md"></div>
                  ) : (
                    <span className="taiko-text-primary">
                      #{latestBlockData?.latestBlock?.number || '0'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium">Current height</p>
              </CardContent>
            </div>

            <div className="taiko-card group hover:taiko-glow animate-in fade-in-50 duration-1000 delay-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                <div className="absolute top-1 right-3 w-1 h-10 bg-taiko-purple transform rotate-45"></div>
                <div className="absolute top-3 right-1 w-1 h-8 bg-teal-400 transform -rotate-45"></div>
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Total Transactions</CardTitle>
                <div className="p-2 bg-taiko-purple-gradient rounded-lg group-hover:shadow-lg transition-all duration-300">
                  <Activity className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {statsLoading ? (
                    <div className="h-8 taiko-shimmer rounded-md"></div>
                  ) : (
                    <span className="text-taiko-purple">
                      {(statsData?.stats?.totalTransactions || 0).toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium">All time</p>
              </CardContent>
            </div>

            <div className="taiko-card group hover:taiko-glow animate-in fade-in-50 duration-1000 delay-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                <div className="absolute top-2 right-4 w-1 h-9 bg-yellow-400 transform rotate-30"></div>
                <div className="absolute top-4 right-2 w-1 h-7 bg-orange-400 transform -rotate-30"></div>
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Total Blocks</CardTitle>
                <div className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg group-hover:shadow-lg transition-all duration-300">
                  <Activity className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {statsLoading ? (
                    <div className="h-8 taiko-shimmer rounded-md"></div>
                  ) : (
                    <span style={{ color: '#FFC236' }}>
                      {(statsData?.stats?.totalBlocks || 0).toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium">Total blocks</p>
              </CardContent>
            </div>

            <div className="taiko-card group hover:taiko-glow animate-in fade-in-50 duration-1000 delay-1000 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                <div className="absolute top-3 right-2 w-1 h-8 bg-taiko-pink transform rotate-60"></div>
                <div className="absolute top-1 right-5 w-1 h-6 bg-purple-400 transform -rotate-60"></div>
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Avg Block Time</CardTitle>
                <div className="p-2 bg-taiko-pink-gradient rounded-lg group-hover:shadow-lg transition-all duration-300">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  <span className="taiko-text-primary">
                    ~12s
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">Average time</p>
              </CardContent>
            </div>
          </div>
        </div>

        {/* Latest Blocks and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          {/* Connecting line between sections */}
          <div className="absolute top-1/2 left-1/2 w-px h-32 bg-gradient-to-b from-taiko-pink/20 via-taiko-purple/20 to-taiko-pink/20 transform -translate-x-1/2 -translate-y-1/2 lg:block hidden"></div>
          
          {/* Latest Blocks */}
          <div className="taiko-card animate-in fade-in-50 duration-1000 delay-1100 relative overflow-hidden">
            {/* Subtle corner decoration */}
            <div className="absolute top-0 left-0 w-16 h-16 opacity-5">
              <div className="absolute top-2 left-2 w-8 h-px bg-taiko-pink"></div>
              <div className="absolute top-2 left-2 w-px h-8 bg-taiko-pink"></div>
            </div>
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-1">Latest Blocks</CardTitle>
                <p className="text-sm text-gray-500">Recently mined blocks</p>
              </div>
              <Button className="taiko-button-primary" size="sm" asChild>
                <Link href="/blocks">
                  View All <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {blocksLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl animate-pulse">
                    <div className="space-y-2 flex-1">
                      <div className="h-5 taiko-shimmer rounded w-24"></div>
                      <div className="h-4 taiko-shimmer rounded w-32"></div>
                    </div>
                    <div className="space-y-2 text-right">
                      <div className="h-4 taiko-shimmer rounded w-20"></div>
                      <div className="h-3 taiko-shimmer rounded w-24"></div>
                    </div>
                  </div>
                ))
              ) : (
                blocksData?.blocks?.blocks?.map((block: any, index: number) => (
                  <div key={block.number} className="group p-4 bg-gradient-to-r from-white to-gray-50/50 rounded-xl border border-gray-100 hover:border-taiko-pink/30 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-taiko-gradient rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <BlocksIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Link href={`/blocks/${block.number}`} className="text-lg font-bold text-taiko-pink hover:text-taiko-purple transition-colors duration-200">
                            #{block.number}
                          </Link>
                          <p className="text-sm text-gray-600 font-medium">
                            {block.transactionCount} transaction{block.transactionCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatTimestamp(block.timestamp)}</p>
                        <p className="text-xs text-gray-500 font-mono">
                          {truncateAddress(block.miner)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </div>

          {/* Latest Transactions */}
          <div className="taiko-card animate-in fade-in-50 duration-1000 delay-1200 relative overflow-hidden">
            {/* Subtle corner decoration */}
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
              <div className="absolute top-2 right-2 w-8 h-px bg-taiko-purple"></div>
              <div className="absolute top-2 right-2 w-px h-8 bg-taiko-purple"></div>
            </div>
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-1">Latest Transactions</CardTitle>
                <p className="text-sm text-gray-500">Recent network activity</p>
              </div>
              <Button className="taiko-button-primary" size="sm" asChild>
                <Link href="/transactions">
                  View All <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {transactionsLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl animate-pulse">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 taiko-shimmer rounded w-36"></div>
                      <div className="h-3 taiko-shimmer rounded w-28"></div>
                    </div>
                    <div className="space-y-2 text-right">
                      <div className="h-4 taiko-shimmer rounded w-16"></div>
                      <div className="h-3 taiko-shimmer rounded w-20"></div>
                    </div>
                  </div>
                ))
              ) : (
                transactionsData?.transactions?.transactions?.slice(0, 8).map((tx: any, index: number) => (
                  <div key={tx.hash} className="group p-3 bg-gradient-to-r from-white to-gray-50/50 rounded-xl border border-gray-100 hover:border-taiko-purple/30 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-taiko-purple-gradient rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Activity className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/transactions/${tx.hash}`} className="font-semibold text-taiko-purple hover:text-taiko-pink block truncate transition-colors duration-200">
                            {truncateAddress(tx.hash)}
                          </Link>
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <span className="font-mono">{truncateAddress(tx.fromAddress)}</span>
                            <ArrowRightIcon className="h-3 w-3 text-gray-400" />
                            <span className="font-mono">{truncateAddress(tx.toAddress)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <div className="mb-1">
                          {tx.status === 1 ? (
                            <span className="status-success">Success</span>
                          ) : tx.status === 0 ? (
                            <span className="status-failed">Failed</span>
                          ) : (
                            <span className="status-pending">Pending</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                          {tx.valueInEth || '0'} ETH
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
}