'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GET_BLOCK_BY_NUMBER } from '@/lib/graphql-queries';
import { formatTimestamp, truncateAddress } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeftIcon, ArrowRightIcon, CopyIcon, ExternalLinkIcon } from 'lucide-react';

interface BlockDetailPageProps {
  params: {
    number: string;
  };
}

export default function BlockDetailPage({ params }: BlockDetailPageProps) {
  const blockNumber = parseInt(params.number);
  
  const { data, loading, error } = useQuery(GET_BLOCK_BY_NUMBER, {
    variables: { number: blockNumber }
  });

  const block = data?.block;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !block) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Block Not Found</h1>
          <p className="text-gray-600 mb-8">The block #{params.number} could not be found.</p>
          <Button asChild>
            <Link href="/blocks">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Blocks
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/blocks">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Blocks
            </Link>
          </Button>
          
          <div className="flex items-center space-x-2">
            {blockNumber > 0 && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/blocks/${blockNumber - 1}`}>
                  <ArrowLeftIcon className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link href={`/blocks/${blockNumber + 1}`}>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="taiko-gradient-text">Block #{block.number}</span>
        </h1>
        <p className="text-gray-600">
          Block details and transactions for block number {block.number}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Block Information */}
        <Card>
          <CardHeader>
            <CardTitle>Block Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Block Number</label>
                <p className="text-lg font-semibold">{block.number}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Timestamp</label>
                <p className="text-lg">{formatTimestamp(block.timestamp)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Hash</label>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded flex-1 truncate">
                    {block.hash}
                  </p>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(block.hash)}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Parent Hash</label>
                <div className="flex items-center space-x-2">
                  <Link 
                    href={`/blocks/${blockNumber - 1}`}
                    className="text-sm font-mono bg-gray-100 p-2 rounded flex-1 truncate hover:bg-gray-200 transition-colors text-taiko-pink"
                  >
                    {block.parentHash}
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(block.parentHash)}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Miner</label>
                <div className="flex items-center space-x-2">
                  <Link 
                    href={`/address/${block.miner}`}
                    className="text-sm font-mono bg-gray-100 p-2 rounded flex-1 truncate hover:bg-gray-200 transition-colors text-taiko-pink"
                  >
                    {block.miner}
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(block.miner)}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Block Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Block Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Transactions</label>
                <div className="flex items-center space-x-2">
                  <Badge variant="taiko" className="text-lg px-3 py-1">
                    {block.transactionCount}
                  </Badge>
                  <Link href={`/blocks/${block.number}/transactions`} className="text-taiko-pink hover:text-taiko-purple">
                    <ExternalLinkIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Block Size</label>
                <p className="text-lg">{(block.size / 1024).toFixed(2)} KB</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Gas Used</label>
                <div>
                  <p className="text-lg">{block.gasUsed.toLocaleString()}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-taiko-gradient h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(block.gasUsed / block.gasLimit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {((block.gasUsed / block.gasLimit) * 100).toFixed(2)}% of {block.gasLimit.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Gas Limit</label>
                <p className="text-lg">{block.gasLimit.toLocaleString()}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Difficulty</label>
                <p className="text-lg">{block.difficulty}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Nonce</label>
                <p className="text-lg font-mono">{block.nonce}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions in Block */}
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transactions ({block.transactionCount})</CardTitle>
          <Button variant="taiko-outline" size="sm" asChild>
            <Link href={`/blocks/${block.number}/transactions`}>
              View All Transactions
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {block.transactions && block.transactions.length > 0 ? (
            <div className="space-y-2">
              {block.transactions.slice(0, 10).map((tx: any) => (
                <div key={tx.hash} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <Link href={`/transactions/${tx.hash}`} className="font-medium text-taiko-pink hover:text-taiko-purple block truncate">
                      {truncateAddress(tx.hash)}
                    </Link>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{truncateAddress(tx.from)}</span>
                      <ArrowRightIcon className="h-3 w-3" />
                      <span>{truncateAddress(tx.to)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={tx.status === 'SUCCESS' ? 'success' : tx.status === 'FAILED' ? 'error' : 'pending'}>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {block.transactionCount > 10 && (
                <div className="text-center pt-4">
                  <Button variant="taiko-outline" asChild>
                    <Link href={`/blocks/${block.number}/transactions`}>
                      View All {block.transactionCount} Transactions
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No transactions in this block
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}