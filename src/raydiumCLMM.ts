import JSBI from 'jsbi';

import { AccountInfo, AccountMeta, PublicKey } from '@solana/web3.js';

import { AmmV3, AmmV3PoolInfo } from './ammV3';
import { AmmConfigLayout, PoolInfo, PoolInfoLayout, TickArrayLayout } from './utils/layout';
import { TickArray } from './utils/tick';
import { BN } from '@project-serum/anchor';

export class RaydiumSwapV3 implements Amm {
  label = 'Raydium' as const;
  id: string;
  reserveTokenMints: PublicKey[];
  hasDynamicAccounts = true;
  shouldPrefetch = false;
  exactOutputSupported = false;

  address: PublicKey;
  programId: PublicKey;
  poolInfo: PoolInfo;

  tickArrayPks: PublicKey[];
  tickArrayCache: { [key: string]: TickArray } = {};
  ammV3PoolInfo: AmmV3PoolInfo | undefined;

  constructor(address: PublicKey, accountInfo: AccountInfo<Buffer>) {
    this.id = address.toBase58();
    this.address = address;

    this.poolInfo = PoolInfoLayout.decode(accountInfo.data);
    this.reserveTokenMints = [this.poolInfo.mintA, this.poolInfo.mintB];
    this.programId = accountInfo.owner;
    this.tickArrayPks = AmmV3.getTickArrayPks(this.address, this.poolInfo, this.programId);
  }

  getAccountsForUpdate() {
    return [this.address, this.poolInfo.ammConfig, ...this.tickArrayPks];
  }

  update(accountInfoMap: Map<string, AccountInfo<Buffer>>) {
    const poolInfoAccountInfo = accountInfoMap.get(this.id);
    if (!poolInfoAccountInfo) throw new Error('Missing poolInfoAccountInfo');
    const ammConfigAccountInfo = accountInfoMap.get(this.poolInfo.ammConfig.toBase58());
    if (!ammConfigAccountInfo) throw new Error('Missing ammConfigAccoutnInfo');

    this.poolInfo = PoolInfoLayout.decode(poolInfoAccountInfo.data);
    const ammConfig = AmmConfigLayout.decode(ammConfigAccountInfo.data);

    this.tickArrayPks = AmmV3.getTickArrayPks(this.address, this.poolInfo, this.programId);
    const tickArrayCache: { [key: string]: TickArray } = {};
    for (const tickArrayPk of this.tickArrayPks) {
      const tickArrayAccountInfo = accountInfoMap.get(tickArrayPk.toBase58());
      if (!tickArrayAccountInfo) continue;
      const tickArray = TickArrayLayout.decode(tickArrayAccountInfo.data);
      tickArrayCache[tickArray.startTickIndex] = {
        ...tickArray,
        address: tickArrayPk,
      };
    }

    this.tickArrayCache = tickArrayCache;
    this.ammV3PoolInfo = AmmV3.formatPoolInfo({
      address: this.address,
      poolInfo: this.poolInfo,
      ammConfig,
      programId: this.programId,
    });
  }

  getQuote(quoteParams: QuoteParams) {
    if (quoteParams.swapMode !== 'ExactIn') throw Error('ExactOut does not support');
    if (!this.ammV3PoolInfo) throw new Error('Missing ammV3PoolInfo');

    const { amountOut, fee, priceImpact } = AmmV3.computeAmountOut({
      poolInfo: this.ammV3PoolInfo,
      tickArrayCache: this.tickArrayCache,
      baseMint: quoteParams.sourceMint,
      amountIn: new BN(quoteParams.amount.toString()),
      slippage: 0,
    });
    return {
      notEnoughLiquidity: false,
      inAmount: quoteParams.amount,
      outAmount: JSBI.BigInt(amountOut.toString()),
      feeAmount: JSBI.BigInt(fee.toString()),
      feeMint: quoteParams.sourceMint.toString(),
      feePct: this.ammV3PoolInfo.ammConfig.tradeFeeRate / 10 ** 6,
      priceImpactPct: priceImpact,
    };
  }

  getSwapLegAndAccounts(swapParams: SwapParams): [{}, AccountMeta[]] {
    if (!this.ammV3PoolInfo) throw new Error('Missing ammV3PoolInfo');

    // Note, the real call should prepend with swap accounts
    const { remainingAccounts } = AmmV3.computeAmountOut({
      poolInfo: this.ammV3PoolInfo,
      tickArrayCache: this.tickArrayCache,
      baseMint: swapParams.sourceMint,
      amountIn: new BN(swapParams.amount.toString()),
      slippage: 0,
    });
    return [
      {},
      remainingAccounts.map((pubkey) => ({
        pubkey,
        isSigner: false,
        isWritable: true,
      })),
    ];
  }
}

interface Amm {
  /* Label for UI usage */
  label: string;
  /* Unique id to recognize the AMM */
  id: string;
  /* Reserve token mints for the purpose of routing */
  reserveTokenMints: PublicKey[];
  hasDynamicAccounts: boolean;
  /* State if we need to prefetch the accounts 1 time */
  shouldPrefetch: boolean;
  /* Exact output swap mode is supported */
  exactOutputSupported: boolean;
  getAccountsForUpdate(): PublicKey[];
  update(accountInfoMap: Map<string, AccountInfo<Buffer>>): void;
  getQuote(quoteParams: QuoteParams): Quote;
  getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
}

enum SwapMode {
  ExactIn = 'ExactIn',
  ExactOut = 'ExactOut',
}

interface QuoteParams {
  sourceMint: PublicKey;
  destinationMint: PublicKey;
  amount: JSBI;
  swapMode: SwapMode;
}

interface Quote {
  notEnoughLiquidity: boolean;
  minInAmount?: JSBI;
  minOutAmount?: JSBI;
  inAmount: JSBI;
  outAmount: JSBI;
  feeAmount: JSBI;
  feeMint: string;
  feePct: number;
  priceImpactPct: number;
}

interface SwapParams {
  sourceMint: PublicKey;
  destinationMint: PublicKey;
  userSourceTokenAccount: PublicKey;
  userDestinationTokenAccount: PublicKey;
  userTransferAuthority: PublicKey;
  amount: JSBI;
  swapMode: SwapMode;
}

type SwapLegAndAccounts = [{}, AccountMeta[]];

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
