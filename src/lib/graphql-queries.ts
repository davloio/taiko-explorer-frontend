import { gql } from '@apollo/client';

// Homepage Queries - using correct API schema
export const GET_LATEST_BLOCK = gql`
  query LatestBlock {
    latestBlock {
      number
      hash
      timestamp
      transactionCount
      gasUsed
      miner
    }
  }
`;

export const GET_RECENT_BLOCKS = gql`
  query RecentBlocks($limit: Int) {
    blocks(limit: $limit) {
      blocks {
        number
        hash
        timestamp
        transactionCount
        gasUsed
        miner
      }
      totalCount
    }
  }
`;

export const GET_RECENT_TRANSACTIONS = gql`
  query RecentTransactions($limit: Int) {
    transactions(limit: $limit, orderDesc: true) {
      transactions {
        hash
        blockNumber
        fromAddress
        toAddress
        value
        valueInEth
        gasUsed
        status
        timestamp
      }
      totalCount
    }
  }
`;

export const GET_STATS = gql`
  query GetStats {
    stats {
      totalBlocks
      totalTransactions
    }
  }
`;

// Block Queries
export const GET_BLOCK_BY_NUMBER = gql`
  query GetBlock($blockNumber: Int!) {
    block(number: $blockNumber) {
      number
      hash
      timestamp
      gasUsed
      gasLimit
      transactionCount
      miner
      size
      parentHash
    }
  }
`;

export const GET_BLOCKS = gql`
  query GetBlocks($limit: Int) {
    blocks(limit: $limit) {
      blocks {
        number
        hash
        timestamp
        transactionCount
        gasUsed
        gasLimit
        miner
        size
      }
      totalCount
    }
  }
`;

// Transaction Queries
export const GET_TRANSACTION_BY_HASH = gql`
  query GetTransaction($hash: String!) {
    transaction(hash: $hash) {
      hash
      blockNumber
      fromAddress
      toAddress
      value
      gasUsed
      gasPrice
      status
      timestamp
      valueInEth
      transactionFeeInEth
      isSuccessful
      transactionIndex
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions($offset: Int, $limit: Int) {
    transactions(offset: $offset, limit: $limit, orderDesc: true) {
      transactions {
        hash
        blockNumber
        fromAddress
        toAddress
        value
        gasUsed
        gasPrice
        status
        timestamp
        valueInEth
      }
      totalCount
    }
  }
`;

// Search Query
export const UNIVERSAL_SEARCH = gql`
  query Search($query: String!) {
    block(number: $query) {
      number
      hash
      timestamp
      transactionCount
    }
    transaction(hash: $query) {
      hash
      blockNumber
      fromAddress
      toAddress
      valueInEth
      status
    }
    addressStats(address: $query) {
      address
      totalTransactions
      totalVolumeInEth
    }
  }
`;