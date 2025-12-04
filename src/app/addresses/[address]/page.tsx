'use client';

import { useQuery } from '@apollo/client';
import { useTheme } from '@/contexts/ThemeContext';
import { GET_ADDRESS_STATS, GET_ADDRESS_PROFILE, GET_ADDRESS_TRANSACTIONS } from '@/lib/graphql-queries';
import Link from 'next/link';
import { ArrowLeft, Hash, Activity, TrendingUp, Clock, ExternalLink, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface AddressDetailPageProps {
  params: {
    address: string;
  };
}

export default function AddressDetailPage({ params }: AddressDetailPageProps) {
  const { theme } = useTheme();
  const [copySuccess, setCopySuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [directionFilter, setDirectionFilter] = useState<string>('ALL');

  const { data: statsData, loading: statsLoading, error: statsError } = useQuery(GET_ADDRESS_STATS, {
    variables: { address: params.address }
  });

  const { data: profileData, loading: profileLoading, error: profileError } = useQuery(GET_ADDRESS_PROFILE, {
    variables: { address: params.address }
  });

  const { data: transactionsData, loading: transactionsLoading, error: transactionsError, refetch } = useQuery(GET_ADDRESS_TRANSACTIONS, {
    variables: { 
      address: params.address, 
      limit: pageSize, 
      offset: currentPage * pageSize,
      statusFilter: statusFilter === 'ALL' ? null : statusFilter,
      directionFilter: directionFilter === 'ALL' ? null : directionFilter
    },
    fetchPolicy: 'cache-and-network'
  });

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

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [statusFilter, directionFilter, currentPage, refetch]);

  const handleCopy = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(params.address);
      } else {
        // Fallback for non-HTTPS or older browsers
        const textArea = document.createElement('textarea');
        textArea.value = params.address;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const truncateHash = (hash: string | null | undefined) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const formatValue = (value: string | null | undefined) => {
    if (!value) return '0 ETH';
    const eth = parseFloat(value) / 1e18;
    if (eth === 0) return '0 ETH';
    if (eth < 0.001) return '<0.001 ETH';
    return `${eth.toFixed(6)} ETH`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getDirectionColors = (direction: string) => {
    if (theme === 'pink') {
      return 'bg-blue-500/20 text-blue-300';
    } else {
      return 'bg-blue-500/20 text-blue-300';
    }
  };

  const getStatusColors = (isSuccessful: boolean) => {
    if (theme === 'pink') {
      return isSuccessful ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200';
    } else {
      return isSuccessful ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white';
    }
  };

  const getDirectionLabel = (direction: string) => {
    switch(direction?.toUpperCase()) {
      case 'IN': return 'in';
      case 'OUT': return 'out';
      case 'INSIDE':
      case 'INTERNAL': return 'internal';
      default: return direction?.toLowerCase();
    }
  };


  if (statsLoading || profileLoading) {
    return (
      <div className={theme === 'pink' ? 'min-h-screen bg-[#C2185B]' : 'min-h-screen bg-gray-50'}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`text-center py-20 ${
            theme === 'pink' ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto mb-4"></div>
            Loading address details...
          </div>
        </div>
      </div>
    );
  }

  if (statsError || profileError) {
    return (
      <div className={theme === 'pink' ? 'min-h-screen bg-[#C2185B]' : 'min-h-screen bg-gray-50'}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`text-center py-20 ${
            theme === 'pink' ? 'text-white' : 'text-gray-900'
          }`}>
            <h1 className="text-2xl font-bold mb-4">Error Loading Address</h1>
            <p>Could not load data for address: {params.address}</p>
            {statsError && <p className="text-sm mt-2">Stats Error: {statsError.message}</p>}
            {profileError && <p className="text-sm mt-2">Profile Error: {profileError.message}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={theme === 'pink' ? 'min-h-screen bg-[#C2185B]' : 'min-h-screen bg-gray-50'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/addresses"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              theme === 'pink' 
                ? 'bg-white/20 text-white hover:bg-white/30' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Addresses
          </Link>
        </div>

        {/* Address Header */}
        <div className={`rounded-2xl p-6 shadow-lg border mb-8 ${
          theme === 'pink' 
            ? 'bg-white/20 backdrop-blur-sm border-white/30' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <Hash className={`h-6 w-6 ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`} />
            <h1 className={`text-2xl font-bold ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              Address Details
            </h1>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className={`font-mono text-lg break-all ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              {params.address}
            </div>
            <button
              onClick={handleCopy}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'pink' 
                  ? 'bg-white/20 hover:bg-white/30 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <Copy className="h-4 w-4" />
            </button>
            {copySuccess && (
              <span className={`text-sm ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                Copied!
              </span>
            )}
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Total Transactions */}
          <div className={`rounded-2xl p-6 shadow-lg border ${
            theme === 'pink' 
              ? 'bg-white/20 backdrop-blur-sm border-white/30' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <Activity className={`h-5 w-5 ${
                theme === 'pink' ? 'text-white' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                Total Transactions
              </h3>
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              {statsData?.addressStats?.totalTransactions || 0}
            </div>
            <div className={`text-sm mt-2 ${
              theme === 'pink' ? 'text-white/80' : 'text-gray-600'
            }`}>
              Sent: {statsData?.addressStats?.totalSentTransactions || 0} | 
              Received: {statsData?.addressStats?.totalReceivedTransactions || 0}
            </div>
          </div>

          {/* Total Volume */}
          <div className={`rounded-2xl p-6 shadow-lg border ${
            theme === 'pink' 
              ? 'bg-white/20 backdrop-blur-sm border-white/30' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className={`h-5 w-5 ${
                theme === 'pink' ? 'text-white' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                Total Volume
              </h3>
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              {statsData?.addressStats?.totalVolumeInEth ? 
                `${parseFloat(statsData.addressStats.totalVolumeInEth).toFixed(3)} ETH` : 
                '0 ETH'
              }
            </div>
            <div className={`text-sm mt-2 ${
              theme === 'pink' ? 'text-white/80' : 'text-gray-600'
            }`}>
              Gas Fees: {statsData?.addressStats?.gasFeesInEth ? 
                `${parseFloat(statsData.addressStats.gasFeesInEth).toFixed(6)} ETH` : 
                '0 ETH'
              }
            </div>
          </div>

          {/* Activity Score */}
          <div className={`rounded-2xl p-6 shadow-lg border ${
            theme === 'pink' 
              ? 'bg-white/20 backdrop-blur-sm border-white/30' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <Clock className={`h-5 w-5 ${
                theme === 'pink' ? 'text-white' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                Activity Score
              </h3>
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              {statsData?.addressStats?.activityScore || 0}
            </div>
            <div className={`text-sm mt-2 ${
              theme === 'pink' ? 'text-white/80' : 'text-gray-600'
            }`}>
              Unique counterparties: {statsData?.addressStats?.uniqueCounterparties || 0}
            </div>
          </div>

        </div>

        {/* Filters */}
        <div className={`rounded-2xl p-6 shadow-lg border mb-6 ${
          theme === 'pink' 
            ? 'bg-white/20 backdrop-blur-sm border-white/30' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="mb-4">
            <h2 className={`text-lg font-bold ${theme === 'pink' ? 'text-white' : 'text-gray-900'}`}>Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'pink' ? 'text-white/80' : 'text-gray-600'}`}>Status</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
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
                      setCurrentPage(0);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Direction Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'pink' ? 'text-white/80' : 'text-gray-600'}`}>Direction</label>
              <div className="flex flex-wrap gap-2">
                {directionOptions.map((option) => (
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
                      setCurrentPage(0);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className={`rounded-2xl p-6 shadow-lg border ${
          theme === 'pink' 
            ? 'bg-white/20 backdrop-blur-sm border-white/30' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              Transaction History
            </h3>
            {transactionsData?.transactionsByAddress?.totalCount && (
              <span className={`text-sm ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                {transactionsData.transactionsByAddress.totalCount.toLocaleString()} total transactions
              </span>
            )}
          </div>

          {transactionsLoading ? (
            <div className={`text-center py-8 ${
              theme === 'pink' ? 'text-white/80' : 'text-gray-600'
            }`}>
              Loading transactions...
            </div>
          ) : transactionsError ? (
            <div className={`text-center py-8 ${
              theme === 'pink' ? 'text-white/80' : 'text-gray-600'
            }`}>
              Error loading transactions: {transactionsError.message}
            </div>
          ) : transactionsData?.transactionsByAddress?.transactions?.length > 0 ? (
            <>
              <div className="space-y-3">
                {transactionsData.transactionsByAddress.transactions.map((tx: any) => (
                    <Link
                      key={tx.hash}
                      href={`/transactions/${tx.hash}`}
                      className={`block p-4 rounded-xl transition-colors hover:bg-white/10 ${
                        theme === 'pink' ? 'bg-white/5' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-sm ${
                            theme === 'pink' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {truncateHash(tx.hash)}
                          </span>
                          <ExternalLink className="h-3 w-3 opacity-50" />
                        </div>
                        <div className="flex items-center gap-2">
                          {tx.direction && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold min-w-[60px] inline-flex items-center justify-center ${
                              getDirectionColors(tx.direction)
                            }`}>
                              {getDirectionLabel(tx.direction)}
                            </span>
                          )}
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            getStatusColors(tx.isSuccessful)
                          }`}>
                            {tx.isSuccessful ? 'Success' : 'Failed'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Transaction details */}
                      <div className="flex items-center justify-between mb-2 text-xs">
                        <div className={`space-y-1 ${theme === 'pink' ? 'text-white/80' : 'text-gray-600'}`}>
                          <div>From: {truncateHash(tx.fromAddress)}</div>
                          <div>To: {truncateHash(tx.toAddress)}</div>
                          <div>Block #{tx.blockNumber}</div>
                        </div>
                        <div className={`text-right font-semibold ${
                          theme === 'pink' ? 'text-white' : 'text-gray-900'
                        }`}>
                          <div className="text-lg">
                            {tx.valueInEth ? `${parseFloat(tx.valueInEth).toFixed(4)} ETH` : '0 ETH'}
                          </div>
                        </div>
                      </div>
                      
                      {tx.timestampIso && (
                        <div className={`text-xs ${
                          theme === 'pink' ? 'text-white/60' : 'text-gray-500'
                        }`}>
                          {formatDate(tx.timestampIso)}
                        </div>
                      )}
                    </Link>
                ))}
              </div>

              {/* Enhanced Pagination Controls */}
              {transactionsData.transactionsByAddress.totalCount > pageSize && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className={`text-sm mb-4 ${
                    theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                  }`}>
                    Showing {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, transactionsData.transactionsByAddress.totalCount)} 
                    of {transactionsData.transactionsByAddress.totalCount} transactions
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {/* First Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(0)}
                      disabled={currentPage === 0}
                    >
                      First
                    </Button>

                    {/* Previous */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Prev
                    </Button>

                    {/* Page Numbers */}
                    {(() => {
                      const totalPages = Math.ceil(transactionsData.transactionsByAddress.totalCount / pageSize);
                      const maxVisiblePages = 5;
                      let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
                      let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
                      
                      if (endPage - startPage < maxVisiblePages - 1) {
                        startPage = Math.max(0, endPage - maxVisiblePages + 1);
                      }
                      
                      const pages = [];
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(i);
                      }
                      
                      return pages.map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "taiko" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum + 1}
                        </Button>
                      ));
                    })()}

                    {/* Next */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!transactionsData.transactionsByAddress.hasNextPage}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>

                    {/* Last Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.ceil(transactionsData.transactionsByAddress.totalCount / pageSize) - 1)}
                      disabled={!transactionsData.transactionsByAddress.hasNextPage}
                    >
                      Last
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={`text-center py-12 ${
              theme === 'pink' ? 'text-white/80' : 'text-gray-600'
            }`}>
              No transactions found for this address
            </div>
          )}
        </div>

      </div>
    </div>
  );
}