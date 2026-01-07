'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { GET_TRANSACTIONS, GET_TRANSACTION_COUNTS_BY_STATUS, GET_TRANSACTION_COUNTS_BY_DIRECTION } from '@/lib/graphql-queries';
import { formatEther, formatTimestamp, truncateAddress } from '@/lib/utils';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon, Activity, Clock, DollarSignIcon, Users } from 'lucide-react';

export default function TransactionsPage() {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [directionFilter, setDirectionFilter] = useState<string>('ALL');
  const transactionsPerPage = 50;

  const { data, loading, error, refetch } = useQuery(GET_TRANSACTIONS, {
    variables: {
      limit: transactionsPerPage,
      offset: (currentPage - 1) * transactionsPerPage,
      statusFilter: statusFilter === 'ALL' ? null : statusFilter,
      directionFilter: directionFilter === 'ALL' ? null : directionFilter
    },
    fetchPolicy: 'cache-and-network'
  });


  const { data: statusCounts } = useQuery(GET_TRANSACTION_COUNTS_BY_STATUS);
  const { data: directionCounts } = useQuery(GET_TRANSACTION_COUNTS_BY_DIRECTION);

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [statusFilter, directionFilter, currentPage, refetch]);

  const transactions = data?.transactions?.transactions || [];
  const totalTransactions = data?.transactions?.totalCount || 0;
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);

  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'SUCCESS', label: 'Success' },
    { value: 'FAILED', label: 'Failed' }
  ];

  const directionOptions = [
    { value: 'ALL', label: 'All Directions' },
    { value: 'IN', label: 'in' },
    { value: 'OUT', label: 'out' },
    { value: 'INSIDE', label: 'internal' }
  ];

  const getDirectionLabel = (direction: string) => {
    switch(direction?.toUpperCase()) {
      case 'IN': return 'in';
      case 'OUT': return 'out';
      case 'INSIDE':
      case 'INTERNAL': return 'internal';
      default: return direction?.toLowerCase();
    }
  };

  const getDirectionColors = (direction: string) => {
    if (theme === 'pink') {
      return 'bg-blue-400/30 text-white';
    } else {
      return 'bg-blue-500/20 text-blue-700';
    }
  };

  const getStatusColors = (status: number) => {
    if (theme === 'pink') {
      switch(status) {
        case 1: return 'bg-emerald-400/30 text-white';
        case 0: return 'bg-rose-400/30 text-white';
        default: return 'bg-amber-400/30 text-white';
      }
    } else {
      switch(status) {
        case 1: return 'bg-emerald-600 text-white';
        case 0: return 'bg-rose-600 text-white';
        default: return 'bg-amber-600 text-white';
      }
    }
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
      {/* Page Header */}
      <div className="mb-8">
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
          theme === 'pink' ? 'text-white' : 'text-gray-900'
        }`}>
          Transactions
        </h1>
        <p className={theme === 'pink' ? 'text-white/80' : 'text-gray-600'}>
          Browse all transactions on the Taiko blockchain. Filter by status and explore transaction details.
        </p>
      </div>

      {/* Total Transactions and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Total Transactions Card - Bigger */}
        <div className={`rounded-3xl p-8 shadow-sm border ${
          theme === 'pink'
            ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-2xl border-white/40'
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center gap-4 mb-4">
            <Activity className={`h-8 w-8 ${
              theme === 'pink' ? 'text-white' : 'text-gray-600'
            }`} />
            <h2 className={`text-2xl font-bold ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              Total Transactions
            </h2>
          </div>
          <div className="text-center">
            <div className={`text-6xl font-black mb-2 ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              {totalTransactions.toLocaleString()}
            </div>
            <div className={`text-lg ${
              theme === 'pink' ? 'text-white/80' : 'text-gray-600'
            }`}>
              All transactions on Taiko blockchain
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className={`rounded-3xl p-8 shadow-sm border ${
          theme === 'pink'
            ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-2xl border-white/40'
            : 'bg-white border-gray-100'
        }`}>
          <div className="mb-6">
            <h2 className={`text-2xl font-bold ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              Filters
            </h2>
          </div>
          
          {/* Status Filter */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-3 ${
              theme === 'pink' ? 'text-white/80' : 'text-gray-600'
            }`}>
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => {
                const count = option.value === 'ALL' 
                  ? statusCounts?.transactionCountsByStatus?.reduce((sum: number, item: any) => sum + item.count, 0)
                  : statusCounts?.transactionCountsByStatus?.find((item: any) => 
                      (option.value === 'SUCCESS' && (item.status === 1 || item.status === 'SUCCESS')) ||
                      (option.value === 'FAILED' && (item.status === 0 || item.status === 'FAILED'))
                    )?.count;
                return (
                  <button
                    key={option.value}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === option.value
                        ? 'bg-white text-[#C2185B]' 
                        : theme === 'pink'
                        ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setCurrentPage(1);
                    }}
                  >
                    {option.label} {count ? `(${count.toLocaleString()})` : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direction Filter */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              theme === 'pink' ? 'text-white/80' : 'text-gray-600'
            }`}>
              Direction
            </label>
            <div className="flex flex-wrap gap-2">
              {directionOptions.map((option) => {
                const count = option.value === 'ALL' 
                  ? directionCounts?.transactionCountsByDirection?.reduce((sum: number, item: any) => sum + item.count, 0)
                  : directionCounts?.transactionCountsByDirection?.find((item: any) => item.direction === option.value)?.count;
                return (
                  <button
                    key={option.value}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      directionFilter === option.value
                        ? 'bg-white text-[#C2185B]' 
                        : theme === 'pink'
                        ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      setDirectionFilter(option.value);
                      setCurrentPage(1);
                    }}
                  >
                    {option.label} {count ? `(${count.toLocaleString()})` : ''}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={`rounded-3xl p-6 shadow-sm border ${
        theme === 'pink'
          ? 'bg-white/10 backdrop-blur-md border-white/20'
          : 'bg-white border-gray-100'
      }`}>
        <div className="mb-6">
          <h2 className={`text-lg font-bold ${
            theme === 'pink' ? 'text-white' : 'text-gray-900'
          }`}>All Transactions</h2>
        </div>
        <div>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: transactionsPerPage }).map((_, i) => (
                <div key={i} className={`flex items-center justify-between p-4 border rounded-lg ${
                  theme === 'pink' ? 'border-white/30' : 'border-gray-200'
                }`}>
                  <div className="space-y-2">
                    <div className={`h-4 rounded w-32 animate-pulse ${
                      theme === 'pink' ? 'bg-white/20' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-3 rounded w-48 animate-pulse ${
                      theme === 'pink' ? 'bg-white/20' : 'bg-gray-200'
                    }`}></div>
                  </div>
                  <div className="space-y-2">
                    <div className={`h-4 rounded w-16 animate-pulse ${
                      theme === 'pink' ? 'bg-white/20' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-3 rounded w-20 animate-pulse ${
                      theme === 'pink' ? 'bg-white/20' : 'bg-gray-200'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className={`${
                theme === 'pink' ? 'text-red-300' : 'text-red-600'
              }`}>Error loading transactions: {error.message}</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className={`${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>No transactions found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className={`${
                    theme === 'pink' ? 'bg-white/10' : 'bg-gray-50'
                  }`}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        Transaction Hash
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        Direction
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        Block
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        Age
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        From
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        To
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        Value
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        Gas Fee
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`bg-transparent divide-y ${
                    theme === 'pink' ? 'divide-white/20' : 'divide-gray-200'
                  }`}>
                    {transactions.map((tx: any) => (
                      <tr key={tx.hash} className={`${
                        theme === 'pink' ? 'hover:bg-white/10' : 'hover:bg-gray-50'
                      }`}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Link href={`/transactions/${tx.hash}`} className={`font-medium ${
                            theme === 'pink' ? 'text-white hover:text-white/80' : 'text-gray-900 hover:text-gray-700'
                          }`}>
                            {truncateAddress(tx.hash)}
                          </Link>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold min-w-[60px] ${
                            getDirectionColors(tx.direction)
                          }`}>
                            {getDirectionLabel(tx.direction)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Link href={`/blocks/${tx.blockNumber}`} className={`${
                            theme === 'pink' ? 'text-white hover:text-white/80' : 'text-gray-900 hover:text-gray-700'
                          }`}>
                            {tx.blockNumber}
                          </Link>
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm ${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>
                          {formatTimestamp(tx.timestamp)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Link href={`/address/${tx.fromAddress}`} className={`${
                            theme === 'pink' ? 'text-white hover:text-white/80' : 'text-gray-900 hover:text-gray-700'
                          }`}>
                            {truncateAddress(tx.fromAddress)}
                          </Link>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Link href={`/address/${tx.toAddress}`} className={`${
                            theme === 'pink' ? 'text-white hover:text-white/80' : 'text-gray-900 hover:text-gray-700'
                          }`}>
                            {truncateAddress(tx.toAddress)}
                          </Link>
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm ${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>
                          {tx.valueInEth || '0'} ETH
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm ${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>
                          {formatEther(tx.gasPrice * tx.gasUsed)} ETH
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            getStatusColors(tx.status)
                          }`}>
                            {tx.status === 1 ? 'Success' : tx.status === 0 ? 'Failed' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {transactions.map((tx: any) => (
                  <div key={tx.hash} className={`rounded-3xl p-4 shadow-sm border ${
                    theme === 'pink'
                      ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-2xl border-white/40'
                      : 'bg-white border-gray-100'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col gap-2">
                        <Link href={`/transactions/${tx.hash}`} className={`text-lg font-semibold ${
                          theme === 'pink' ? 'text-white hover:text-white/80' : 'text-gray-900 hover:text-gray-700'
                        }`}>
                          {truncateAddress(tx.hash)}
                        </Link>
                        <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold min-w-[60px] ${
                          getDirectionColors(tx.direction)
                        }`}>
                          {getDirectionLabel(tx.direction)}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        getStatusColors(tx.status)
                      }`}>
                        {tx.status === 1 ? 'Success' : tx.status === 0 ? 'Failed' : 'Pending'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={`${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>Block:</span>
                        <Link href={`/blocks/${tx.blockNumber}`} className={`${
                          theme === 'pink' ? 'text-white hover:text-white/80' : 'text-gray-900 hover:text-gray-700'
                        }`}>
                          #{tx.blockNumber}
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>Age:</span>
                        <span className={`${
                          theme === 'pink' ? 'text-white' : 'text-gray-900'
                        }`}>{formatTimestamp(tx.timestamp)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>From:</span>
                        <Link href={`/address/${tx.fromAddress}`} className={`${
                          theme === 'pink' ? 'text-white hover:text-white/80' : 'text-gray-900 hover:text-gray-700'
                        }`}>
                          {truncateAddress(tx.fromAddress)}
                        </Link>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>To:</span>
                        <Link href={`/address/${tx.toAddress}`} className={`${
                          theme === 'pink' ? 'text-white hover:text-white/80' : 'text-gray-900 hover:text-gray-700'
                        }`}>
                          {truncateAddress(tx.toAddress)}
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>Value:</span>
                        <span className={`font-medium ${
                          theme === 'pink' ? 'text-white' : 'text-gray-900'
                        }`}>{tx.valueInEth || '0'} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>Gas Fee:</span>
                        <span className={`${
                          theme === 'pink' ? 'text-white' : 'text-gray-900'
                        }`}>{formatEther(tx.gasPrice * tx.gasUsed)} ETH</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <div className={`text-sm ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                Showing {((currentPage - 1) * transactionsPerPage) + 1} to {Math.min(currentPage * transactionsPerPage, totalTransactions)} of {totalTransactions} transactions
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "taiko" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}