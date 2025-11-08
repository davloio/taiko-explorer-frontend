'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GET_TRANSACTIONS } from '@/lib/graphql-queries';
import { formatEther, formatTimestamp, truncateAddress } from '@/lib/utils';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon, Activity, Clock, DollarSignIcon, Users } from 'lucide-react';

export default function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const transactionsPerPage = 50;

  const { data, loading, error } = useQuery(GET_TRANSACTIONS, {
    variables: {
      limit: transactionsPerPage,
      offset: (currentPage - 1) * transactionsPerPage
    }
  });

  const transactions = data?.transactions?.transactions || [];
  const totalTransactions = data?.transactions?.totalCount || 0;
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);

  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'SUCCESS', label: 'Success' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'PENDING', label: 'Pending' }
  ];

  return (
    <div className="min-h-screen bg-white taiko-mode:!bg-[#C2185B]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="taiko-gradient-text">Transactions</span>
        </h1>
        <p className="text-gray-600">
          Browse all transactions on the Taiko blockchain. Filter by status and explore transaction details.
        </p>
      </div>

      {/* Transaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-taiko-pink" />
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-xl font-bold">{totalTransactions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-taiko-purple" />
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
                <p className="text-xl font-bold">{transactionsPerPage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSignIcon className="h-5 w-5 text-taiko-pink" />
              <div>
                <p className="text-sm text-gray-600">Filter</p>
                <p className="text-xl font-bold">{statusFilter === 'ALL' ? 'All' : statusFilter}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={statusFilter === option.value ? "taiko" : "outline"}
                size="sm"
                onClick={() => {
                  setStatusFilter(option.value);
                  setCurrentPage(1);
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: transactionsPerPage }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error loading transactions: {error.message}</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Hash
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Block
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        To
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gas Fee
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((tx: any) => (
                      <tr key={tx.hash} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Link href={`/transactions/${tx.hash}`} className="text-taiko-pink hover:text-taiko-purple font-medium">
                            {truncateAddress(tx.hash)}
                          </Link>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Link href={`/blocks/${tx.blockNumber}`} className="text-taiko-pink hover:text-taiko-purple">
                            {tx.blockNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatTimestamp(tx.timestamp)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Link href={`/address/${tx.fromAddress}`} className="text-taiko-pink hover:text-taiko-purple">
                            {truncateAddress(tx.fromAddress)}
                          </Link>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Link href={`/address/${tx.toAddress}`} className="text-taiko-pink hover:text-taiko-purple">
                            {truncateAddress(tx.toAddress)}
                          </Link>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {tx.valueInEth || '0'} ETH
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatEther(tx.gasPrice * tx.gasUsed)} ETH
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge variant={tx.status === 1 ? 'success' : tx.status === 0 ? 'error' : 'pending'}>
                            {tx.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {transactions.map((tx: any) => (
                  <Card key={tx.hash}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <Link href={`/transactions/${tx.hash}`} className="text-lg font-semibold text-taiko-pink hover:text-taiko-purple">
                          {truncateAddress(tx.hash)}
                        </Link>
                        <Badge variant={tx.status === 1 ? 'success' : tx.status === 0 ? 'error' : 'pending'}>
                          {tx.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Block:</span>
                          <Link href={`/blocks/${tx.blockNumber}`} className="text-taiko-pink hover:text-taiko-purple">
                            #{tx.blockNumber}
                          </Link>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Age:</span>
                          <span>{formatTimestamp(tx.timestamp)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">From:</span>
                          <Link href={`/address/${tx.fromAddress}`} className="text-taiko-pink hover:text-taiko-purple">
                            {truncateAddress(tx.fromAddress)}
                          </Link>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">To:</span>
                          <Link href={`/address/${tx.toAddress}`} className="text-taiko-pink hover:text-taiko-purple">
                            {truncateAddress(tx.toAddress)}
                          </Link>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Value:</span>
                          <span className="font-medium">{tx.valueInEth || '0'} ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gas Fee:</span>
                          <span>{formatEther(tx.gasPrice * tx.gasUsed)} ETH</span>
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
        </CardContent>
      </Card>
      </div>
    </div>
  );
}