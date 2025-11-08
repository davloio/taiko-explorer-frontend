'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GET_BLOCK_BY_NUMBER, GET_TRANSACTION_BY_HASH } from '@/lib/graphql-queries';
import { formatEther, formatTimestamp, truncateAddress, isValidAddress, isValidTxHash } from '@/lib/utils';
import Link from 'next/link';
import { SearchIcon, ArrowRightIcon, AlertCircleIcon } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [searchType, setSearchType] = useState<'unknown' | 'block' | 'transaction' | 'address' | 'invalid'>('unknown');
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      determineSearchType(query);
    }
  }, [query]);

  const determineSearchType = (searchValue: string) => {
    const trimmed = searchValue.trim();
    
    if (!trimmed) {
      setSearchType('unknown');
      return;
    }

    // Check if it's a block number (numeric)
    if (/^\d+$/.test(trimmed)) {
      setSearchType('block');
      return;
    }

    // Check if it's a transaction hash (0x followed by 64 hex chars)
    if (isValidTxHash(trimmed)) {
      setSearchType('transaction');
      return;
    }

    // Check if it's an address (0x followed by 40 hex chars)
    if (isValidAddress(trimmed)) {
      setSearchType('address');
      return;
    }

    setSearchType('invalid');
  };

  const { data: blockData, loading: blockLoading, error: blockError } = useQuery(GET_BLOCK_BY_NUMBER, {
    variables: { number: parseInt(searchQuery) },
    skip: searchType !== 'block' || !searchQuery
  });

  const { data: txData, loading: txLoading, error: txError } = useQuery(GET_TRANSACTION_BY_HASH, {
    variables: { hash: searchQuery },
    skip: searchType !== 'transaction' || !searchQuery
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const newUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      window.history.pushState({}, '', newUrl);
      determineSearchType(searchQuery.trim());
    }
  };

  const renderSearchResults = () => {
    if (!searchQuery) {
      return (
        <div className="text-center py-12">
          <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search the Taiko Blockchain</h3>
          <p className="text-gray-600">
            Enter a block number, transaction hash, or address to get started.
          </p>
        </div>
      );
    }

    switch (searchType) {
      case 'block':
        if (blockLoading) {
          return (
            <Card>
              <CardContent className="p-8">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }

        if (blockError || !blockData?.block) {
          return (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Block Not Found</h3>
                <p className="text-gray-600">
                  No block found with number #{searchQuery}
                </p>
              </CardContent>
            </Card>
          );
        }

        const block = blockData.block;
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Block #{block.number}</span>
                <Button asChild>
                  <Link href={`/blocks/${block.number}`}>
                    View Details
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Transactions</label>
                  <p className="text-lg font-semibold">{block.transactionCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Timestamp</label>
                  <p className="text-lg">{formatTimestamp(block.timestamp)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Miner</label>
                  <Link href={`/address/${block.miner}`} className="text-taiko-pink hover:text-taiko-purple">
                    {truncateAddress(block.miner)}
                  </Link>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Gas Used</label>
                  <p className="text-lg">{((block.gasUsed / block.gasLimit) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'transaction':
        if (txLoading) {
          return (
            <Card>
              <CardContent className="p-8">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }

        if (txError || !txData?.transaction) {
          return (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction Not Found</h3>
                <p className="text-gray-600 break-all">
                  No transaction found with hash {searchQuery}
                </p>
              </CardContent>
            </Card>
          );
        }

        const transaction = txData.transaction;
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Transaction</span>
                <div className="flex items-center space-x-2">
                  <Badge variant={transaction.status === 'SUCCESS' ? 'success' : transaction.status === 'FAILED' ? 'error' : 'pending'}>
                    {transaction.status}
                  </Badge>
                  <Button asChild>
                    <Link href={`/transactions/${transaction.hash}`}>
                      View Details
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Hash</label>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">
                    {transaction.hash}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">From</label>
                    <Link href={`/address/${transaction.from}`} className="block text-taiko-pink hover:text-taiko-purple">
                      {truncateAddress(transaction.from)}
                    </Link>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">To</label>
                    <Link href={`/address/${transaction.to}`} className="block text-taiko-pink hover:text-taiko-purple">
                      {truncateAddress(transaction.to)}
                    </Link>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Value</label>
                    <p className="text-lg font-semibold">{formatEther(transaction.value)} ETH</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Block</label>
                    <Link href={`/blocks/${transaction.blockNumber}`} className="text-taiko-pink hover:text-taiko-purple">
                      #{transaction.blockNumber}
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'address':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Address</span>
                <Button asChild>
                  <Link href={`/address/${searchQuery}`}>
                    View Details
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">
                  {searchQuery}
                </p>
              </div>
              <p className="text-gray-600 mt-4">
                Click "View Details" to see transaction history and balance information.
              </p>
            </CardContent>
          </Card>
        );

      case 'invalid':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircleIcon className="h-12 w-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Search Query</h3>
              <p className="text-gray-600 mb-4">
                Please enter a valid block number, transaction hash, or address.
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>• Block number: e.g., 123456</p>
                <p>• Transaction hash: e.g., 0x1234...abcd (66 characters)</p>
                <p>• Address: e.g., 0x1234...abcd (42 characters)</p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white taiko-mode:!bg-[#C2185B]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="taiko-gradient-text">Search</span>
        </h1>
        <p className="text-gray-600">
          Search for blocks, transactions, and addresses on the Taiko blockchain.
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by block number, transaction hash, or address..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taiko-pink focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" variant="taiko">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div>
        {renderSearchResults()}
      </div>
      </div>
    </div>
  );
}