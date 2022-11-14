import { BN, IdlAccounts, IdlTypes } from '@project-serum/anchor';
import { AmmV3 } from './idl/amm_v3';

export type AmmConfig = IdlAccounts<AmmV3>['ammConfig'];
export type PoolState = IdlAccounts<AmmV3>['poolState'];

export type TickArrayState = IdlAccounts<AmmV3>['tickArrayState'];
