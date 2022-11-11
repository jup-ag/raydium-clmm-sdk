import { TICK_ARRAY_SIZE } from './tick';
import { u64 } from '@solana/spl-token';

import { blob, seq, struct, u8, u16, u32 } from '@solana/buffer-layout';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { i128, i32, publicKey, uint128, uint64 } from './layoutUtils';

export interface AmmConfig {
  discriminator: number[];
  index: number;
  nothing: PublicKey;
  protocolFeeRate: number;
  tradeFeeRate: number;
  tickSpacing: number;
  ticks: BN[];
}

export const AmmConfigLayout = struct<AmmConfig>([
  seq(u8(), 8, 'discriminator'),
  u8('bump'),
  u16('index'),
  publicKey(''), // What is this?
  u32('protocolFeeRate'),
  u32('tradeFeeRate'),
  u16('tickSpacing'),
  seq(uint64('tick'), 8, ''),
]);

interface RewardInfo {
  rewardState: number;
  openTime: BN;
  endTime: BN;
  lastUpdateTime: BN;
  emissionsPerSecondX64: BN;
  rewardTotalEmissioned: BN;
  rewardClaimed: BN;
  tokenMint: PublicKey;
  tokenVault: PublicKey;
  authority: PublicKey;
  rewardGrowthGlobalX64: BN;
}

export const RewardInfo = struct<RewardInfo>([
  u8('rewardState'),
  uint64('openTime'),
  uint64('endTime'),
  uint64('lastUpdateTime'),
  uint128('emissionsPerSecondX64'),
  uint64('rewardTotalEmissioned'),
  uint64('rewardClaimed'),
  publicKey('tokenMint'),
  publicKey('tokenVault'),
  publicKey('authority'),
  uint128('rewardGrowthGlobalX64'),
]);

export interface PoolInfo {
  bump: number;
  ammConfig: PublicKey;
  mintA: PublicKey;
  mintB: PublicKey;
  vaultA: PublicKey;
  vaultB: PublicKey;
  observationId: PublicKey;
  mintDecimalsA: number;
  mintDecimalsB: number;
  tickSpacing: number;
  liquidity: BN;
  sqrtPriceX64: BN;
  tickCurrent: BN;
  observationIndex: number;
  observationUpdateDuration: number;
  feeGrowthGlobalX64A: BN;
  feeGrowthGlobalX64B: BN;
  protocolFeesTokenA: BN;
  protocolFeesTokenB: BN;
  swapInAmountTokenA: BN;
  swapOutAmountTokenB: BN;
  swapInAmountTokenB: BN;
  swapOutAmountTokenA: BN;
  status: number;
  tickArrayBitmap: BN;
}

export const PoolInfoLayout = struct<PoolInfo>([
  blob(8),
  u8('bump'),
  publicKey('ammConfig'),
  publicKey(''),
  publicKey('mintA'),
  publicKey('mintB'),
  publicKey('vaultA'),
  publicKey('vaultB'),
  publicKey('observationId'),
  u8('mintDecimalsA'),
  u8('mintDecimalsB'),
  u16('tickSpacing'),
  uint128('liquidity'),
  uint128('sqrtPriceX64'),
  i32('tickCurrent'),
  u16('observationIndex'),
  u16('observationUpdateDuration'),
  uint128('feeGrowthGlobalX64A'),
  uint128('feeGrowthGlobalX64B'),
  uint64('protocolFeesTokenA'),
  uint64('protocolFeesTokenB'),

  uint128('swapInAmountTokenA'),
  uint128('swapOutAmountTokenB'),
  uint128('swapInAmountTokenB'),
  uint128('swapOutAmountTokenA'),

  u8('status'),

  seq(u8(), 7, ''),

  seq(RewardInfo, 3, 'rewardInfos'),
  seq(uint64(''), 16, 'tickArrayBitmap'),

  uint64('totalFeesTokenA'),
  uint64('totalFeesClaimedTokenA'),
  uint64('totalFeesTokenB'),
  uint64('totalFeesClaimedTokenB'),

  seq(uint64(''), 15 * 4, ''),
]);

export interface Tick {
  tick: number;
  liquidityNet: BN;
  liquidityGross: BN;
  feeGrowthOutsideX64A: BN;
  feeGrowthOutsideX64B: BN;
  rewardGrowthsOutsideX64: BN[];
}

export const TickLayout = struct<Tick>([
  i32('tick'),
  i128('liquidityNet'),
  uint128('liquidityGross'),
  uint128('feeGrowthOutsideX64A'),
  uint128('feeGrowthOutsideX64B'),
  seq(uint128(''), 3, 'rewardGrowthsOutsideX64'),

  seq(u32(), 13, ''),
]);

export interface TickArray {
  discriminator: number[];
  poolId: PublicKey;
  startTickIndex: number;
  ticks: Tick[];
  initializedTickCount: number;
}

export const TickArrayLayout = struct<TickArray>([
  seq(u8(), 8, 'discriminator'),
  publicKey('poolId'),
  i32('startTickIndex'),
  seq(TickLayout, TICK_ARRAY_SIZE, 'ticks'),
  u8('initializedTickCount'),

  seq(u8(), 115, ''),
]);
