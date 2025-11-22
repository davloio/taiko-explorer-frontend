'use client';

import { useQuery } from '@apollo/client';
import { useTheme } from '@/contexts/ThemeContext';
import { GET_TRANSACTION_BY_HASH } from '@/lib/graphql-queries';
import Link from 'next/link';
import { ArrowLeft, Hash, Clock, Activity, CheckCircle, XCircle, Copy } from 'lucide-react';
import { useState } from 'react';

interface TransactionDetailPageProps {
  params: {
    hash: string;
  };
}

export default function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  const { theme } = useTheme();
  const [copySuccess, setCopySuccess] = useState(false);
  
  const { data, loading, error } = useQuery(GET_TRANSACTION_BY_HASH, {
    variables: { hash: params.hash }
  });

  const transaction = data?.transaction;

  const handleCopy = async (text: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-HTTPS or older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const formatValue = (value: string) => {
    const eth = parseFloat(value) / 1e18;
    if (eth === 0) return '0 ETH';
    if (eth < 0.001) return '<0.001 ETH';
    return `${eth.toFixed(6)} ETH`;
  };

  if (loading) {
    return (
      <div className={theme === 'pink' ? 'min-h-screen bg-[#C2185B]' : 'min-h-screen bg-gray-50'}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`text-center py-20 ${
            theme === 'pink' ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto mb-4"></div>
            Loading transaction details...
          </div>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className={theme === 'pink' ? 'min-h-screen bg-[#C2185B]' : 'min-h-screen bg-gray-50'}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`text-center py-20 ${
            theme === 'pink' ? 'text-white' : 'text-gray-900'
          }`}>
            <h1 className="text-2xl font-bold mb-4">Transaction Not Found</h1>
            <p>Could not load transaction: {params.hash}</p>
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
            href="/transactions"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              theme === 'pink' 
                ? 'bg-white/20 text-white hover:bg-white/30' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </Link>
        </div>

        {/* Transaction Header */}
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
              Transaction Details
            </h1>
            {transaction.isSuccessful ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <label className={`text-sm font-medium ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                Transaction Hash
              </label>
              <div className="flex items-center gap-3">
                <div className={`font-mono text-sm break-all ${
                  theme === 'pink' ? 'text-white' : 'text-gray-900'
                }`}>
                  {transaction.hash}
                </div>
                <button
                  onClick={() => handleCopy(transaction.hash)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'pink' 
                      ? 'bg-white/20 hover:bg-white/30 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              {copySuccess && (
                <span className={`text-xs ${
                  theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  Copied!
                </span>
              )}
            </div>

            <div>
              <label className={`text-sm font-medium ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                Status
              </label>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                transaction.isSuccessful
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {transaction.isSuccessful ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Success
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Failed
                  </>
                )}
              </span>
            </div>

            <div>
              <label className={`text-sm font-medium ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                Direction
              </label>
              <span className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full text-sm font-semibold min-w-[80px] bg-blue-500/20 text-blue-300`}>
                {transaction.direction?.toUpperCase() === 'IN' ? 'in' : transaction.direction?.toUpperCase() === 'OUT' ? 'out' : (transaction.direction?.toUpperCase() === 'INSIDE' || transaction.direction?.toUpperCase() === 'INTERNAL') ? 'internal' : transaction.direction?.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Transaction Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Block Info */}
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
                Block Information
              </h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className={`text-sm font-medium ${
                  theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  Block Number
                </label>
                <Link
                  href={`/blocks/${transaction.blockNumber}`}
                  className={`block text-lg font-bold hover:underline ${
                    theme === 'pink' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  #{transaction.blockNumber}
                </Link>
              </div>
              
              <div>
                <label className={`text-sm font-medium ${
                  theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  Transaction Index
                </label>
                <p className={`text-lg font-bold ${
                  theme === 'pink' ? 'text-white' : 'text-gray-900'
                }`}>
                  {transaction.transactionIndex || 'N/A'}
                </p>
              </div>

              <div>
                <label className={`text-sm font-medium ${
                  theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  Timestamp
                </label>
                <p className={`text-lg font-bold ${
                  theme === 'pink' ? 'text-white' : 'text-gray-900'
                }`}>
                  {transaction.timestamp ? formatDate(transaction.timestamp) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Transfer Info */}
          <div className={`rounded-2xl p-6 shadow-lg border ${
            theme === 'pink' 
              ? 'bg-white/20 backdrop-blur-sm border-white/30' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <Hash className={`h-5 w-5 ${
                theme === 'pink' ? 'text-white' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                Transfer Information
              </h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className={`text-sm font-medium ${
                  theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  From Address
                </label>
                <Link
                  href={`/addresses/${transaction.fromAddress}`}
                  className={`block font-mono text-sm hover:underline ${
                    theme === 'pink' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {truncateHash(transaction.fromAddress)}
                </Link>
              </div>
              
              <div>
                <label className={`text-sm font-medium ${
                  theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  To Address
                </label>
                <Link
                  href={`/addresses/${transaction.toAddress}`}
                  className={`block font-mono text-sm hover:underline ${
                    theme === 'pink' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {truncateHash(transaction.toAddress)}
                </Link>
              </div>

              <div>
                <label className={`text-sm font-medium ${
                  theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  Value
                </label>
                <p className={`text-2xl font-bold ${
                  theme === 'pink' ? 'text-white' : 'text-gray-900'
                }`}>
                  {transaction.valueInEth ? `${parseFloat(transaction.valueInEth).toFixed(6)} ETH` : '0 ETH'}
                </p>
                <p className={`text-sm ${
                  theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  {transaction.value ? `${transaction.value} Wei` : '0 Wei'}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Gas and Fees */}
        <div className={`rounded-2xl p-6 shadow-lg border ${
          theme === 'pink' 
            ? 'bg-white/20 backdrop-blur-sm border-white/30' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-xl font-bold mb-6 ${
            theme === 'pink' ? 'text-white' : 'text-gray-900'
          }`}>
            Gas and Fee Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div>
              <label className={`text-sm font-medium ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                Gas Used
              </label>
              <p className={`text-lg font-semibold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                {transaction.gasUsed?.toLocaleString() || 'N/A'}
              </p>
              <div className={`text-sm mt-2 ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                {(transaction.gasLimit && transaction.gasUsed) ? 
                  `${((transaction.gasUsed / transaction.gasLimit) * 100).toFixed(2)}% of limit` : 
                  'Percentage unknown'
                }
              </div>
              
              {transaction.gasUsed && transaction.gasLimit && (
                <div className="mt-3">
                  <div className={`w-full h-2 rounded-full ${
                    theme === 'pink' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    <div
                      className={`h-2 rounded-full ${
                        theme === 'pink' ? 'bg-white' : 'bg-[#C2185B]'
                      }`}
                      style={{ 
                        width: `${Math.min((transaction.gasUsed / transaction.gasLimit) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className={`text-sm font-medium ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                Gas Limit
              </label>
              <p className={`text-lg font-semibold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                {transaction.gasLimit?.toLocaleString() || 'N/A'}
              </p>
            </div>

            <div>
              <label className={`text-sm font-medium ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                Gas Price
              </label>
              <p className={`text-lg font-semibold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                {transaction.gasPrice?.toLocaleString() || 'N/A'} Wei
              </p>
            </div>

            <div>
              <label className={`text-sm font-medium ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                Transaction Fee
              </label>
              <p className={`text-lg font-semibold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                {transaction.transactionFeeInEth ? 
                  `${parseFloat(transaction.transactionFeeInEth).toFixed(8)} ETH` : 
                  'N/A'
                }
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}