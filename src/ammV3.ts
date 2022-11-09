import BN from 'bn.js'
import Decimal from 'decimal.js'

import { PublicKey } from '@solana/web3.js'

import { MAX_SQRT_PRICE_X64, MIN_SQRT_PRICE_X64, ONE } from './utils/constants'
import { SqrtPriceMath } from './utils/math'
import { PoolUtils } from './utils/pool'
import { TickArray } from './utils/tick'

interface ReturnTypeComputeAmountOut {
  amountOut: BN
  minAmountOut: BN
  currentPrice: Decimal
  executionPrice: Decimal
  priceImpact: number
  fee: BN
  remainingAccounts: PublicKey[]
}

export interface AmmV3ConfigInfo {
  id: PublicKey
  index: number
  protocolFeeRate: number
  tradeFeeRate: number
  tickSpacing: number
}

export interface AmmV3PoolRewardInfo {
  rewardState: number
  openTime: BN
  endTime: BN
  lastUpdateTime: BN
  emissionsPerSecondX64: BN
  rewardTotalEmissioned: BN
  rewardClaimed: BN
  tokenMint: PublicKey
  tokenVault: PublicKey
  authority: PublicKey
  rewardGrowthGlobalX64: BN
}
export interface AmmV3PoolInfo {
  id: PublicKey
  mintA: {
    mint: PublicKey
    vault: PublicKey
    decimals: number
  }
  mintB: {
    mint: PublicKey
    vault: PublicKey
    decimals: number
  }

  ammConfig: AmmV3ConfigInfo
  observationId: PublicKey

  programId: PublicKey

  tickSpacing: number
  liquidity: BN
  sqrtPriceX64: BN
  currentPrice: Decimal
  tickCurrent: number
  observationIndex: number
  observationUpdateDuration: number
  tickArrayBitmap: BN[]
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
    poolInfo: AmmV3PoolInfo
    tickArrayCache: { [key: string]: TickArray }
    baseMint: PublicKey

    amountIn: BN
    slippage: number
    priceLimit?: Decimal
  }): ReturnTypeComputeAmountOut {
    let sqrtPriceLimitX64: BN
    if (priceLimit.equals(new Decimal(0))) {
      sqrtPriceLimitX64 = baseMint.equals(poolInfo.mintA.mint)
        ? MIN_SQRT_PRICE_X64.add(ONE)
        : MAX_SQRT_PRICE_X64.sub(ONE)
    } else {
      sqrtPriceLimitX64 = SqrtPriceMath.priceToSqrtPriceX64(
        priceLimit,
        poolInfo.mintA.decimals,
        poolInfo.mintB.decimals
      )
    }

    const {
      expectedAmountOut,
      remainingAccounts,
      executionPrice: _executionPriceX64,
      feeAmount,
    } = PoolUtils.getOutputAmountAndRemainAccounts(poolInfo, tickArrayCache, baseMint, amountIn, sqrtPriceLimitX64)

    const _executionPrice = SqrtPriceMath.sqrtPriceX64ToPrice(
      _executionPriceX64,
      poolInfo.mintA.decimals,
      poolInfo.mintB.decimals
    )
    const executionPrice = baseMint.equals(poolInfo.mintA.mint) ? _executionPrice : new Decimal(1).div(_executionPrice)

    const minAmountOut = expectedAmountOut
      .mul(new BN(Math.floor((1 - slippage) * 10000000000)))
      .div(new BN(10000000000))

    const poolPrice = poolInfo.mintA.mint.equals(baseMint)
      ? poolInfo.currentPrice
      : new Decimal(1).div(poolInfo.currentPrice)
    const priceImpact =
      Math.abs(parseFloat(executionPrice.toFixed()) - parseFloat(poolPrice.toFixed())) / parseFloat(poolPrice.toFixed())

    return {
      amountOut: expectedAmountOut,
      minAmountOut,
      currentPrice: poolInfo.currentPrice,
      executionPrice,
      priceImpact,
      fee: feeAmount,

      remainingAccounts,
    }
  }
}
