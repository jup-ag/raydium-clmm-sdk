import BN from 'bn.js';
import Decimal from 'decimal.js';

import { PublicKey } from '@solana/web3.js';

import { MAX_SQRT_PRICE_X64, MIN_SQRT_PRICE_X64, ONE } from './utils/constants';
import { SqrtPriceMath } from './utils/math';
import { PoolUtils } from './utils/pool';
import { TickArray, TickUtils } from './utils/tick';
import { AmmConfig, PoolInfo } from './utils/layout';
import { FETCH_TICKARRAY_COUNT } from './utils/tickQuery';
import { getPdaTickArrayAddress } from './utils/pda';

interface ReturnTypeComputeAmountOut {
  amountOut: BN;
  minAmountOut: BN;
  currentPrice: Decimal;
  executionPrice: Decimal;
  priceImpact: number;
  fee: BN;
  remainingAccounts: PublicKey[];
}

export interface AmmV3ConfigInfo {
  id: PublicKey;
  index: number;
  protocolFeeRate: number;
  tradeFeeRate: number;
  tickSpacing: number;
}

export interface AmmV3PoolRewardInfo {
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
export interface AmmV3PoolInfo {
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

  ammConfig: AmmV3ConfigInfo;
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
}

export class AmmV3 {
  static computeAmountOut({
    poolInfo,
    tickArrayCache,
    baseMint,
    amountIn,
    slippage,
    priceLimit = new Decimal(0),
  }: {
    poolInfo: AmmV3PoolInfo;
    tickArrayCache: { [key: string]: TickArray };
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

  static getTickArraysPks(poolInfo: PoolInfo, programId: PublicKey): PublicKey[] {
    const tickArrayBitmap = TickUtils.mergeTickArrayBitmap(poolInfo.tickArrayBitmap);
    const currentTickArrayStartIndex = TickUtils.getTickArrayStartIndexByTick(
      poolInfo.tickCurrent,
      poolInfo.tickSpacing
    );

    const tickArrayPks: PublicKey[] = [];
    const startIndexArray = TickUtils.getInitializedTickArrayInRange(
      tickArrayBitmap,
      poolInfo.tickSpacing,
      currentTickArrayStartIndex,
      Math.floor(FETCH_TICKARRAY_COUNT / 2)
    );
    for (const itemIndex of startIndexArray) {
      const { publicKey: tickArrayAddress } = getPdaTickArrayAddress(programId, poolInfo.ammConfig, itemIndex);
      tickArrayPks.push(tickArrayAddress);
    }
    return tickArrayPks;
  }

  static formatPoolInfo({
    address,
    poolInfo,
    ammConfig,
    programId,
  }: {
    address: PublicKey;
    poolInfo: PoolInfo;
    ammConfig: AmmConfig;
    programId: PublicKey;
  }): AmmV3PoolInfo {
    return {
      id: address,
      mintA: {
        mint: poolInfo.mintA,
        vault: poolInfo.vaultA,
        decimals: poolInfo.mintDecimalsA,
      },
      mintB: {
        mint: poolInfo.mintB,
        vault: poolInfo.vaultB,
        decimals: poolInfo.mintDecimalsB,
      },
      observationId: poolInfo.observationId,
      ammConfig: {
        ...ammConfig,
        id: poolInfo.ammConfig,
      },

      programId,

      tickSpacing: poolInfo.tickSpacing,
      liquidity: poolInfo.liquidity,
      sqrtPriceX64: poolInfo.sqrtPriceX64,
      currentPrice: SqrtPriceMath.sqrtPriceX64ToPrice(
        poolInfo.sqrtPriceX64,
        poolInfo.mintDecimalsA,
        poolInfo.mintDecimalsB
      ),
      tickCurrent: poolInfo.tickCurrent,
      observationIndex: poolInfo.observationIndex,
      observationUpdateDuration: poolInfo.observationUpdateDuration,
      tickArrayBitmap: poolInfo.tickArrayBitmap,
    };
  }
}
