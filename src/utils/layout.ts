import { i128, i32, publicKey, u128, u16, u32, u64 } from '@project-serum/borsh'
import { TICK_ARRAY_SIZE } from './tick'

const { blob, seq, struct, u8 } = require('buffer-layout')

export const AmmConfigLayout = struct([
  blob(8),
  u8('bump'),
  u16('index'),
  publicKey(''),
  u32('protocolFeeRate'),
  u32('tradeFeeRate'),
  u16('tickSpacing'),
  seq(u64(), 8, ''),
])

export const RewardInfo = struct([
  u8('rewardState'),
  u64('openTime'),
  u64('endTime'),
  u64('lastUpdateTime'),
  u128('emissionsPerSecondX64'),
  u64('rewardTotalEmissioned'),
  u64('rewardClaimed'),
  publicKey('tokenMint'),
  publicKey('tokenVault'),
  publicKey('authority'),
  u128('rewardGrowthGlobalX64'),
])
export const PoolInfoLayout = struct([
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
  u128('liquidity'),
  u128('sqrtPriceX64'),
  i32('tickCurrent'),
  u16('observationIndex'),
  u16('observationUpdateDuration'),
  u128('feeGrowthGlobalX64A'),
  u128('feeGrowthGlobalX64B'),
  u64('protocolFeesTokenA'),
  u64('protocolFeesTokenB'),

  u128('swapInAmountTokenA'),
  u128('swapOutAmountTokenB'),
  u128('swapInAmountTokenB'),
  u128('swapOutAmountTokenA'),

  u8('status'),

  seq(u8(), 7, ''),

  seq(RewardInfo, 3, 'rewardInfos'),
  seq(u64(), 16, 'tickArrayBitmap'),

  u64('totalFeesTokenA'),
  u64('totalFeesClaimedTokenA'),
  u64('totalFeesTokenB'),
  u64('totalFeesClaimedTokenB'),

  seq(u64(), 15 * 4, ''),
])

export const TickLayout = struct([
  i32('tick'),
  i128('liquidityNet'),
  u128('liquidityGross'),
  u128('feeGrowthOutsideX64A'),
  u128('feeGrowthOutsideX64B'),
  seq(u128(), 3, 'rewardGrowthsOutsideX64'),

  seq(u32(), 13, ''),
])

export const TickArrayLayout = struct([
  blob(8),
  publicKey('poolId'),
  i32('startTickIndex'),
  seq(TickLayout, TICK_ARRAY_SIZE, 'ticks'),
  u8('initializedTickCount'),

  seq(u8(), 115, ''),
])
