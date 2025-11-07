'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GET_BLOCKS } from '@/lib/graphql-queries';
import { formatTimestamp, truncateAddress } from '@/lib/utils';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, BlocksIcon, Users, Activity, Clock } from 'lucide-react';

export default function BlocksPage() {
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="taiko-gradient-text">Blocks</span>
        </h1>
        <p className="text-gray-600">
          Browse all blocks on the Taiko blockchain. Each block contains transactions and is produced by miners.
        </p>
      </div>

      {/* Blocks Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BlocksIcon className="h-5 w-5 text-taiko-pink" />
              <div>
                <p className="text-sm text-gray-600">Total Blocks</p>
                <p className="text-xl font-bold">{totalBlocks.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-taiko-purple" />
              <div>
                <p className="text-sm text-gray-600">Current Page</p>
                <p className="text-xl font-bold">{currentPage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-taiko-yellow" />
              <div>
                <p className="text-sm text-gray-600">Per Page</p>
                <p className="text-xl font-bold">{blocksPerPage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-taiko-pink" />
              <div>
                <p className="text-sm text-gray-600">Total Pages</p>
                <p className="text-xl font-bold">{totalPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blocks Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: blocksPerPage }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error loading blocks: {error.message}</p>
            </div>
          ) : blocks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No blocks found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Block
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transactions
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Miner
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gas Used
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {blocks.map((block: any) => (
                      <tr key={block.number} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Link href={`/blocks/${block.number}`} className="text-taiko-pink hover:text-taiko-purple font-medium">
                            #{block.number}
                          </Link>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatTimestamp(block.timestamp)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge variant="secondary">{block.transactionCount}</Badge>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Link href={`/address/${block.miner}`} className="text-taiko-pink hover:text-taiko-purple">
                            {truncateAddress(block.miner)}
                          </Link>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {(block.size / 1024).toFixed(2)} KB
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div>
                            <p>{((block.gasUsed / block.gasLimit) * 100).toFixed(1)}%</p>
                            <p className="text-xs text-gray-400">
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
                  <Card key={block.number}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <Link href={`/blocks/${block.number}`} className="text-lg font-semibold text-taiko-pink hover:text-taiko-purple">
                          Block #{block.number}
                        </Link>
                        <Badge variant="secondary">{block.transactionCount} txs</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Age:</span>
                          <span>{formatTimestamp(block.timestamp)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Miner:</span>
                          <Link href={`/address/${block.miner}`} className="text-taiko-pink hover:text-taiko-purple">
                            {truncateAddress(block.miner)}
                          </Link>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Size:</span>
                          <span>{(block.size / 1024).toFixed(2)} KB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gas Used:</span>
                          <span>{((block.gasUsed / block.gasLimit) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-gray-500">
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
        </CardContent>
      </Card>
    </div>
  );
}