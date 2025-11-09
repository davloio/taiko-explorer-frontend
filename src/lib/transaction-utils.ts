import { ArrowDownLeft, ArrowUpRight, RefreshCw, Hash, Activity } from 'lucide-react';

// Transaction direction detection
export const getTransactionDirection = (tx: any, userAddress?: string) => {
  if (!userAddress) return 'UNKNOWN';
  
  const fromAddress = tx.fromAddress?.toLowerCase() || tx.from_address?.toLowerCase();
  const toAddress = tx.toAddress?.toLowerCase() || tx.to_address?.toLowerCase();
  const user = userAddress.toLowerCase();

  if (!toAddress) return 'CONTRACT_CREATION';
  if (fromAddress === user && toAddress === user) return 'SELF';
  if (fromAddress === user) return 'OUT';
  if (toAddress === user) return 'IN';
  return 'UNKNOWN';
};

export const getDirectionIcon = (direction: string) => {
  switch (direction) {
    case 'IN': return ArrowDownLeft;
    case 'OUT': return ArrowUpRight;
    case 'SELF': return RefreshCw;
    case 'CONTRACT_CREATION': return Hash;
    default: return Activity;
  }
};

export const getDirectionLabel = (direction: string) => {
  switch (direction) {
    case 'IN': return 'IN';
    case 'OUT': return 'OUT';
    case 'SELF': return 'SELF';
    case 'CONTRACT_CREATION': return 'CREATE';
    default: return '';
  }
};

export const getDirectionColor = (direction: string) => {
  switch (direction) {
    case 'IN': return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'OUT': return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'SELF': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'CONTRACT_CREATION': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

export const getDirectionValueColor = (direction: string) => {
  switch (direction) {
    case 'IN': return 'text-green-400';
    case 'OUT': return 'text-red-400';
    case 'SELF': return 'text-blue-400';
    default: return 'text-gray-400';
  }
};

export const getDirectionValuePrefix = (direction: string) => {
  switch (direction) {
    case 'IN': return '+';
    case 'OUT': return '-';
    default: return '';
  }
};