import { PublicKey } from '@solana/web3.js';

function i32ToBytes(num: number) {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setInt32(0, num, false);
  return new Uint8Array(arr);
}

const TICK_ARRAY_SEED = Buffer.from("tick_array", "utf8");

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
