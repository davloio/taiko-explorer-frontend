'use client';

import { useCallback, useEffect, useState } from 'react';
import * as mock from './mock-data';
import {
  GET_STATS,
  GET_RECENT_BLOCKS,
  GET_RECENT_TRANSACTIONS,
  GET_BLOCK_BY_NUMBER,
  GET_BLOCKS,
  GET_TRANSACTION_BY_HASH,
  GET_TRANSACTIONS,
  GET_TRANSACTION_COUNTS_BY_STATUS,
  GET_TRANSACTION_COUNTS_BY_DIRECTION,
  GET_TOP_ADDRESSES,
  GET_ADDRESS_STATS,
  GET_ADDRESS_PROFILE,
  GET_ADDRESS_TRANSACTIONS,
  GET_ADDRESS_GROWTH_CHART,
} from './graphql-queries';

type Variables = Record<string, any>;

function resolve(operation: string, variables: Variables): any {
  switch (operation) {
    case GET_STATS:
      return { stats: mock.getStats() };
    case GET_RECENT_BLOCKS:
      return { blocks: mock.getRecentBlocks(variables.limit ?? 10) };
    case GET_RECENT_TRANSACTIONS:
      return { transactions: mock.getRecentTransactions(variables.limit ?? 10) };
    case GET_BLOCK_BY_NUMBER:
      return { block: mock.getBlockByNumber(variables.blockNumber) };
    case GET_BLOCKS:
      return { blocks: mock.getBlocks(variables.limit ?? 20) };
    case GET_TRANSACTION_BY_HASH:
      return { transaction: mock.getTransactionByHash(variables.hash) };
    case GET_TRANSACTIONS:
      return {
        transactions: mock.getTransactions({
          limit: variables.limit ?? 50,
          offset: variables.offset ?? 0,
          statusFilter: variables.statusFilter,
          directionFilter: variables.directionFilter,
        }),
      };
    case GET_TRANSACTION_COUNTS_BY_STATUS:
      return { transactionCountsByStatus: mock.getTransactionCountsByStatus() };
    case GET_TRANSACTION_COUNTS_BY_DIRECTION:
      return { transactionCountsByDirection: mock.getTransactionCountsByDirection() };
    case GET_TOP_ADDRESSES:
      return mock.getTopAddresses();
    case GET_ADDRESS_STATS:
      return { addressStats: mock.getAddressStats(variables.address) };
    case GET_ADDRESS_PROFILE:
      return { addressProfile: mock.getAddressProfile(variables.address) };
    case GET_ADDRESS_TRANSACTIONS:
      return {
        transactionsByAddress: mock.getAddressTransactionsPage(variables.address, {
          limit: variables.limit ?? 20,
          offset: variables.offset ?? 0,
          statusFilter: variables.statusFilter,
          directionFilter: variables.directionFilter,
        }),
      };
    case GET_ADDRESS_GROWTH_CHART:
      return { addressGrowthChart: mock.getAddressGrowthChart() };
    default:
      return {};
  }
}

interface UseQueryOptions {
  variables?: Variables;
  fetchPolicy?: string;
  errorPolicy?: string;
}

interface UseQueryResult<T = any> {
  data: T;
  loading: boolean;
  error: Error | undefined;
  refetch: () => Promise<{ data: T }>;
}

/** Drop-in replacement for Apollo's useQuery, backed by the in-memory mock dataset. */
export function useQuery<T = any>(operation: string, options: UseQueryOptions = {}): UseQueryResult<T> {
  const variables = options.variables ?? {};
  const varsKey = JSON.stringify(variables);
  const [data, setData] = useState<T>(() => resolve(operation, variables));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(() => {
      if (cancelled) return;
      setData(resolve(operation, variables));
      setLoading(false);
    }, 300 + Math.random() * 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation, varsKey]);

  // Stable identity across renders (like Apollo's real refetch) so effects such as
  // `useEffect(() => { refetch(); }, [..., refetch])` only fire when the query itself
  // changes, not on every render — an unstable refetch here caused an infinite loop.
  const refetch = useCallback(async () => {
    const next = resolve(operation, variables);
    setData(next);
    return { data: next };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation, varsKey]);

  return { data, loading, error: undefined, refetch };
}
