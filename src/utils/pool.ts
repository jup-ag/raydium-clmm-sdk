import BN from 'bn.js';

import { PublicKey } from '@solana/web3.js';

import { AmmV3PoolInfo } from '../amm';
import { NEGATIVE_ONE } from './constants';
import { SwapMath } from './math';
import { getPdaTickArrayAddress } from './pda';
import {
  TickArray,
  TickUtils,
} from './tick';

export class PoolUtils {
  public static getOutputAmountAndRemainAccounts(
    poolInfo: AmmV3PoolInfo,
    tickArrayCache: { [key: string]: TickArray },
    inputTokenMint: PublicKey,
    inputAmount: BN,
    sqrtPriceLimitX64?: BN
  ) {
    const zeroForOne = inputTokenMint.equals(poolInfo.mintA.mint);

    const allNeededAccounts: PublicKey[] = [];
    const {
      isExist,
      startIndex: firstTickArrayStartIndex,
      nextAccountMeta,
    } = this.getFirstInitializedTickArray(poolInfo, zeroForOne);
    if (!isExist || firstTickArrayStartIndex === undefined || !nextAccountMeta) {
      throw new Error('Invalid tick array');
    }

    try {
      const preTick = this.preInitializedTickArrayStartIndex(poolInfo, !zeroForOne)
      if (isExist) {
        const { publicKey: address } = getPdaTickArrayAddress(
          poolInfo.programId,
          poolInfo.id,
          preTick.nextStartIndex
        );
        allNeededAccounts.push(address)
      }
    } catch (e) { }

    allNeededAccounts.push(nextAccountMeta);
    const {
      amountCalculated: outputAmount,
      accounts: reaminAccounts,
      sqrtPriceX64: executionPrice,
      feeAmount,
    } = SwapMath.swapCompute(
      poolInfo.programId,
      poolInfo.id,
      tickArrayCache,
      zeroForOne,
      poolInfo.ammConfig.tradeFeeRate,
      poolInfo.liquidity,
      poolInfo.tickCurrent,
      poolInfo.tickSpacing,
      poolInfo.sqrtPriceX64,
      inputAmount,
      firstTickArrayStartIndex,
      sqrtPriceLimitX64
    );
    allNeededAccounts.push(...reaminAccounts);
    return {
      expectedAmountOut: outputAmount.mul(NEGATIVE_ONE),
      remainingAccounts: allNeededAccounts,
      executionPrice,
      feeAmount,
    };
  }

  public static getInputAmountAndRemainAccounts(
    poolInfo: AmmV3PoolInfo,
    tickArrayCache: { [key: string]: TickArray },
    outputTokenMint: PublicKey,
    outputAmount: BN,
    sqrtPriceLimitX64?: BN,
  ) {
    const zeroForOne = outputTokenMint.equals(poolInfo.mintB.mint);

    const allNeededAccounts: PublicKey[] = [];
    const { isExist, startIndex: firstTickArrayStartIndex, nextAccountMeta } = this.getFirstInitializedTickArray(poolInfo, zeroForOne);
    if (!isExist || firstTickArrayStartIndex === undefined || !nextAccountMeta) throw new Error("Invalid tick array");

    try {
      const preTick = this.preInitializedTickArrayStartIndex(poolInfo, !zeroForOne)
      if (isExist) {
        const { publicKey: address } = getPdaTickArrayAddress(
          poolInfo.programId,
          poolInfo.id,
          preTick.nextStartIndex
        );
        allNeededAccounts.push(address)
      }
    } catch (e) { }

    allNeededAccounts.push(nextAccountMeta);
    const {
      amountCalculated: inputAmount,
      accounts: reaminAccounts,
      sqrtPriceX64: executionPrice,
      feeAmount
    } = SwapMath.swapCompute(
      poolInfo.programId,
      poolInfo.id,
      tickArrayCache,
      zeroForOne,
      poolInfo.ammConfig.tradeFeeRate,
      poolInfo.liquidity,
      poolInfo.tickCurrent,
      poolInfo.tickSpacing,
      poolInfo.sqrtPriceX64,
      outputAmount.mul(NEGATIVE_ONE),
      firstTickArrayStartIndex,
      sqrtPriceLimitX64
    );
    allNeededAccounts.push(...reaminAccounts);
    return { expectedAmountIn: inputAmount, remainingAccounts: allNeededAccounts, executionPrice, feeAmount };
  }

  public static getFirstInitializedTickArray(
    poolInfo: AmmV3PoolInfo,
    zeroForOne: boolean
  ):
    | { isExist: true; startIndex: number; nextAccountMeta: PublicKey }
    | { isExist: false; startIndex: undefined; nextAccountMeta: undefined } {
    const tickArrayBitmap = TickUtils.mergeTickArrayBitmap(poolInfo.tickArrayBitmap);
    const { isInitialized, startIndex } = TickUtils.checkTickArrayIsInitialized(
      tickArrayBitmap,
      poolInfo.tickCurrent,
      poolInfo.tickSpacing
    );
    if (isInitialized) {
      const { publicKey: address } = getPdaTickArrayAddress(poolInfo.programId, poolInfo.id, startIndex);
      return {
        isExist: true,
        startIndex,
        nextAccountMeta: address,
      };
    }
    const { isExist, nextStartIndex } = this.nextInitializedTickArrayStartIndex(poolInfo, zeroForOne);
    if (isExist) {
      const { publicKey: address } = getPdaTickArrayAddress(poolInfo.programId, poolInfo.id, nextStartIndex);
      return {
        isExist: true,
        startIndex: nextStartIndex,
        nextAccountMeta: address,
      };
    }
    return { isExist: false, nextAccountMeta: undefined, startIndex: undefined };
  }

  public static nextInitializedTickArrayStartIndex(poolInfo: AmmV3PoolInfo, zeroForOne: boolean) {
    const tickArrayBitmap = TickUtils.mergeTickArrayBitmap(poolInfo.tickArrayBitmap);
    const currentOffset = TickUtils.getTickArrayOffsetInBitmapByTick(poolInfo.tickCurrent, poolInfo.tickSpacing);
    const result: number[] = zeroForOne
      ? TickUtils.searchLowBitFromStart(tickArrayBitmap, currentOffset - 1, 0, 1, poolInfo.tickSpacing)
      : TickUtils.searchHightBitFromStart(tickArrayBitmap, currentOffset, 1024, 1, poolInfo.tickSpacing);

    return result.length > 0 ? { isExist: true, nextStartIndex: result[0] } : { isExist: false, nextStartIndex: 0 };
  }

  public static preInitializedTickArrayStartIndex(
    poolInfo: AmmV3PoolInfo,
    zeroForOne: boolean) {
    const tickArrayBitmap = TickUtils.mergeTickArrayBitmap(
      poolInfo.tickArrayBitmap
    );
    const currentOffset = TickUtils.getTickArrayOffsetInBitmapByTick(
      poolInfo.tickCurrent,
      poolInfo.tickSpacing
    );
    const result: number[] = zeroForOne ? TickUtils.searchLowBitFromStart(
      tickArrayBitmap,
      currentOffset - 1,
      0,
      1,
      poolInfo.tickSpacing
    ) : TickUtils.searchHightBitFromStart(
      tickArrayBitmap,
      currentOffset + 1,
      1024,
      1,
      poolInfo.tickSpacing
    );

    return result.length > 0 ? { isExist: true, nextStartIndex: result[0] } : { isExist: false, nextStartIndex: 0 }
  }
}
