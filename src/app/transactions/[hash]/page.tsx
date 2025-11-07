'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GET_TRANSACTION_BY_HASH } from '@/lib/graphql-queries';
import { formatEther, formatTimestamp, truncateAddress } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeftIcon, CopyIcon, ExternalLinkIcon, ArrowRightIcon } from 'lucide-react';

interface TransactionDetailPageProps {
  params: {
    hash: string;
  };
}

export default function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  const { data, loading, error } = useQuery(GET_TRANSACTION_BY_HASH, {
    variables: { hash: params.hash }
  });

  const transaction = data?.transaction;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Transaction Not Found</h1>
          <p className="text-gray-600 mb-8">The transaction {params.hash} could not be found.</p>
          <Button asChild>
            <Link href="/transactions">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Transactions
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
            <Link href="/transactions">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Transactions
            </Link>
          </Button>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="taiko-gradient-text">Transaction Details</span>
        </h1>
        <p className="text-gray-600 break-all">
          {transaction.hash}
        </p>
      </div>

      {/* Status Badge */}
      <div className="mb-8">
        <Badge 
          variant={transaction.status === 'SUCCESS' ? 'success' : transaction.status === 'FAILED' ? 'error' : 'pending'}
          className="text-lg px-4 py-2"
        >
          {transaction.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transaction Information */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Transaction Hash</label>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-mono bg-gray-100 p-2 rounded flex-1 break-all">
                  {transaction.hash}
                </p>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(transaction.hash)}
                >
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <div className="mt-1">
                <Badge variant={transaction.status === 'SUCCESS' ? 'success' : transaction.status === 'FAILED' ? 'error' : 'pending'}>
                  {transaction.status}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Block Number</label>
              <div className="flex items-center space-x-2">
                <Link 
                  href={`/blocks/${transaction.blockNumber}`}
                  className="text-lg font-semibold text-taiko-pink hover:text-taiko-purple"
                >
                  #{transaction.blockNumber}
                </Link>
                <Link href={`/blocks/${transaction.blockNumber}`}>
                  <ExternalLinkIcon className="h-4 w-4 text-taiko-pink" />
                </Link>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Transaction Index</label>
              <p className="text-lg">{transaction.transactionIndex}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Timestamp</label>
              <p className="text-lg">{formatTimestamp(transaction.timestamp)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Nonce</label>
              <p className="text-lg font-mono">{transaction.nonce}</p>
            </div>
          </CardContent>
        </Card>

        {/* From/To Information */}
        <Card>
          <CardHeader>
            <CardTitle>From / To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">From</label>
              <div className="flex items-center space-x-2">
                <Link 
                  href={`/address/${transaction.from}`}
                  className="text-sm font-mono bg-gray-100 p-2 rounded flex-1 truncate hover:bg-gray-200 transition-colors text-taiko-pink"
                >
                  {transaction.from}
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(transaction.from)}
                >
                  <CopyIcon className="h-4 w-4" />
                </Button>
                <Link href={`/address/${transaction.from}`}>
                  <ExternalLinkIcon className="h-4 w-4 text-taiko-pink" />
                </Link>
              </div>
            </div>
            
            <div className="flex justify-center">
              <ArrowRightIcon className="h-6 w-6 text-gray-400" />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">To</label>
              <div className="flex items-center space-x-2">
                <Link 
                  href={`/address/${transaction.to}`}
                  className="text-sm font-mono bg-gray-100 p-2 rounded flex-1 truncate hover:bg-gray-200 transition-colors text-taiko-pink"
                >
                  {transaction.to}
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(transaction.to)}
                >
                  <CopyIcon className="h-4 w-4" />
                </Button>
                <Link href={`/address/${transaction.to}`}>
                  <ExternalLinkIcon className="h-4 w-4 text-taiko-pink" />
                </Link>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Value</label>
              <p className="text-2xl font-bold taiko-gradient-text">
                {formatEther(transaction.value)} ETH
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gas and Fee Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Gas and Fee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Gas Used</label>
              <p className="text-lg font-semibold">{transaction.gasUsed.toLocaleString()}</p>
              <p className="text-sm text-gray-500">
                {((transaction.gasUsed / transaction.gas) * 100).toFixed(2)}% of limit
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Gas Limit</label>
              <p className="text-lg font-semibold">{transaction.gas.toLocaleString()}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Gas Price</label>
              <p className="text-lg font-semibold">{transaction.gasPrice.toLocaleString()} Wei</p>
              <p className="text-sm text-gray-500">
                {formatEther(transaction.gasPrice)} ETH
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Transaction Fee</label>
              <p className="text-lg font-semibold text-taiko-pink">
                {formatEther(transaction.gasPrice * transaction.gasUsed)} ETH
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-600 block mb-2">Gas Usage Progress</label>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-taiko-gradient h-3 rounded-full transition-all duration-300"
                style={{ width: `${(transaction.gasUsed / transaction.gas) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Details */}
      {(transaction.input && transaction.input !== '0x') && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Input Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm font-mono break-all">{transaction.input}</p>
            </div>
            <div className="flex justify-end mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(transaction.input)}
              >
                <CopyIcon className="h-4 w-4 mr-2" />
                Copy Input Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Receipt Information */}
      {transaction.logs && transaction.logs.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Event Logs ({transaction.logs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transaction.logs.map((log: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-600">Log {index}</span>
                    <Badge variant="secondary">{log.topics.length} topics</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Address:</span>
                      <Link href={`/address/${log.address}`} className="ml-2 text-taiko-pink hover:text-taiko-purple font-mono">
                        {truncateAddress(log.address)}
                      </Link>
                    </div>
                    <div>
                      <span className="font-medium">Data:</span>
                      <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                        {log.data}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}