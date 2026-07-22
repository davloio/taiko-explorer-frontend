'use client';

import { useEffect, useRef, useState } from 'react';
import { appendLiveBlock, getStats } from '@/lib/mock-data';

export interface BlockData {
  number: number;
  hash: string;
  timestamp: number;
  transaction_count: number;
  gas_used: string;
  gas_limit: string;
  miner: string;
}

export interface TransactionData {
  id?: number;
  hash: string;
  block_number: number;
  from_address: string;
  to_address: string;
  value: string;
  gas_used: number;
  status: number;
  direction?: string;
}

export interface StatsData {
  total_blocks: number;
  latest_block: number;
  total_transactions: number;
  total_addresses: number;
  avg_block_time: number;
}

export interface AddressData {
  address: string;
}

export interface AddressActivityData {
  address: string;
  transaction_hash: string;
  transaction_type: 'sent' | 'received';
}

export interface AddressStatsData {
  address: string;
  total_transactions: number;
  total_sent_transactions: number;
  total_received_transactions: number;
  gas_used: number;
  unique_counterparties: number;
  contract_deployments: number;
  first_seen_block: number;
  last_seen_block: number;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  lastBlock: BlockData | null;
  latestBlockNumber: number;
  isBlockProcessing: boolean;
  processingBlocks: Set<number>;
  recentBlocks: BlockData[];
  recentTransactions: TransactionData[];
  stats: StatsData | null;
  connectionError: string | null;
  totalBlocks: number;
  totalTransactions: number;
  totalAddresses: number;
  newAddress: AddressData | null;
  addressActivity: AddressActivityData | null;
  addressStats: AddressStatsData | null;
}

export interface UseWebSocketOptions {
  initialBlocks?: BlockData[];
  initialTransactions?: TransactionData[];
}

// Matches the home page's own "Next block in N seconds" countdown (see src/app/page.tsx)
// so the visible timer hitting zero lines up with a new block actually arriving.
const LIVE_BLOCK_INTERVAL_MS = 6000;
// Simulated network/indexing delay between a block being proposed (number known) and
// its transactions finishing processing (full data available) — mimics a real fetch round-trip.
const PROCESSING_MIN_MS = 700;
const PROCESSING_MAX_MS = 1600;

function toBlockData(block: ReturnType<typeof appendLiveBlock>['block']): BlockData {
  return {
    number: block.number,
    hash: block.hash,
    timestamp: block.timestamp,
    transaction_count: block.transactionCount,
    gas_used: String(block.gasUsed),
    gas_limit: String(block.gasLimit),
    miner: block.miner,
  };
}

function toPendingBlockData(block: ReturnType<typeof appendLiveBlock>['block']): BlockData {
  return {
    number: block.number,
    hash: `pending_${block.number}`,
    timestamp: block.timestamp,
    transaction_count: block.transactionCount,
    gas_used: '0',
    gas_limit: String(block.gasLimit),
    miner: block.miner,
  };
}

function toTransactionData(tx: ReturnType<typeof appendLiveBlock>['transactions'][number]): TransactionData {
  return {
    hash: tx.hash,
    block_number: tx.blockNumber,
    from_address: tx.fromAddress,
    to_address: tx.toAddress,
    value: tx.value,
    gas_used: tx.gasUsed,
    status: tx.status,
    direction: tx.direction,
  };
}

/** Simulates the live block/transaction feed that used to arrive over a real WebSocket. */
export function useWebSocket(
  _url: string = '',
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastBlock, setLastBlock] = useState<BlockData | null>(null);
  const [latestBlockNumber, setLatestBlockNumber] = useState(0);
  const [isBlockProcessing, setIsBlockProcessing] = useState(false);
  const [processingBlocks, setProcessingBlocks] = useState<Set<number>>(new Set());
  const [recentBlocks, setRecentBlocks] = useState<BlockData[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<TransactionData[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalAddresses, setTotalAddresses] = useState(0);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      const initial = getStats();
      setStats({
        total_blocks: initial.totalBlocks,
        latest_block: initial.latestBlockNumber,
        total_transactions: initial.totalTransactions,
        total_addresses: initial.totalAddresses,
        avg_block_time: initial.avgBlockTime,
      });
      setTotalBlocks(initial.totalBlocks);
      setTotalTransactions(initial.totalTransactions);
      setTotalAddresses(initial.totalAddresses);
      setLatestBlockNumber(initial.latestBlockNumber);
    }, 400);

    const pendingTimers = new Set<ReturnType<typeof setTimeout>>();

    const liveInterval = setInterval(() => {
      const { block, transactions } = appendLiveBlock();

      // Phase 1: block is "proposed" — number, miner and tx count are known immediately,
      // but the block isn't fully indexed yet (matches new_block_height on a real feed).
      setLatestBlockNumber(block.number);
      setTotalBlocks(block.number);
      setProcessingBlocks((prev) => new Set([...prev, block.number]));
      setIsBlockProcessing(true);
      setRecentBlocks((prev) => [toPendingBlockData(block), ...prev].slice(0, 10));

      // Phase 2: after a short simulated fetch, the full block + its transactions land.
      const revealDelay = PROCESSING_MIN_MS + Math.random() * (PROCESSING_MAX_MS - PROCESSING_MIN_MS);
      const revealTimer = setTimeout(() => {
        pendingTimers.delete(revealTimer);
        const blockData = toBlockData(block);

        setLastBlock(blockData);
        setRecentBlocks((prev) => {
          const index = prev.findIndex((b) => b.number === block.number);
          if (index === -1) return [blockData, ...prev].slice(0, 10);
          const next = [...prev];
          next[index] = blockData;
          return next;
        });

        if (transactions.length > 0) {
          const txData = transactions.map(toTransactionData);
          setRecentTransactions((prev) => [...txData, ...prev].slice(0, 10));
          setTotalTransactions((prev) => prev + transactions.length);
        }

        setProcessingBlocks((prev) => {
          const next = new Set(prev);
          next.delete(block.number);
          setIsBlockProcessing(next.size > 0);
          return next;
        });
      }, revealDelay);
      pendingTimers.add(revealTimer);
    }, LIVE_BLOCK_INTERVAL_MS);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(liveInterval);
      pendingTimers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (options.initialBlocks && options.initialBlocks.length > 0 && recentBlocks.length === 0) {
      setRecentBlocks(options.initialBlocks);
      if (options.initialBlocks[0]?.number) {
        setLatestBlockNumber(options.initialBlocks[0].number);
        setTotalBlocks(options.initialBlocks[0].number);
      }
    }
  }, [options.initialBlocks, recentBlocks.length]);

  useEffect(() => {
    if (options.initialTransactions && options.initialTransactions.length > 0 && recentTransactions.length === 0) {
      setRecentTransactions(options.initialTransactions);
    }
  }, [options.initialTransactions, recentTransactions.length]);

  return {
    isConnected,
    lastBlock,
    latestBlockNumber,
    isBlockProcessing,
    processingBlocks,
    recentBlocks,
    recentTransactions,
    stats,
    connectionError: null,
    totalBlocks,
    totalTransactions,
    totalAddresses,
    newAddress: null,
    addressActivity: null,
    addressStats: null,
  };
}
