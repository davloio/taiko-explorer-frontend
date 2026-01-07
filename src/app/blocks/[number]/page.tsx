'use client';

import { useQuery } from '@apollo/client';
import { useTheme } from '@/contexts/ThemeContext';
import { GET_BLOCK_BY_NUMBER } from '@/lib/graphql-queries';
import Link from 'next/link';
import { ArrowLeft, Hash, Clock, Activity, Users, Copy } from 'lucide-react';
import { useState } from 'react';

interface BlockDetailPageProps {
  params: {
    number: string;
  };
}

export default function BlockDetailPage({ params }: BlockDetailPageProps) {
  const { theme } = useTheme();
  const [copySuccess, setCopySuccess] = useState(false);
  const blockNumber = parseInt(params.number);
  
  const { data, loading, error } = useQuery(GET_BLOCK_BY_NUMBER, {
    variables: { blockNumber: blockNumber }
  });

  const block = data?.block;

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

  const truncateHash = (hash: string | null | undefined) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  if (loading) {
    return (
      <div className={theme === 'pink' ? 'min-h-screen bg-gradient-to-br from-[#C2185B] to-pink-500 relative overflow-hidden transition-colors duration-500' : 'min-h-screen bg-gradient-to-br from-white to-pink-100 relative overflow-hidden transition-colors duration-500'}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`text-center py-20 ${
            theme === 'pink' ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto mb-4"></div>
            Loading block details...
          </div>
        </div>
      </div>
    );
  }

  if (error || !block) {
    return (
      <div className={theme === 'pink' ? 'min-h-screen bg-gradient-to-br from-[#C2185B] to-pink-500 relative overflow-hidden transition-colors duration-500' : 'min-h-screen bg-gradient-to-br from-white to-pink-100 relative overflow-hidden transition-colors duration-500'}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`text-center py-20 ${
            theme === 'pink' ? 'text-white' : 'text-gray-900'
          }`}>
            <h1 className="text-2xl font-bold mb-4">Block Not Found</h1>
            <p>Could not load block #{blockNumber}</p>
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
            href="/blocks"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              theme === 'pink' 
                ? 'bg-white/20 text-white hover:bg-white/30' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blocks
          </Link>
          
          {/* Navigation */}
          <div className="flex gap-2">
            {blockNumber > 0 && (
              <Link
                href={`/blocks/${blockNumber - 1}`}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  theme === 'pink' 
                    ? 'bg-white/20 text-white hover:bg-white/30' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                ← Previous
              </Link>
            )}
            <Link
              href={`/blocks/${blockNumber + 1}`}
              className={`px-3 py-2 rounded-lg transition-colors ${
                theme === 'pink' 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Next →
            </Link>
          </div>
        </div>

        {/* Block Header */}
        <div className={`rounded-3xl p-6 shadow-sm border mb-8 ${
          theme === 'pink'
            ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-2xl border-white/40'
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <Hash className={`h-6 w-6 ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`} />
            <h1 className={`text-2xl font-bold ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              Block #{block.number}
            </h1>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className={`text-sm font-medium ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                Block Hash
              </label>
              <div className="flex items-center gap-3">
                <div className={`font-mono text-sm break-all ${
                  theme === 'pink' ? 'text-white' : 'text-gray-900'
                }`}>
                  {block.hash}
                </div>
                <button
                  onClick={() => handleCopy(block.hash)}
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
                Parent Hash
              </label>
              <div className={`font-mono text-sm ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                {block.parentHash ? truncateHash(block.parentHash) : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Timestamp */}
          <div className={`rounded-3xl p-6 shadow-sm border ${
            theme === 'pink'
              ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-2xl border-white/40'
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <Clock className={`h-5 w-5 ${
                theme === 'pink' ? 'text-white' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                Timestamp
              </h3>
            </div>
            <div className={`text-lg font-bold ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              {formatDate(block.timestamp)}
            </div>
          </div>

          {/* Transactions */}
          <div className={`rounded-3xl p-6 shadow-sm border ${
            theme === 'pink'
              ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-2xl border-white/40'
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <Activity className={`h-5 w-5 ${
                theme === 'pink' ? 'text-white' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                Transactions
              </h3>
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              {block.transactionCount || 0}
            </div>
          </div>

          {/* Gas Used */}
          <div className={`rounded-3xl p-6 shadow-sm border ${
            theme === 'pink'
              ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-2xl border-white/40'
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <Users className={`h-5 w-5 ${
                theme === 'pink' ? 'text-white' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                Gas Used
              </h3>
            </div>
            <div className={`text-lg font-bold ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              {block.gasUsed?.toLocaleString() || 'N/A'}
            </div>
            <div className={`text-sm mt-2 ${
              theme === 'pink' ? 'text-white/80' : 'text-gray-600'
            }`}>
              Limit: {block.gasLimit?.toLocaleString() || 'N/A'}
            </div>
            
            {block.gasUsed && block.gasLimit && (
              <div className="mt-3">
                <div className={`w-full h-2 rounded-full ${
                  theme === 'pink' ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  <div
                    className={`h-2 rounded-full ${
                      theme === 'pink' ? 'bg-white' : 'bg-[#C2185B]'
                    }`}
                    style={{ 
                      width: `${Math.min((block.gasUsed / block.gasLimit) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <div className={`text-xs mt-1 ${
                  theme === 'pink' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  {((block.gasUsed / block.gasLimit) * 100).toFixed(1)}% used
                </div>
              </div>
            )}
          </div>

          {/* Miner */}
          <div className={`rounded-3xl p-6 shadow-sm border ${
            theme === 'pink'
              ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-2xl border-white/40'
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <Hash className={`h-5 w-5 ${
                theme === 'pink' ? 'text-white' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                Miner
              </h3>
            </div>
            <Link
              href={`/addresses/${block.miner}`}
              className={`font-mono text-sm hover:underline ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {truncateHash(block.miner)}
            </Link>
          </div>

        </div>

        {/* Additional Details */}
        <div className={`rounded-3xl p-6 shadow-sm border ${
          theme === 'pink'
            ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-2xl border-white/40'
            : 'bg-white border-gray-100'
        }`}>
          <h3 className={`text-xl font-bold mb-6 ${
            theme === 'pink' ? 'text-white' : 'text-gray-900'
          }`}>
            Additional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`text-sm font-medium ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                Block Size
              </label>
              <p className={`text-lg font-semibold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                {block.size ? `${block.size.toLocaleString()} bytes` : 'N/A'}
              </p>
            </div>

            <div>
              <label className={`text-sm font-medium ${
                theme === 'pink' ? 'text-white/80' : 'text-gray-600'
              }`}>
                Block Number
              </label>
              <p className={`text-lg font-semibold ${
                theme === 'pink' ? 'text-white' : 'text-gray-900'
              }`}>
                {block.number}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}