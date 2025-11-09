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
      latestBlockNumber
      totalTransactions
      totalAddresses
      avgBlockTime
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
      gasLimit
      gasPrice
      status
      timestamp
      valueInEth
      transactionFeeInEth
      isSuccessful
      transactionIndex
      direction
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions($offset: Int, $limit: Int, $statusFilter: String, $directionFilter: String) {
    transactions(offset: $offset, limit: $limit, orderDesc: true, statusFilter: $statusFilter, directionFilter: $directionFilter) {
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
        direction
      }
      totalCount
    }
  }
`;

// Transaction count queries
export const GET_TRANSACTION_COUNTS_BY_STATUS = gql`
  query GetTransactionCountsByStatus {
    transactionCountsByStatus {
      status
      count
    }
  }
`;

export const GET_TRANSACTION_COUNTS_BY_DIRECTION = gql`
  query GetTransactionCountsByDirection {
    transactionCountsByDirection {
      direction
      count
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

// Address Queries
export const GET_TOP_ADDRESSES = gql`
  query GetTopAddresses {
    topAddressesByVolume(limit: 10) {
      address
      totalTransactions
      totalVolumeInEth
      activityScore
    }
    topAddressesByActivity(limit: 10) {
      address
      totalTransactions
      uniqueCounterparties
      activityScore
    }
  }
`;

export const GET_ADDRESS_STATS = gql`
  query GetAddressStats($address: String!) {
    addressStats(address: $address) {
      address
      totalTransactions
      totalSentTransactions
      totalReceivedTransactions
      gasUsed
      uniqueCounterparties
      contractDeployments
      firstSeenBlock
      lastSeenBlock
      activityScore
      totalVolumeInEth
      gasFeesInEth
    }
  }
`;

export const GET_ADDRESS_PROFILE = gql`
  query GetAddressProfile($address: String!) {
    addressProfile(address: $address) {
      address
      totalTransactions
      totalSent
      totalReceived
      totalGasFees
      totalVolume
      netBalance
      firstActivity {
        blockNumber
        transactionHash
      }
      lastActivity {
        blockNumber
        transactionHash
      }
    }
  }
`;

export const GET_ADDRESS_TRANSACTIONS = gql`
  query GetAddressTransactions($address: String!, $limit: Int, $offset: Int, $statusFilter: String, $directionFilter: String) {
    transactionsByAddress(address: $address, limit: $limit, offset: $offset, statusFilter: $statusFilter, directionFilter: $directionFilter) {
      transactions {
        hash
        blockNumber
        fromAddress
        toAddress
        valueInEth
        gasUsed
        status
        isSuccessful
        timestampIso
        direction
      }
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_ADDRESS_BRIDGE_ACTIVITY = gql`
  query GetAddressBridgeActivity($address: String!) {
    bridgeTransactionsByAddress(address: $address, limit: 20) {
      transactionHash
      bridgeType
      fromChain
      toChain
      amountInEth
      status
      isDeposit
      isWithdrawal
      isPending
    }
  }
`;

export const GET_ADDRESS_GROWTH_CHART = gql`
  query AddressGrowthChart($timeRange: TimeRange!) {
    addressGrowthChart(timeRange: $timeRange) {
      data {
        timestamp
        totalAddresses
        newAddresses
      }
      dataPoints
      totalAddresses
    }
  }
`;