import { PublicKey } from '@solana/web3.js';

import { getPdaTickArrayAddress } from './pda';
import { Tick, TICK_ARRAY_SIZE, TickArray, TickUtils } from './tick';
import BN from 'bn.js';
import { TickArrayBitmapExtensionLayout } from '../amm';
import { MAX_TICK, MIN_TICK } from './constants';

export const FETCH_TICKARRAY_COUNT = 15;

export declare type PoolVars = {
  key: PublicKey;
  tokenA: PublicKey;
  tokenB: PublicKey;
  fee: number;
};

export class TickQuery {
  public static nextInitializedTick(
    programId: PublicKey,
    poolId: PublicKey,
    tickArrayCache: { [key: string]: TickArray },
    tickIndex: number,
    tickSpacing: number,
    zeroForOne: boolean
  ) {
    let {
      initializedTick: nextTick,
      tickArrayAddress,
      tickArrayStartTickIndex,
    } = this.nextInitializedTickInOneArray(programId, poolId, tickArrayCache, tickIndex, tickSpacing, zeroForOne);
    while (nextTick == undefined || nextTick.liquidityGross.lten(0)) {
      tickArrayStartTickIndex = TickUtils.getNextTickArrayStartIndex(tickArrayStartTickIndex, tickSpacing, zeroForOne);
      if (this.checkIsValidStartIndex(tickArrayStartTickIndex, tickSpacing)) {
        throw new Error('No enough initialized tickArray');
      }
      const cachedTickArray = tickArrayCache[tickArrayStartTickIndex];

      if (cachedTickArray === undefined) continue;

      const {
        nextTick: _nextTick,
        tickArrayAddress: _tickArrayAddress,
        tickArrayStartTickIndex: _tickArrayStartTickIndex,
      } = this.firstInitializedTickInOneArray(programId, poolId, cachedTickArray, zeroForOne);
      [nextTick, tickArrayAddress, tickArrayStartTickIndex] = [_nextTick, _tickArrayAddress, _tickArrayStartTickIndex];
    }
    if (nextTick == undefined) {
      throw new Error('No invaild tickArray cache');
    }
    return { nextTick, tickArrayAddress, tickArrayStartTickIndex };
  }

  public static nextInitializedTickArray(
    tickIndex: number,
    tickSpacing: number,
    zeroForOne: boolean,
    tickArrayBitmap: BN[],
    exBitmapInfo: TickArrayBitmapExtensionLayout
  ) {
    const currentOffset = Math.floor(tickIndex / TickQuery.tickCount(tickSpacing))
    const result: number[] = zeroForOne
      ? TickUtils.searchLowBitFromStart(tickArrayBitmap, exBitmapInfo, currentOffset - 1, 1, tickSpacing)
      : TickUtils.searchHightBitFromStart(tickArrayBitmap, exBitmapInfo, currentOffset + 1, 1, tickSpacing);

    return result.length > 0 ? { isExist: true, nextStartIndex: result[0] } : { isExist: false, nextStartIndex: 0 };
  }

  public static firstInitializedTickInOneArray(
    programId: PublicKey,
    poolId: PublicKey,
    tickArray: TickArray,
    zeroForOne: boolean
  ) {
    let nextInitializedTick: Tick | undefined = undefined;
    if (zeroForOne) {
      let i = TICK_ARRAY_SIZE - 1;
      while (i >= 0) {
        const tickInArray = tickArray.ticks[i];
        if (tickInArray.liquidityGross.gtn(0)) {
          nextInitializedTick = tickInArray;
          break;
        }
        i = i - 1;
      }
    } else {
      let i = 0;
      while (i < TICK_ARRAY_SIZE) {
        const tickInArray = tickArray.ticks[i];
        if (tickInArray.liquidityGross.gtn(0)) {
          nextInitializedTick = tickInArray;
          break;
        }
        i = i + 1;
      }
    }
    const { publicKey: tickArrayAddress } = getPdaTickArrayAddress(programId, poolId, tickArray.startTickIndex);
    return { nextTick: nextInitializedTick, tickArrayAddress, tickArrayStartTickIndex: tickArray.startTickIndex };
  }

  public static nextInitializedTickInOneArray(
    programId: PublicKey,
    poolId: PublicKey,
    tickArrayCache: { [key: string]: TickArray },
    tickIndex: number,
    tickSpacing: number,
    zeroForOne: boolean
  ): {
    initializedTick: Tick | undefined;
    tickArrayAddress: PublicKey | undefined;
    tickArrayStartTickIndex: number;
  } {
    const startIndex = TickUtils.getTickArrayStartIndexByTick(tickIndex, tickSpacing);
    let tickPositionInArray = Math.floor((tickIndex - startIndex) / tickSpacing);
    const cachedTickArray = tickArrayCache[startIndex];
    if (cachedTickArray == undefined) {
      return {
        initializedTick: undefined,
        tickArrayAddress: undefined,
        tickArrayStartTickIndex: startIndex,
      };
    }
    let nextInitializedTick: Tick | undefined = undefined;
    if (zeroForOne) {
      while (tickPositionInArray >= 0) {
        const tickInArray = cachedTickArray.ticks[tickPositionInArray];
        if (tickInArray.liquidityGross.gtn(0)) {
          nextInitializedTick = tickInArray;
          break;
        }
        tickPositionInArray = tickPositionInArray - 1;
      }
    } else {
      tickPositionInArray = tickPositionInArray + 1;
      while (tickPositionInArray < TICK_ARRAY_SIZE) {
        const tickInArray = cachedTickArray.ticks[tickPositionInArray];
        if (tickInArray.liquidityGross.gtn(0)) {
          nextInitializedTick = tickInArray;
          break;
        }
        tickPositionInArray = tickPositionInArray + 1;
      }
    }
    const { publicKey: tickArrayAddress } = getPdaTickArrayAddress(programId, poolId, startIndex);
    return {
      initializedTick: nextInitializedTick,
      tickArrayAddress,
      tickArrayStartTickIndex: cachedTickArray.startTickIndex,
    };
  }

  public static getArrayStartIndex(tickIndex: number, tickSpacing: number) {
    const ticksInArray = this.tickCount(tickSpacing);
    const start = Math.floor(tickIndex / ticksInArray);

    return start * ticksInArray;
  }

  public static checkIsValidStartIndex(tickIndex: number, tickSpacing: number): boolean {
    if (TickUtils.checkIsOutOfBoundary(tickIndex)) {
      if (tickIndex > MAX_TICK) {
        return false;
      }
      const minStartIndex = TickUtils.getTickArrayStartIndexByTick(MIN_TICK, tickSpacing);
      return tickIndex == minStartIndex;
    }
    return tickIndex % this.tickCount(tickSpacing) == 0;
  }

  public static tickCount(tickSpacing: number): number {
    return TICK_ARRAY_SIZE * tickSpacing;
  }
}
