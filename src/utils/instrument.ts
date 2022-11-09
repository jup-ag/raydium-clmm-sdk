import { bool, struct, u128, u64 } from "@project-serum/borsh";
import { TOKEN_PROGRAM_ID } from "@project-serum/serum/lib/token-instructions";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";

export function swapInstruction(
  programId: PublicKey,
  payer: PublicKey,
  poolId: PublicKey,
  ammConfigId: PublicKey,
  inputTokenAccount: PublicKey,
  outputTokenAccount: PublicKey,
  inputVault: PublicKey,
  outputVault: PublicKey,
  tickArray: PublicKey[],
  observationId: PublicKey,

  amount: BN,
  otherAmountThreshold: BN,
  sqrtPriceLimitX64: BN,
  isBaseInput: boolean
) {
  const dataLayout = struct([
    u64("amount"),
    u64("otherAmountThreshold"),
    u128("sqrtPriceLimitX64"),
    bool("isBaseInput"),
  ]);

  const keys = [
    { pubkey: payer, isSigner: true, isWritable: false },
    { pubkey: ammConfigId, isSigner: false, isWritable: false },

    { pubkey: poolId, isSigner: false, isWritable: true },
    { pubkey: inputTokenAccount, isSigner: false, isWritable: true },
    { pubkey: outputTokenAccount, isSigner: false, isWritable: true },
    { pubkey: inputVault, isSigner: false, isWritable: true },
    { pubkey: outputVault, isSigner: false, isWritable: true },

    { pubkey: observationId, isSigner: false, isWritable: true },

    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },

    ...tickArray
      .map((i) => ({ pubkey: i, isSigner: false, isWritable: true })),
  ];

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      amount,
      otherAmountThreshold,
      sqrtPriceLimitX64,
      isBaseInput,
    },
    data
  );

  const aData = Buffer.from([...[248, 198, 158, 145, 225, 117, 135, 200], ...data]);

  return new TransactionInstruction({
    keys,
    programId,
    data: aData,
  });
}
