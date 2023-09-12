import { PublicKey } from '@solana/web3.js';
import { i32ToBytes } from './utils';

const TICK_ARRAY_SEED = Buffer.from("tick_array", "utf8");
const POOL_TICK_ARRAY_BITMAP_SEED = Buffer.from('pool_tick_array_bitmap_extension', 'utf8');

function findProgramAddress(
  seeds: Array<Buffer | Uint8Array>,
  programId: PublicKey
) {
  const [publicKey, nonce] = PublicKey.findProgramAddressSync(
    seeds,
    programId
  )
  return { publicKey, nonce }
}

export function getPdaTickArrayAddress(
  programId: PublicKey,
  poolId: PublicKey,
  startIndex: number
) {
  const { publicKey, nonce } = findProgramAddress(
    [TICK_ARRAY_SEED, poolId.toBuffer(), i32ToBytes(startIndex)],
    programId
  );
  return { publicKey, nonce };
}

export function getPdaExBitmapAccount(programId: PublicKey, poolId: PublicKey) {
  return findProgramAddress([POOL_TICK_ARRAY_BITMAP_SEED, poolId.toBuffer()], programId)
}
