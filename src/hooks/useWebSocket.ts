'use client';

import { useEffect, useRef, useState } from 'react';

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

export interface BlockHeightData {
  block_number: number;
  timestamp: number;
  status: 'height_stored';
  miner: string;
  transaction_count: number;
}

export interface BlockCompleteData {
  block_number: number;
  timestamp: number;
  status: 'transactions_processed';
}

export interface WebSocketMessage {
  type: 'connected' | 'new_block' | 'new_block_height' | 'block_complete' | 'new_transaction' | 'stats' | 'new_address' | 'address_activity' | 'address_stats_update' | 'error';
  message?: string;
  connection_id?: string;
  data?: BlockData | BlockHeightData | BlockCompleteData | TransactionData | StatsData | AddressData | AddressActivityData | AddressStatsData;
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

export function useWebSocket(
  url: string = process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT || 'ws://localhost:3000/ws', 
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
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalAddresses, setTotalAddresses] = useState(0);
  const [newAddress, setNewAddress] = useState<AddressData | null>(null);
  const [addressActivity, setAddressActivity] = useState<AddressActivityData | null>(null);
  const [addressStats, setAddressStats] = useState<AddressStatsData | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    try {
      if (wsRef.current) {
        wsRef.current.close();
      }

      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'connected':
              break;
              
            case 'new_block_height':
              if (message.data && 'block_number' in message.data) {
                const heightData = message.data as BlockHeightData;
                setLatestBlockNumber(heightData.block_number);
                setTotalBlocks(heightData.block_number);
                setProcessingBlocks(prev => new Set([...prev, heightData.block_number]));
                setIsBlockProcessing(true);
                const basicBlock: BlockData = {
                  number: heightData.block_number,
                  hash: `temp_${heightData.block_number}`,
                  timestamp: heightData.timestamp,
                  transaction_count: heightData.transaction_count,
                  gas_used: '0',
                  gas_limit: '30000000',
                  miner: heightData.miner
                };
                setRecentBlocks(prev => {
                  const exists = prev.some(block => block.number === heightData.block_number);
                  if (exists) return prev;
                  return [basicBlock, ...prev].slice(0, 10);
                });
              }
              break;
              
            case 'block_complete':
              if (message.data && 'block_number' in message.data) {
                const completeData = message.data as BlockCompleteData;
                setProcessingBlocks(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(completeData.block_number);
                  return newSet;
                });
                setIsBlockProcessing(prev => processingBlocks.size > 1);
              }
              break;
              
            case 'new_block':
              if (message.data && 'number' in message.data) {
                const blockData = message.data as BlockData;
                setLastBlock(blockData);
                setLatestBlockNumber(blockData.number);
                setTotalBlocks(blockData.number);
                setRecentBlocks(prev => {
                  const existingIndex = prev.findIndex(block => block.number === blockData.number);
                  if (existingIndex !== -1) {
                    const updated = [...prev];
                    updated[existingIndex] = blockData;
                    return updated;
                  } else {
                    return [blockData, ...prev].slice(0, 10);
                  }
                });
                setProcessingBlocks(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(blockData.number);
                  return newSet;
                });
                setIsBlockProcessing(prev => processingBlocks.size > 1);
              }
              break;
              
            case 'new_transaction':
              if (message.data && 'hash' in message.data) {
                const txData = message.data as TransactionData;
                setRecentTransactions(prev => {
                  const exists = prev.some(tx => tx.hash === txData.hash);
                  if (exists) {
                    return prev;
                  }
                  const newList = [txData, ...prev].slice(0, 10);
                  return newList;
                });
                setTotalTransactions(prev => prev + 1);
              }
              break;
              
            case 'stats':
              if (message.data && 'total_blocks' in message.data) {
                const statsData = message.data as StatsData;
                setStats(statsData);
                setTotalBlocks(statsData.total_blocks);
                setTotalTransactions(statsData.total_transactions);
                setTotalAddresses(statsData.total_addresses);
              }
              break;
              
            case 'new_address':
              if (message.data && 'address' in message.data) {
                const addressData = message.data as AddressData;
                setNewAddress(addressData);
              }
              break;
              
            case 'address_activity':
              if (message.data && 'address' in message.data && 'transaction_hash' in message.data) {
                const activityData = message.data as AddressActivityData;
                setAddressActivity(activityData);
              }
              break;
              
            case 'address_stats_update':
              if (message.data && 'address' in message.data && 'total_transactions' in message.data) {
                const statsData = message.data as AddressStatsData;
                setAddressStats(statsData);
              }
              break;
              
            case 'error':
              setConnectionError(message.message || 'Unknown WebSocket error');
              break;
              
            default:
          }
        } catch (error) {
        }
      };

      wsRef.current.onclose = (event) => {
        if (event.code !== 1000) {
          setIsConnected(false);
        }
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setConnectionError('Failed to reconnect after multiple attempts');
          setIsConnected(false);
        }
      };

      wsRef.current.onerror = (error) => {
        setConnectionError('WebSocket connection failed');
      };

    } catch (error) {
      setConnectionError('Failed to create WebSocket connection');
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
      }
    };
  }, [url]);

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
    connectionError,
    totalBlocks,
    totalTransactions,
    totalAddresses,
    newAddress,
    addressActivity,
    addressStats
  };
}