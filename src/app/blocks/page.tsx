'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { GET_BLOCKS } from '@/lib/graphql-queries';
import { formatTimestamp, truncateAddress } from '@/lib/utils';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, BlocksIcon, Users, Activity, Clock } from 'lucide-react';

export default function BlocksPage() {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const blocksPerPage = 20;

  const { data, loading, error } = useQuery(GET_BLOCKS, {
    variables: {
      limit: blocksPerPage * currentPage // Get all blocks up to current page
    }
  });

  const allBlocks = data?.blocks?.blocks || [];
  const totalBlocks = data?.blocks?.totalCount || 0;
  const totalPages = Math.ceil(totalBlocks / blocksPerPage);
  
  // Get blocks for current page (slice the array for pagination)
  const startIndex = (currentPage - 1) * blocksPerPage;
  const endIndex = startIndex + blocksPerPage;
  const blocks = allBlocks.slice(startIndex, endIndex);

  return (
    <div className={theme === 'pink' ? 'min-h-screen bg-[#C2185B]' : 'min-h-screen bg-gray-50'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
          theme === 'pink' ? 'text-white' : 'text-gray-900'
        }`}>
          Blocks
        </h1>
        <p className={theme === 'pink' ? 'text-white/80' : 'text-gray-600'}>
          Browse all blocks on the Taiko blockchain. Each block contains transactions and is produced by miners.
        </p>
      </div>

      {/* Blocks Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className={`rounded-2xl p-6 shadow-lg border ${
          theme === 'pink' 
            ? 'bg-white/20 backdrop-blur-sm border-white/30' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <BlocksIcon className={`h-5 w-5 ${
              theme === 'pink' ? 'text-white' : 'text-gray-600'
            }`} />
            <div>
              <p className={`text-sm ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>Total Blocks</p>
              <p className={`text-xl font-bold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>{totalBlocks.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 shadow-lg border ${
          theme === 'pink' 
            ? 'bg-white/20 backdrop-blur-sm border-white/30' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <Activity className={`h-5 w-5 ${
              theme === 'pink' ? 'text-white' : 'text-gray-600'
            }`} />
            <div>
              <p className={`text-sm ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>Current Page</p>
              <p className={`text-xl font-bold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>{currentPage}</p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 shadow-lg border ${
          theme === 'pink' 
            ? 'bg-white/20 backdrop-blur-sm border-white/30' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <Users className={`h-5 w-5 ${
              theme === 'pink' ? 'text-white' : 'text-gray-600'
            }`} />
            <div>
              <p className={`text-sm ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>Per Page</p>
              <p className={`text-xl font-bold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>{blocksPerPage}</p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 shadow-lg border ${
          theme === 'pink' 
            ? 'bg-white/20 backdrop-blur-sm border-white/30' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <Clock className={`h-5 w-5 ${
              theme === 'pink' ? 'text-white' : 'text-gray-600'
            }`} />
            <div>
              <p className={`text-sm ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>Total Pages</p>
              <p className={`text-xl font-bold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>{totalPages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blocks Table */}
      <div className={`rounded-2xl p-6 shadow-lg border ${
        theme === 'pink' 
          ? 'bg-white/20 backdrop-blur-sm border-white/30' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="mb-6">
          <h2 className={`text-lg font-bold ${
            theme === 'pink' ? 'text-white' : 'text-gray-900'
          }`}>All Blocks</h2>
        </div>
        <div>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: blocksPerPage }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-white/30 rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 bg-white/20 rounded w-20 animate-pulse"></div>
                    <div className="h-3 bg-white/20 rounded w-32 animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-white/20 rounded w-16 animate-pulse"></div>
                    <div className="h-3 bg-white/20 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className={`${
                theme === 'pink' ? 'text-red-300' : 'text-red-600'
              }`}>Error loading blocks: {error.message}</p>
            </div>
          ) : blocks.length === 0 ? (
            <div className="text-center py-8">
              <p className={`${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>No blocks found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className={`${
                    theme === 'pink' ? 'bg-white/10' : 'bg-gray-50'
                  }`}>
                    <tr>
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
                        Transactions
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        Miner
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        Size
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        Gas Used
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`bg-transparent divide-y ${
                    theme === 'pink' ? 'divide-white/20' : 'divide-gray-200'
                  }`}>
                    {blocks.map((block: any) => (
                      <tr key={block.number} className={`${
                        theme === 'pink' ? 'hover:bg-white/10' : 'hover:bg-gray-50'
                      }`}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Link href={`/blocks/${block.number}`} className={`font-medium ${
                            theme === 'pink' ? 'text-white hover:text-white/80' : 'text-gray-900 hover:text-gray-700'
                          }`}>
                            #{block.number}
                          </Link>
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm ${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>
                          {formatTimestamp(block.timestamp)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-sm ${
                            theme === 'pink' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-900'
                          }`}>{block.transactionCount}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Link href={`/address/${block.miner}`} className={`${
                            theme === 'pink' ? 'text-white hover:text-white/80' : 'text-gray-900 hover:text-gray-700'
                          }`}>
                            {truncateAddress(block.miner)}
                          </Link>
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm ${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>
                          {(block.size / 1024).toFixed(2)} KB
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm ${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>
                          <div>
                            <p>{((block.gasUsed / block.gasLimit) * 100).toFixed(1)}%</p>
                            <p className={`text-xs ${
                              theme === 'pink' ? 'text-white/60' : 'text-gray-500'
                            }`}>
                              {block.gasUsed.toLocaleString()} / {block.gasLimit.toLocaleString()}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {blocks.map((block: any) => (
                  <div key={block.number} className={`rounded-2xl p-4 shadow-lg border ${
                    theme === 'pink' 
                      ? 'bg-white/20 backdrop-blur-sm border-white/30' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <Link href={`/blocks/${block.number}`} className={`text-lg font-semibold ${
                        theme === 'pink' ? 'text-white hover:text-white/80' : 'text-gray-900 hover:text-gray-700'
                      }`}>
                        Block #{block.number}
                      </Link>
                      <span className={`px-2 py-1 rounded text-sm ${
                        theme === 'pink' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-900'
                      }`}>{block.transactionCount} txs</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={`${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>Age:</span>
                        <span className={`${
                          theme === 'pink' ? 'text-white' : 'text-gray-900'
                        }`}>{formatTimestamp(block.timestamp)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>Miner:</span>
                        <Link href={`/address/${block.miner}`} className={`${
                          theme === 'pink' ? 'text-white hover:text-white/80' : 'text-gray-900 hover:text-gray-700'
                        }`}>
                          {truncateAddress(block.miner)}
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>Size:</span>
                        <span className={`${
                          theme === 'pink' ? 'text-white' : 'text-gray-900'
                        }`}>{(block.size / 1024).toFixed(2)} KB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${
                          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                        }`}>Gas Used:</span>
                        <span className={`${
                          theme === 'pink' ? 'text-white' : 'text-gray-900'
                        }`}>{((block.gasUsed / block.gasLimit) * 100).toFixed(1)}%</span>
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
                Showing {((currentPage - 1) * blocksPerPage) + 1} to {Math.min(currentPage * blocksPerPage, totalBlocks)} of {totalBlocks} blocks
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