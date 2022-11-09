import BN from 'bn.js';
import JSBI from 'jsbi';

import { Amm } from '@jup-ag/core';
import {
  QuoteParams,
  SwapParams,
} from '@jup-ag/core/dist/lib/amm';
import { SwapLegType } from '@jup-ag/core/dist/lib/jupiterEnums';
import {
  AccountInfo,
  AccountMeta,
  PublicKey,
} from '@solana/web3.js';

import {
  AmmV3,
  AmmV3PoolInfo,
} from './utils/ammV3';
import {
  AmmConfigLayout,
  PoolInfoLayout,
  TickArrayLayout,
} from './utils/layout';
import { SqrtPriceMath } from './utils/math';
import { getPdaTickArrayAddress } from './utils/pda';
import {
  TickArray,
  TickUtils,
} from './utils/tick';
import { FETCH_TICKARRAY_COUNT } from './utils/tickQuery';

export class RaydiumSwapV3 implements Amm {
  label = 'Raydium' as const
  id
  address
  poolInfoBuffer: AccountInfo<Buffer>
  ammConfigBuffer: AccountInfo<Buffer> | undefined
  tickCacheData
  reserveTokenMints

  constructor(address: PublicKey, accountInfo: AccountInfo<Buffer>) {
    this.id = address.toBase58()
    this.address = address

    this.poolInfoBuffer = accountInfo

    const poolInfo = this.formatPoolInfo()

    this.reserveTokenMints = [poolInfo.mintA.mint, poolInfo.mintB.mint]

    this.tickCacheData = {}
  }

  formatPoolInfo(): AmmV3PoolInfo {
    const data = PoolInfoLayout.decode(this.poolInfoBuffer.data)
    const ammConfigInfo = this.ammConfigBuffer ? AmmConfigLayout.decode(this.ammConfigBuffer.data) : {}
    return {
      id: this.address,
      mintA: {
        mint: data.mintA,
        vault: data.vaultA,
        decimals: data.mintDecimalsA,
      },
      mintB: {
        mint: data.mintB,
        vault: data.vaultB,
        decimals: data.mintDecimalsB,
      },
      observationId: data.observationId,
      ammConfig: {
        ...ammConfigInfo,
        id: new PublicKey(data.ammConfig),
      },

      programId: this.poolInfoBuffer.owner,

      tickSpacing: data.tickSpacing,
      liquidity: data.liquidity,
      sqrtPriceX64: data.sqrtPriceX64,
      currentPrice: SqrtPriceMath.sqrtPriceX64ToPrice(data.sqrtPriceX64, data.mintDecimalsA, data.mintDecimalsB),
      tickCurrent: data.tickCurrent,
      observationIndex: data.observationIndex,
      observationUpdateDuration: data.observationUpdateDuration,
      tickArrayBitmap: data.tickArrayBitmap,
    }
  }

  getAccountsForUpdate() {
    const poolInfo = this.formatPoolInfo()

    const needUpdateAccounts = [this.address, poolInfo.ammConfig.id]

    const tickArrayBitmap = TickUtils.mergeTickArrayBitmap(
      poolInfo.tickArrayBitmap
    )
    const currentTickArrayStartIndex = TickUtils.getTickArrayStartIndexByTick(
      poolInfo.tickCurrent,
      poolInfo.tickSpacing
    )

    const startIndexArray = TickUtils.getInitializedTickArrayInRange(
      tickArrayBitmap,
      poolInfo.tickSpacing,
      currentTickArrayStartIndex,
      Math.floor(FETCH_TICKARRAY_COUNT / 2)
    )
    for (const itemIndex of startIndexArray) {
      const { publicKey: tickArrayAddress } = getPdaTickArrayAddress(
        poolInfo.programId,
        poolInfo.id,
        itemIndex
      )
      needUpdateAccounts.push(tickArrayAddress)
    }

    return needUpdateAccounts
  }

  update(accountInfoMap: Parameters<Amm['update']>[0]) {
    const ammConfigId = this.formatPoolInfo().ammConfig.id.toString()
    const tickCacheData: { [key: string]: TickArray } = {}

    for (const [address, accountInfo] of accountInfoMap.entries()) {
      if (accountInfo === null) continue

      if (address === this.id) {
        this.poolInfoBuffer = accountInfo
      } else if (address === ammConfigId) {
        this.ammConfigBuffer = accountInfo
      } else {
        const tickData = TickArrayLayout.decode(accountInfo.data)
        tickCacheData[tickData.startTickIndex] = {
          ...tickData,
          address: new PublicKey(address),
        }
      }
    }

    this.tickCacheData = tickCacheData
  }

  getQuote(quoteParams: QuoteParams) {
    if (quoteParams.swapMode !== 'ExactIn') throw Error('ExactOut does not support')
    const poolInfo = this.formatPoolInfo()
    try {
      const { amountOut, fee, priceImpact } = AmmV3.computeAmountOut({
        poolInfo: poolInfo,
        tickArrayCache: this.tickCacheData,
        baseMint: quoteParams.sourceMint,
        amountIn: new BN(quoteParams.amount.toString()),
        slippage: 0,
      })
      return {
        notEnoughLiquidity: false,
        inAmount: quoteParams.amount,
        outAmount: JSBI.BigInt(amountOut.toString()),
        feeAmount: JSBI.BigInt(fee.toString()),
        feeMint: quoteParams.sourceMint.toString(),
        feePct: poolInfo.ammConfig.tradeFeeRate / 10 ** 6,
        priceImpactPct: priceImpact,
      }
    } catch (e) {
      return {
        notEnoughLiquidity: true,
        inAmount: quoteParams.amount,
        outAmount: JSBI.BigInt(0),
        feeAmount: JSBI.BigInt(0),
        feeMint: quoteParams.sourceMint.toString(),
        feePct: 0,
        priceImpactPct: 0,
      }
    }
  }

  getSwapLegAndAccounts(swapParams: SwapParams): [SwapLegType, AccountMeta[]] {
    try {
      const poolInfo = this.formatPoolInfo()
      const { remainingAccounts } = AmmV3.computeAmountOut({
        poolInfo,
        tickArrayCache: this.tickCacheData,
        baseMint: swapParams.sourceMint,
        amountIn: new BN(swapParams.amount.toString()),
        slippage: 0,
      })
      return [
        {},
        remainingAccounts.map((i) => ({
          pubkey: i,
          isSigner: false,
          isWritable: true,
        })),
      ]
    } catch (e) {
      return [{}, []]
    }
  }
}

// ; (async () => {
//   const poolId = new PublicKey('61R1ndXxvsWXXkWSyNkCxnzwd3zUNB8Q2ibmkiLPC8ht')
//   const conn = new Connection(rpcUrl)
//   const poolInfo = await conn.getAccountInfo(poolId)
//   if (poolInfo === null) {
//     console.log('no info')
//     return
//   }

//   const jup = new RaydiumSwapV3(poolId, poolInfo)
//   const needUpdateAccounts = jup.getAccountsForUpdate()
//   console.log('needUpdateAccounts', needUpdateAccounts)
//   const mulitAccount = await conn.getMultipleAccountsInfo(needUpdateAccounts)
//   const accountMap: Map<string, AccountInfo<Buffer> | null> = new Map()
//   for (let i = 0; i < mulitAccount.length; i++) {
//     accountMap.set(needUpdateAccounts[i].toString(), mulitAccount[i] as AccountInfo<Buffer> || null)
//   }
//   jup.update(accountMap)

//   console.log(jup.getQuote({
//     sourceMint: new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'),
//     destinationMint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
//     amount: JSBI.BigInt('123123'),
//     // @ts-ignore
//     swapMode: 'ExactIn' as const
//   }))

// })()
