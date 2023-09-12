import BN from 'bn.js';
import Decimal from 'decimal.js';

import { PublicKey } from '@solana/web3.js';

import {
  AmmConfig,
  PoolState,
  TickArrayState,
} from './types';
import {
  MAX_SQRT_PRICE_X64,
  MIN_SQRT_PRICE_X64,
  ONE,
} from './utils/constants';
import { SqrtPriceMath } from './utils/math';
import { getPdaTickArrayAddress } from './utils/pda';
import { PoolUtils } from './utils/pool';
import { TickUtils } from './utils/tick';
import { FETCH_TICKARRAY_COUNT } from './utils/tickQuery';

interface ReturnTypeComputeAmountOut {
  amountOut: BN;
  minAmountOut: BN;
  currentPrice: Decimal;
  executionPrice: Decimal;
  priceImpact: number;
  fee: BN;
  remainingAccounts: PublicKey[];
}
interface ReturnTypeComputeAmountOutBaseOut {
  amountIn: BN,
  maxAmountIn: BN,
  currentPrice: Decimal,
  executionPrice: Decimal,
  priceImpact: number,
  fee: BN,
  remainingAccounts: PublicKey[]
}

export interface ClmmConfigInfo {
  id: PublicKey;
  index: number;
  protocolFeeRate: number;
  tradeFeeRate: number;
  tickSpacing: number;
}

export interface ClmmPoolRewardInfo {
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
export interface ClmmPoolInfo {
  id: PublicKey;
  mintA: {
    mint: PublicKey;
    vault: PublicKey;
    decimals: number;
  };
  mintB: {
    mint: PublicKey;
    vault: PublicKey;
    decimals: number;
  };

  ammConfig: ClmmConfigInfo;
  observationId: PublicKey;

  programId: PublicKey;

  tickSpacing: number;
  liquidity: BN;
  sqrtPriceX64: BN;
  currentPrice: Decimal;
  tickCurrent: number;
  observationIndex: number;
  observationUpdateDuration: number;
  tickArrayBitmap: BN[];

  exBitmapInfo: TickArrayBitmapExtensionLayout;
}
export interface TickArrayBitmapExtensionLayout {
  poolId: PublicKey
  positiveTickArrayBitmap: BN[][]
  negativeTickArrayBitmap: BN[][]
}
export interface ReturnTypeFetchExBitmaps {
  [exBitmapId: string]: TickArrayBitmapExtensionLayout
}

export class Amm {
  static computeAmountOut({
    poolInfo,
    tickArrayCache,
    baseMint,
    amountIn,
    slippage,
    priceLimit = new Decimal(0),
  }: {
    poolInfo: ClmmPoolInfo;
    tickArrayCache: { [key: string]: TickArrayState & { address: PublicKey } };
    baseMint: PublicKey;

    amountIn: BN;
    slippage: number;
    priceLimit?: Decimal;
  }): ReturnTypeComputeAmountOut {
    let sqrtPriceLimitX64: BN;
    if (priceLimit.equals(new Decimal(0))) {
      sqrtPriceLimitX64 = baseMint.equals(poolInfo.mintA.mint)
        ? MIN_SQRT_PRICE_X64.add(ONE)
        : MAX_SQRT_PRICE_X64.sub(ONE);
    } else {
      sqrtPriceLimitX64 = SqrtPriceMath.priceToSqrtPriceX64(
        priceLimit,
        poolInfo.mintA.decimals,
        poolInfo.mintB.decimals
      );
    }

    const {
      expectedAmountOut,
      remainingAccounts,
      executionPrice: _executionPriceX64,
      feeAmount,
    } = PoolUtils.getOutputAmountAndRemainAccounts(poolInfo, tickArrayCache, baseMint, amountIn, sqrtPriceLimitX64);

    const _executionPrice = SqrtPriceMath.sqrtPriceX64ToPrice(
      _executionPriceX64,
      poolInfo.mintA.decimals,
      poolInfo.mintB.decimals
    );
    const executionPrice = baseMint.equals(poolInfo.mintA.mint) ? _executionPrice : new Decimal(1).div(_executionPrice);

    const minAmountOut = expectedAmountOut
      .mul(new BN(Math.floor((1 - slippage) * 10000000000)))
      .div(new BN(10000000000));

    const poolPrice = poolInfo.mintA.mint.equals(baseMint)
      ? poolInfo.currentPrice
      : new Decimal(1).div(poolInfo.currentPrice);
    const priceImpact =
      Math.abs(parseFloat(executionPrice.toFixed()) - parseFloat(poolPrice.toFixed())) /
      parseFloat(poolPrice.toFixed());

    return {
      amountOut: expectedAmountOut,
      minAmountOut,
      currentPrice: poolInfo.currentPrice,
      executionPrice,
      priceImpact,
      fee: feeAmount,

      remainingAccounts,
    };
  }

  static computeAmountIn(
    { poolInfo, tickArrayCache, baseMint, amountOut, slippage, priceLimit = new Decimal(0) }: {
      poolInfo: ClmmPoolInfo,
      tickArrayCache: { [key: string]: TickArrayState & { address: PublicKey } },
      baseMint: PublicKey,

      amountOut: BN,
      slippage: number,
      priceLimit?: Decimal
    }
  ): ReturnTypeComputeAmountOutBaseOut {
    let sqrtPriceLimitX64: BN;
    if (priceLimit.equals(new Decimal(0))) {
      sqrtPriceLimitX64 = baseMint.equals(poolInfo.mintB.mint)
        ? MIN_SQRT_PRICE_X64.add(ONE)
        : MAX_SQRT_PRICE_X64.sub(ONE);
    } else {
      sqrtPriceLimitX64 = SqrtPriceMath.priceToSqrtPriceX64(
        priceLimit,
        poolInfo.mintA.decimals,
        poolInfo.mintB.decimals
      );
    }

    const { expectedAmountIn, remainingAccounts, executionPrice: _executionPriceX64, feeAmount } = PoolUtils.getInputAmountAndRemainAccounts(
      poolInfo,
      tickArrayCache,
      baseMint,
      amountOut,
      sqrtPriceLimitX64
    );

    const _executionPrice = SqrtPriceMath.sqrtPriceX64ToPrice(_executionPriceX64, poolInfo.mintA.decimals, poolInfo.mintB.decimals)
    const executionPrice = baseMint.equals(poolInfo.mintA.mint) ? _executionPrice : new Decimal(1).div(_executionPrice)

    const maxAmountIn = expectedAmountIn.mul(new BN(Math.floor((1 + slippage) * 10000000000))).div(new BN(10000000000));

    const poolPrice = poolInfo.mintA.mint.equals(baseMint) ? poolInfo.currentPrice : new Decimal(1).div(poolInfo.currentPrice)
    const priceImpact = Math.abs(parseFloat(executionPrice.toFixed()) - parseFloat(poolPrice.toFixed())) /
      parseFloat(poolPrice.toFixed());

    return {
      amountIn: expectedAmountIn,
      maxAmountIn,
      currentPrice: poolInfo.currentPrice,
      executionPrice,
      priceImpact,
      fee: feeAmount,

      remainingAccounts
    }
  }

  static getTickArrayPks(address: PublicKey, poolState: PoolState, programId: PublicKey, exTickArrayBitmap: TickArrayBitmapExtensionLayout): PublicKey[] {
    const currentTickArrayStartIndex = TickUtils.getTickArrayStartIndexByTick(
      poolState.tickCurrent,
      poolState.tickSpacing
    );

    const tickArrayPks: PublicKey[] = [];
    const startIndexArray = TickUtils.getInitializedTickArrayInRange(
      poolState.tickArrayBitmap,
      exTickArrayBitmap,
      poolState.tickSpacing,
      currentTickArrayStartIndex,
      Math.floor(FETCH_TICKARRAY_COUNT / 2)
    );
    for (const itemIndex of startIndexArray) {
      const { publicKey: tickArrayAddress } = getPdaTickArrayAddress(programId, address, itemIndex);
      tickArrayPks.push(tickArrayAddress);
    }
    return tickArrayPks;
  }

  static formatPoolInfo({
    address,
    poolState,
    ammConfig,
    programId,
    exTickArrayBitmap,
  }: {
    address: PublicKey;
    poolState: PoolState;
    ammConfig: AmmConfig;
    programId: PublicKey;
    exTickArrayBitmap: TickArrayBitmapExtensionLayout
  }): ClmmPoolInfo {
    return {
      id: address,
      mintA: {
        mint: poolState.tokenMint0,
        vault: poolState.tokenVault0,
        decimals: poolState.mintDecimals0,
      },
      mintB: {
        mint: poolState.tokenMint1,
        vault: poolState.tokenVault1,
        decimals: poolState.mintDecimals1,
      },
      observationId: poolState.observationKey,
      ammConfig: {
        ...ammConfig,
        id: poolState.ammConfig,
      },

      programId,

      tickSpacing: poolState.tickSpacing,
      liquidity: poolState.liquidity,
      sqrtPriceX64: poolState.sqrtPriceX64,
      currentPrice: SqrtPriceMath.sqrtPriceX64ToPrice(
        poolState.sqrtPriceX64,
        poolState.mintDecimals0,
        poolState.mintDecimals1
      ),
      tickCurrent: poolState.tickCurrent,
      observationIndex: poolState.observationIndex,
      observationUpdateDuration: poolState.observationUpdateDuration,
      tickArrayBitmap: poolState.tickArrayBitmap,

      exBitmapInfo: exTickArrayBitmap,
    };
  }
}
