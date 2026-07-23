// Self-contained mock blockchain dataset. Replaces the GraphQL/WebSocket backend
// entirely: every accessor here mirrors the exact response shape the real API used to return.

export interface MockBlock {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  transactionCount: number;
  gasUsed: number;
  gasLimit: number;
  miner: string;
  size: number;
}

export interface MockTransaction {
  hash: string;
  blockNumber: number;
  transactionIndex: number;
  fromAddress: string;
  toAddress: string;
  value: string;
  valueInEth: number;
  gasUsed: number;
  gasLimit: number;
  gasPrice: number;
  status: 1 | 0;
  isSuccessful: boolean;
  timestamp: number;
  direction: 'IN' | 'OUT' | 'INSIDE';
  transactionFeeInEth: number;
}

function mulberry32(seed: number) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(1337);
const randomHex = (len: number) => {
  let s = '';
  for (let i = 0; i < len; i++) s += Math.floor(rand() * 16).toString(16);
  return s;
};
const randomAddress = () => `0x${randomHex(40)}`;
const randomHash = () => `0x${randomHex(64)}`;
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

// Addresses that actually appear in generated transactions (the "hot window" — full detail
// is available for these). Kept in the low thousands so per-address lookups stay fast.
const ADDRESS_POOL = Array.from({ length: 1200 }, randomAddress);
const CONTRACT_ADDRESSES = new Set(ADDRESS_POOL.slice(0, 120));
const MINERS = Array.from({ length: 6 }, randomAddress);

// Size of the in-memory block/transaction window kept fully browsable (detail pages,
// pagination, filters all work against real data within this window).
const NUM_BLOCKS = 750;
// Matches the live-feed cadence in useWebSocket.ts so "avg block time" and the actual
// rate new blocks arrive at agree with each other.
const BLOCK_INTERVAL_SECONDS = 6;
// Matches makeBlock's transactionCount distribution (uniform 0..35, average 17.5) — used to
// scale the reported transaction total to the reported chain height, the same way the height
// itself is reported independently of the small in-memory window.
const AVG_TX_PER_BLOCK = 17.5;
// A big, established L2 chain: ~1.5 years of 6s blocks. This is the number reported as the
// chain height everywhere (home page, blocks list, stats) — the actual `blocks` array below
// only keeps the most recent NUM_BLOCKS of it in memory, the way a real explorer's hot cache
// holds recent data while its reported totals reflect the full chain.
const TIP_BLOCK_NUMBER = 7_600_000 + Math.floor(rand() * 900_000);

// Headline "total addresses" figure, reported everywhere a page shows an unfiltered grand
// total (home page, address growth chart) — a real chain's all-time unique-address count is
// far larger than the small set of addresses with visible recent activity. Grows slightly as
// live blocks arrive so it still feels alive rather than frozen.
let totalAddressesSeen = 380_000 + Math.floor(rand() * 650_000);

function makeTransaction(blockNumber: number, timestamp: number, index: number): MockTransaction {
  const fromAddress = pick(ADDRESS_POOL);
  const toAddress = pick(ADDRESS_POOL);
  const gasUsed = 21000 + Math.floor(rand() * 230000);
  const gasLimit = Math.floor(gasUsed * (1.1 + rand() * 0.4));
  const gasPrice = Math.floor((0.5 + rand() * 3) * 1e9);
  const isSuccessful = rand() < 0.94;
  const valueEth = rand() < 0.3 ? 0 : rand() * (rand() < 0.9 ? 5 : 200);
  const direction: MockTransaction['direction'] = CONTRACT_ADDRESSES.has(toAddress)
    ? 'INSIDE'
    : rand() < 0.5
    ? 'IN'
    : 'OUT';

  return {
    hash: randomHash(),
    blockNumber,
    transactionIndex: index,
    fromAddress,
    toAddress,
    value: Math.floor(valueEth * 1e18).toString(),
    valueInEth: valueEth,
    gasUsed,
    gasLimit,
    gasPrice,
    status: isSuccessful ? 1 : 0,
    isSuccessful,
    timestamp,
    direction,
    transactionFeeInEth: (gasUsed * gasPrice) / 1e18,
  };
}

function makeBlock(number: number, timestamp: number, parentHash: string): MockBlock {
  const transactionCount = Math.floor(rand() * 35);
  const gasLimit = 30_000_000;
  const gasUsed = Math.floor(gasLimit * (0.05 + rand() * 0.85));
  return {
    number,
    hash: randomHash(),
    parentHash,
    timestamp,
    transactionCount,
    gasUsed,
    gasLimit,
    miner: pick(MINERS),
    size: 600 + Math.floor(rand() * 45000),
  };
}

const blocks: MockBlock[] = [];
const transactions: MockTransaction[] = [];

function generateDataset() {
  const now = Math.floor(Date.now() / 1000);
  const startNumber = TIP_BLOCK_NUMBER - NUM_BLOCKS + 1;
  let parentHash = `0x${'0'.repeat(64)}`;
  for (let i = 0; i < NUM_BLOCKS; i++) {
    const number = startNumber + i;
    const timestamp = now - (NUM_BLOCKS - 1 - i) * BLOCK_INTERVAL_SECONDS;
    const block = makeBlock(number, timestamp, parentHash);
    blocks.push(block);
    parentHash = block.hash;
    for (let t = 0; t < block.transactionCount; t++) {
      transactions.push(makeTransaction(number, timestamp, t));
    }
  }
}
generateDataset();

/** Appends one new block + its transactions to the tip, used by the simulated live feed. */
export function appendLiveBlock() {
  const last = blocks[blocks.length - 1];
  const number = last.number + 1;
  const timestamp = Math.floor(Date.now() / 1000);
  const block = makeBlock(number, timestamp, last.hash);
  blocks.push(block);
  const newTxs: MockTransaction[] = [];
  for (let t = 0; t < block.transactionCount; t++) {
    const tx = makeTransaction(number, timestamp, t);
    transactions.push(tx);
    newTxs.push(tx);
  }
  totalAddressesSeen += Math.floor(rand() * 5);
  blocksDescCache = null;
  transactionsDescCache = null;
  return { block, transactions: newTxs };
}

/** Chain height reported everywhere: grows as appendLiveBlock() advances the tip. */
function getChainHeight() {
  return blocks[blocks.length - 1].number + 1;
}

/**
 * Reported total transaction count, scaled to the reported chain height rather than the size
 * of the in-memory window — a chain with millions of blocks has proportionally many more
 * transactions than the small hot window kept for actual browsing. Recomputed from the live
 * height so it always stays in sync as appendLiveBlock() advances the tip.
 */
function getCanonicalTotalTransactions() {
  return Math.round(getChainHeight() * AVG_TX_PER_BLOCK);
}

// Sorting is the expensive part at this dataset size, and getTopAddresses() in particular
// calls these indirectly once per pool address — cache the sort and invalidate only when
// appendLiveBlock() actually changes the underlying arrays.
let blocksDescCache: MockBlock[] | null = null;
let transactionsDescCache: MockTransaction[] | null = null;

function blocksDesc() {
  if (!blocksDescCache) blocksDescCache = [...blocks].sort((a, b) => b.number - a.number);
  return blocksDescCache;
}

function transactionsDesc() {
  if (!transactionsDescCache) {
    transactionsDescCache = [...transactions].sort(
      (a, b) => b.blockNumber - a.blockNumber || b.transactionIndex - a.transactionIndex
    );
  }
  return transactionsDescCache;
}

function filterTransactions(statusFilter?: string | null, directionFilter?: string | null) {
  return transactionsDesc().filter((tx) => {
    if (statusFilter && statusFilter !== 'ALL') {
      const wantSuccess = statusFilter === 'SUCCESS';
      if (tx.isSuccessful !== wantSuccess) return false;
    }
    if (directionFilter && directionFilter !== 'ALL' && tx.direction !== directionFilter) return false;
    return true;
  });
}

export function getStats() {
  const latest = blocks[blocks.length - 1];
  return {
    totalBlocks: getChainHeight(),
    latestBlockNumber: latest.number,
    totalTransactions: getCanonicalTotalTransactions(),
    totalAddresses: totalAddressesSeen,
    avgBlockTime: BLOCK_INTERVAL_SECONDS,
  };
}

export function getRecentBlocks(limit: number) {
  const all = blocksDesc();
  return { blocks: all.slice(0, limit), totalCount: getChainHeight() };
}

export function getBlocks(limit: number, offset: number = 0) {
  const all = blocksDesc();
  return { blocks: all.slice(offset, offset + limit), totalCount: getChainHeight() };
}

export function getBlockByNumber(number: number) {
  return blocks.find((b) => b.number === number) || null;
}

export function getRecentTransactions(limit: number) {
  const all = transactionsDesc();
  return { transactions: all.slice(0, limit), totalCount: getCanonicalTotalTransactions() };
}

// Scales a count measured against the small in-memory sample up to the canonical reported
// total, preserving the sample's proportions (e.g. the real ~94% success rate) so a filtered
// "Total Transactions" figure still lines up with the matching status/direction button count.
function scaleToCanonicalTotal(sampleCount: number) {
  if (transactions.length === 0) return 0;
  return Math.round(getCanonicalTotalTransactions() * (sampleCount / transactions.length));
}

export function getTransactions(opts: { limit: number; offset: number; statusFilter?: string | null; directionFilter?: string | null }) {
  const filtered = filterTransactions(opts.statusFilter, opts.directionFilter);
  const isUnfiltered = (!opts.statusFilter || opts.statusFilter === 'ALL') && (!opts.directionFilter || opts.directionFilter === 'ALL');
  return {
    transactions: filtered.slice(opts.offset, opts.offset + opts.limit),
    totalCount: isUnfiltered ? getCanonicalTotalTransactions() : scaleToCanonicalTotal(filtered.length),
  };
}

export function getTransactionByHash(hash: string) {
  return transactions.find((tx) => tx.hash === hash) || null;
}

export function getTransactionCountsByStatus() {
  const total = getCanonicalTotalTransactions();
  const success = scaleToCanonicalTotal(transactions.filter((t) => t.isSuccessful).length);
  return [
    { status: 1, count: success },
    { status: 0, count: total - success }, // absorbs rounding so the two always sum to `total`
  ];
}

export function getTransactionCountsByDirection() {
  const total = getCanonicalTotalTransactions();
  const counts: Record<string, number> = { IN: 0, OUT: 0, INSIDE: 0 };
  for (const tx of transactions) counts[tx.direction]++;
  const inScaled = scaleToCanonicalTotal(counts.IN);
  const outScaled = scaleToCanonicalTotal(counts.OUT);
  // INSIDE absorbs the rounding remainder so IN + OUT + INSIDE always sums to `total` exactly.
  return [
    { direction: 'IN', count: inScaled },
    { direction: 'OUT', count: outScaled },
    { direction: 'INSIDE', count: total - inScaled - outScaled },
  ];
}

// fromAddress/toAddress are always generated lowercase, so only the externally-supplied
// address (which may arrive in any case from a URL param) needs normalizing.
function addressTransactions(address: string) {
  const lower = address.toLowerCase();
  return transactionsDesc().filter((tx) => tx.fromAddress === lower || tx.toAddress === lower);
}

function addressDirection(tx: MockTransaction, address: string): 'IN' | 'OUT' | 'INSIDE' {
  const lower = address.toLowerCase();
  const isFrom = tx.fromAddress === lower;
  const isTo = tx.toAddress === lower;
  if (isFrom && isTo) return 'INSIDE';
  return isFrom ? 'OUT' : 'IN';
}

function computeAddressStats(address: string, lower: string, related: MockTransaction[]) {
  if (related.length === 0) {
    return {
      address,
      totalTransactions: 0,
      totalSentTransactions: 0,
      totalReceivedTransactions: 0,
      gasUsed: 0,
      uniqueCounterparties: 0,
      contractDeployments: 0,
      firstSeenBlock: 0,
      lastSeenBlock: 0,
      activityScore: 0,
      totalVolumeInEth: 0,
      gasFeesInEth: 0,
    };
  }
  const sent = related.filter((tx) => tx.fromAddress === lower);
  const received = related.filter((tx) => tx.toAddress === lower);
  const counterparties = new Set(
    related.map((tx) => (tx.fromAddress === lower ? tx.toAddress : tx.fromAddress))
  );
  const blockNumbers = related.map((tx) => tx.blockNumber);
  const totalVolumeInEth = related.reduce((sum, tx) => sum + tx.valueInEth, 0);
  const gasFeesInEth = sent.reduce((sum, tx) => sum + tx.transactionFeeInEth, 0);

  return {
    address,
    totalTransactions: related.length,
    totalSentTransactions: sent.length,
    totalReceivedTransactions: received.length,
    gasUsed: sent.reduce((sum, tx) => sum + tx.gasUsed, 0),
    uniqueCounterparties: counterparties.size,
    contractDeployments: Math.floor(rand() * 3),
    firstSeenBlock: Math.min(...blockNumbers),
    lastSeenBlock: Math.max(...blockNumbers),
    activityScore: related.length * 2 + counterparties.size,
    totalVolumeInEth,
    gasFeesInEth,
  };
}

export function getAddressStats(address: string) {
  return computeAddressStats(address, address.toLowerCase(), addressTransactions(address));
}

export function getAddressProfile(address: string) {
  const related = addressTransactions(address);
  const lower = address.toLowerCase();
  const sent = related.filter((tx) => tx.fromAddress === lower);
  const received = related.filter((tx) => tx.toAddress === lower);
  const totalSent = sent.reduce((sum, tx) => sum + tx.valueInEth, 0);
  const totalReceived = received.reduce((sum, tx) => sum + tx.valueInEth, 0);
  const totalGasFees = sent.reduce((sum, tx) => sum + tx.transactionFeeInEth, 0);
  const first = related[related.length - 1];
  const last = related[0];

  return {
    address,
    totalTransactions: related.length,
    totalSent,
    totalReceived,
    totalGasFees,
    totalVolume: totalSent + totalReceived,
    netBalance: totalReceived - totalSent - totalGasFees,
    firstActivity: first ? { blockNumber: first.blockNumber, transactionHash: first.hash } : null,
    lastActivity: last ? { blockNumber: last.blockNumber, transactionHash: last.hash } : null,
  };
}

export function getAddressTransactionsPage(address: string, opts: { limit: number; offset: number; statusFilter?: string | null; directionFilter?: string | null }) {
  let related = addressTransactions(address).map((tx) => ({ ...tx, direction: addressDirection(tx, address) }));
  if (opts.statusFilter && opts.statusFilter !== 'ALL') {
    const wantSuccess = opts.statusFilter === 'SUCCESS';
    related = related.filter((tx) => tx.isSuccessful === wantSuccess);
  }
  if (opts.directionFilter && opts.directionFilter !== 'ALL') {
    related = related.filter((tx) => tx.direction === opts.directionFilter);
  }
  const page = related.slice(opts.offset, opts.offset + opts.limit);
  return {
    transactions: page.map((tx) => ({ ...tx, timestampIso: new Date(tx.timestamp * 1000).toISOString() })),
    totalCount: related.length,
    hasNextPage: opts.offset + opts.limit < related.length,
    hasPreviousPage: opts.offset > 0,
  };
}

export function getTopAddresses() {
  // Group every transaction by the addresses it touches in one pass, instead of scanning the
  // whole transaction list once per pool address (which is quadratic and was visibly slow).
  const grouped = new Map<string, MockTransaction[]>();
  const addTo = (address: string, tx: MockTransaction) => {
    let bucket = grouped.get(address);
    if (!bucket) {
      bucket = [];
      grouped.set(address, bucket);
    }
    bucket.push(tx);
  };
  for (const tx of transactions) {
    addTo(tx.fromAddress, tx);
    if (tx.toAddress !== tx.fromAddress) addTo(tx.toAddress, tx);
  }
  const stats = Array.from(grouped.entries()).map(([address, related]) =>
    computeAddressStats(address, address, related)
  );
  const byVolume = [...stats]
    .sort((a, b) => b.totalVolumeInEth - a.totalVolumeInEth)
    .slice(0, 10)
    .map((s) => ({
      address: s.address,
      totalTransactions: s.totalTransactions,
      totalVolumeInEth: s.totalVolumeInEth,
      activityScore: s.activityScore,
    }));
  const byActivity = [...stats]
    .sort((a, b) => b.activityScore - a.activityScore)
    .slice(0, 10)
    .map((s) => ({
      address: s.address,
      totalTransactions: s.totalTransactions,
      uniqueCounterparties: s.uniqueCounterparties,
      activityScore: s.activityScore,
    }));
  return { topAddressesByVolume: byVolume, topAddressesByActivity: byActivity };
}

export function getAddressGrowthChart() {
  const points = 30;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const finalTotal = totalAddressesSeen;
  const data = Array.from({ length: points }, (_, i) => {
    const fraction = (i + 1) / points;
    const totalAddresses = Math.round(finalTotal * Math.pow(fraction, 0.7));
    const prevTotal = i === 0 ? 0 : Math.round(finalTotal * Math.pow(i / points, 0.7));
    return {
      timestamp: new Date(now - (points - 1 - i) * dayMs).toISOString(),
      totalAddresses,
      newAddresses: totalAddresses - prevTotal,
    };
  });
  return { data, dataPoints: points, totalAddresses: finalTotal };
}
