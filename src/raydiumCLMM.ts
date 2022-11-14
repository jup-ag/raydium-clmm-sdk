import JSBI from 'jsbi';

import { AccountInfo, AccountMeta, PublicKey } from '@solana/web3.js';

import { Amm, AmmV3PoolInfo } from './amm';
import { TickArray } from './utils/tick';
import { BN, BorshAccountsCoder } from '@project-serum/anchor';
import { PoolState } from './types';
import { IDL, AmmV3 as AmmV3Idl } from './idl/amm_v3';

export class RaydiumSwapV3 implements Amm {
  label = 'Raydium' as const;
  id: string;
  reserveTokenMints: PublicKey[];
  hasDynamicAccounts = true;
  shouldPrefetch = false;
  exactOutputSupported = false;

  private programId: PublicKey;
  private poolState: PoolState;
  private coder: BorshAccountsCoder;

  tickArrayPks: PublicKey[];
  tickArrayCache: { [key: string]: TickArray } = {};
  ammV3PoolInfo: AmmV3PoolInfo | undefined;

  constructor(private address: PublicKey, accountInfo: AccountInfo<Buffer>) {
    this.id = address.toBase58();
    this.address = address;

    this.coder = new BorshAccountsCoder(IDL as AmmV3Idl);

    this.poolState = this.coder.decode('poolState', accountInfo.data);
    this.reserveTokenMints = [this.poolState.tokenMint0, this.poolState.tokenMint1];
    this.programId = accountInfo.owner;
    this.tickArrayPks = Amm.getTickArrayPks(this.address, this.poolState, this.programId);
  }

  getAccountsForUpdate() {
    return [this.address, this.poolState.ammConfig, ...this.tickArrayPks];
  }

  update(accountInfoMap: Map<string, AccountInfo<Buffer>>) {
    const poolStateAccountInfo = accountInfoMap.get(this.id);
    if (!poolStateAccountInfo) throw new Error('Missing poolStateAccountInfo');
    const ammConfigAccountInfo = accountInfoMap.get(this.poolState.ammConfig.toBase58());
    if (!ammConfigAccountInfo) throw new Error('Missing ammConfigAccoutnInfo');

    this.poolState = this.coder.decode('poolState', poolStateAccountInfo.data);
    const ammConfig = this.coder.decode('ammConfig', ammConfigAccountInfo.data);

    this.tickArrayPks = Amm.getTickArrayPks(this.address, this.poolState, this.programId);
    const tickArrayCache: { [key: string]: TickArray } = {};
    for (const tickArrayPk of this.tickArrayPks) {
      const tickArrayAccountInfo = accountInfoMap.get(tickArrayPk.toBase58());
      if (!tickArrayAccountInfo) continue;
      const tickArray = this.coder.decode('tickArrayState', tickArrayAccountInfo.data);
      tickArrayCache[tickArray.startTickIndex] = {
        ...tickArray,
        address: tickArrayPk,
      };
    }

    this.tickArrayCache = tickArrayCache;
    this.ammV3PoolInfo = Amm.formatPoolInfo({
      address: this.address,
      poolState: this.poolState,
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
    const { remainingAccounts } = Amm.computeAmountOut({
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
