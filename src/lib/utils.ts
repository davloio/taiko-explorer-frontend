import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string, length = 8): string {
  if (!address) return '';
  if (address.length <= length) return address;
  return `${address.slice(0, length / 2)}...${address.slice(-length / 2)}`;
}

export function formatHash(hash: string, length = 16): string {
  if (!hash) return '';
  if (hash.length <= length) return hash;
  return `${hash.slice(0, length)}...`;
}

export function formatEth(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  
  if (num === 0) return '0';
  if (num < 0.0001) return '< 0.0001';
  if (num < 1) return num.toFixed(6);
  if (num < 1000) return num.toFixed(4);
  if (num < 1000000) return `${(num / 1000).toFixed(2)}K`;
  
  return `${(num / 1000000).toFixed(2)}M`;
}

export function formatGwei(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  
  return `${num.toFixed(2)} Gwei`;
}

export function formatNumber(value: number): string {
  if (value < 1000) return value.toString();
  if (value < 1000000) return `${(value / 1000).toFixed(1)}K`;
  if (value < 1000000000) return `${(value / 1000000).toFixed(1)}M`;
  return `${(value / 1000000000).toFixed(1)}B`;
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - (timestamp * 1000);
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} sec${seconds > 1 ? 's' : ''} ago`;
}

export function formatGasUsage(gasUsed: number, gasLimit: number): string {
  const percentage = (gasUsed / gasLimit) * 100;
  return `${percentage.toFixed(1)}%`;
}

export function getTransactionStatus(status: number): {
  label: string;
  color: 'success' | 'error' | 'pending';
} {
  switch (status) {
    case 1:
      return { label: 'Success', color: 'success' };
    case 0:
      return { label: 'Failed', color: 'error' };
    default:
      return { label: 'Pending', color: 'pending' };
  }
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

export function isValidBlockNumber(blockNumber: string): boolean {
  return /^\d+$/.test(blockNumber);
}

export function truncateAddress(address: string, startLength = 6, endLength = 4): string {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

export function formatEther(value: string | number | bigint): string {
  let num: number;
  
  if (typeof value === 'bigint') {
    num = Number(value) / Math.pow(10, 18);
  } else if (typeof value === 'string') {
    num = parseFloat(value) / Math.pow(10, 18);
  } else {
    num = value / Math.pow(10, 18);
  }
  
  if (isNaN(num)) return '0';
  if (num === 0) return '0';
  if (num < 0.0001) return '< 0.0001';
  if (num < 1) return num.toFixed(6);
  if (num < 1000) return num.toFixed(4);
  return num.toFixed(2);
}