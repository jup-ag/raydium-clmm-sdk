import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { TickArrayState } from '../types';
import { getPdaTickArrayAddress } from './pda';
import { TickQuery } from './tickQuery';
import { TickArrayBitmapExtensionLayout } from '../amm';
import { MAX_TICK, MIN_TICK } from './constants';

export const TICK_ARRAY_SIZE = 60;
export const TICK_ARRAY_BITMAP_SIZE = 1024;

export type Tick = {
  tick: number;
  liquidityNet: BN;
  liquidityGross: BN;
  feeGrowthOutsideX64A: BN;
  feeGrowthOutsideX64B: BN;
  rewardGrowthsOutsideX64: BN[];
};

export type TickArray = TickArrayState & { address: PublicKey };

export class TickUtils {
  public static getTickArrayAddressByTick(
    programId: PublicKey,
    poolId: PublicKey,
    tickIndex: number,
    tickSpacing: number,
  ) {
    const startIndex = TickUtils.getTickArrayStartIndexByTick(tickIndex, tickSpacing)
    const { publicKey: tickArrayAddress } = getPdaTickArrayAddress(programId, poolId, startIndex)
    return tickArrayAddress
  }

  public static getTickOffsetInArray(tickIndex: number, tickSpacing: number) {
    if (tickIndex % tickSpacing != 0) {
      throw new Error('tickIndex % tickSpacing not equal 0')
    }
    const startTickIndex = TickUtils.getTickArrayStartIndexByTick(tickIndex, tickSpacing)
    const offsetInArray = Math.floor((tickIndex - startTickIndex) / tickSpacing)
    if (offsetInArray < 0 || offsetInArray >= TICK_ARRAY_SIZE) {
      throw new Error('tick offset in array overflow')
    }
    return offsetInArray
  }

  public static getTickArrayBitIndex(tickIndex: number, tickSpacing: number) {
    const ticksInArray = TickQuery.tickCount(tickSpacing)

    let startIndex: number = tickIndex / ticksInArray
    if (tickIndex < 0 && tickIndex % ticksInArray != 0) {
      startIndex = Math.ceil(startIndex) - 1
    } else {
      startIndex = Math.floor(startIndex)
    }
    return startIndex
  }

  public static getTickArrayStartIndexByTick(tickIndex: number, tickSpacing: number) {
    return this.getTickArrayBitIndex(tickIndex, tickSpacing) * TickQuery.tickCount(tickSpacing)
  }

  public static getTickArrayOffsetInBitmapByTick(tick: number, tickSpacing: number) {
    const multiplier = tickSpacing * TICK_ARRAY_SIZE
    const compressed = Math.floor(tick / multiplier) + 512
    return Math.abs(compressed)
  }

  public static checkTickArrayIsInitialized(bitmap: BN, tick: number, tickSpacing: number) {
    const multiplier = tickSpacing * TICK_ARRAY_SIZE
    const compressed = Math.floor(tick / multiplier) + 512
    const bitPos = Math.abs(compressed)
    return {
      isInitialized: bitmap.testn(bitPos),
      startIndex: (bitPos - 512) * multiplier,
    }
  }

  public static getNextTickArrayStartIndex(lastTickArrayStartIndex: number, tickSpacing: number, zeroForOne: boolean) {
    return zeroForOne
      ? lastTickArrayStartIndex - tickSpacing * TICK_ARRAY_SIZE
      : lastTickArrayStartIndex + tickSpacing * TICK_ARRAY_SIZE
  }

  public static mergeTickArrayBitmap(bns: BN[]) {
    let b = new BN(0)
    for (let i = 0; i < bns.length; i++) {
      b = b.add(bns[i].shln(64 * i))
    }
    return b
  }

  public static getInitializedTickArrayInRange(
    tickArrayBitmap: BN[],
    exTickArrayBitmap: TickArrayBitmapExtensionLayout,
    tickSpacing: number,
    tickArrayStartIndex: number,
    expectedCount: number,
  ) {
    const tickArrayOffset = Math.floor(tickArrayStartIndex / (tickSpacing * TICK_ARRAY_SIZE))
    return [
      // find right of currenct offset
      ...TickUtils.searchLowBitFromStart(
        tickArrayBitmap,
        exTickArrayBitmap,
        tickArrayOffset - 1,
        expectedCount,
        tickSpacing,
      ),

      // find left of current offset
      ...TickUtils.searchHightBitFromStart(
        tickArrayBitmap,
        exTickArrayBitmap,
        tickArrayOffset,
        expectedCount,
        tickSpacing,
      ),
    ]
  }

  public static getAllInitializedTickArrayStartIndex(
    tickArrayBitmap: BN[],
    exTickArrayBitmap: TickArrayBitmapExtensionLayout,
    tickSpacing: number,
  ) {
    // find from offset 0 to 1024
    return TickUtils.searchHightBitFromStart(tickArrayBitmap, exTickArrayBitmap, 0, TICK_ARRAY_BITMAP_SIZE, tickSpacing)
  }

  public static getAllInitializedTickArrayInfo(
    programId: PublicKey,
    poolId: PublicKey,
    tickArrayBitmap: BN[],
    exTickArrayBitmap: TickArrayBitmapExtensionLayout,
    tickSpacing: number,
  ) {
    const result: {
      tickArrayStartIndex: number
      tickArrayAddress: PublicKey
    }[] = []
    const allInitializedTickArrayIndex: number[] = TickUtils.getAllInitializedTickArrayStartIndex(
      tickArrayBitmap,
      exTickArrayBitmap,
      tickSpacing,
    )
    for (const startIndex of allInitializedTickArrayIndex) {
      const { publicKey: address } = getPdaTickArrayAddress(programId, poolId, startIndex)
      result.push({
        tickArrayStartIndex: startIndex,
        tickArrayAddress: address,
      })
    }
    return result
  }

  public static searchLowBitFromStart(
    tickArrayBitmap: BN[],
    exTickArrayBitmap: TickArrayBitmapExtensionLayout,
    currentTickArrayBitStartIndex: number,
    expectedCount: number,
    tickSpacing: number,
  ) {
    const tickArrayBitmaps = [
      ...exTickArrayBitmap.negativeTickArrayBitmap.reverse(),
      tickArrayBitmap.slice(0, 8),
      tickArrayBitmap.slice(8, 16),
      ...exTickArrayBitmap.positiveTickArrayBitmap,
    ].map((i) => TickUtils.mergeTickArrayBitmap(i))
    const result: number[] = []
    while (currentTickArrayBitStartIndex >= -7680) {
      const arrayIndex = Math.floor((currentTickArrayBitStartIndex + 7680) / 512)
      const searchIndex = (currentTickArrayBitStartIndex + 7680) % 512

      if (tickArrayBitmaps[arrayIndex].testn(searchIndex)) result.push(currentTickArrayBitStartIndex)

      currentTickArrayBitStartIndex--
      if (result.length === expectedCount) break
    }

    const tickCount = TickQuery.tickCount(tickSpacing)
    return result.map((i) => i * tickCount)
  }

  public static searchHightBitFromStart(
    tickArrayBitmap: BN[],
    exTickArrayBitmap: TickArrayBitmapExtensionLayout,
    currentTickArrayBitStartIndex: number,
    expectedCount: number,
    tickSpacing: number,
  ) {
    const tickArrayBitmaps = [
      ...exTickArrayBitmap.negativeTickArrayBitmap.reverse(),
      tickArrayBitmap.slice(0, 8),
      tickArrayBitmap.slice(8, 16),
      ...exTickArrayBitmap.positiveTickArrayBitmap,
    ].map((i) => TickUtils.mergeTickArrayBitmap(i))
    const result: number[] = []
    while (currentTickArrayBitStartIndex < 7680) {
      const arrayIndex = Math.floor((currentTickArrayBitStartIndex + 7680) / 512)
      const searchIndex = (currentTickArrayBitStartIndex + 7680) % 512

      if (tickArrayBitmaps[arrayIndex].testn(searchIndex)) result.push(currentTickArrayBitStartIndex)

      currentTickArrayBitStartIndex++
      if (result.length === expectedCount) break
    }

    const tickCount = TickQuery.tickCount(tickSpacing)
    return result.map((i) => i * tickCount)
  }

  public static checkIsOutOfBoundary(tick: number): boolean {
    return tick < MIN_TICK || tick > MAX_TICK
  }

  public static nextInitTick(
    tickArrayCurrent: TickArray,
    currentTickIndex: number,
    tickSpacing: number,
    zeroForOne: boolean,
  ) {
    const currentTickArrayStartIndex = TickQuery.getArrayStartIndex(currentTickIndex, tickSpacing)
    if (currentTickArrayStartIndex != tickArrayCurrent.startTickIndex) {
      return null
    }
    let offsetInArray = Math.floor((currentTickIndex - tickArrayCurrent.startTickIndex) / tickSpacing)

    if (zeroForOne) {
      while (offsetInArray >= 0) {
        if (tickArrayCurrent.ticks[offsetInArray].liquidityGross.gtn(0)) {
          return tickArrayCurrent.ticks[offsetInArray]
        }
        offsetInArray = offsetInArray - 1
      }
    } else {
      offsetInArray = offsetInArray + 1
      while (offsetInArray < TICK_ARRAY_SIZE) {
        if (tickArrayCurrent.ticks[offsetInArray].liquidityGross.gtn(0)) {
          return tickArrayCurrent.ticks[offsetInArray]
        }
        offsetInArray = offsetInArray + 1
      }
    }
    return null
  }

  public static firstInitializedTick(tickArrayCurrent: TickArray, zeroForOne: boolean) {
    if (zeroForOne) {
      let i = TICK_ARRAY_SIZE - 1
      while (i >= 0) {
        if (tickArrayCurrent.ticks[i].liquidityGross.gtn(0)) {
          return tickArrayCurrent.ticks[i]
        }
        i = i - 1
      }
    } else {
      let i = 0
      while (i < TICK_ARRAY_SIZE) {
        if (tickArrayCurrent.ticks[i].liquidityGross.gtn(0)) {
          return tickArrayCurrent.ticks[i]
        }
        i = i + 1
      }
    }

    throw Error(`firstInitializedTick check error: ${tickArrayCurrent} - ${zeroForOne}`)
  }
}
