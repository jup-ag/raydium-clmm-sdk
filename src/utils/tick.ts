import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { TickArrayState } from '../types';

export const TICK_ARRAY_SIZE = 60;
export const TICK_ARRAY_BITMAP_SIZE = 1024;

export type Tick = {
  tick: number;
  liquidityNet: BN;
  liquidityGross: BN;
  feeGrowthOutsideX64A: BN;
  feeGrowthOutsideX64B: BN;
  rewardGrowthsOutsideX64: BN[];
};

export type TickArray = TickArrayState & { address: PublicKey };

export class TickUtils {
  public static getTickArrayStartIndexByTick(tickIndex: number, tickSpacing: number) {
    let startIndex: number = tickIndex / (TICK_ARRAY_SIZE * tickSpacing);
    if (tickIndex < 0 && tickIndex % (TICK_ARRAY_SIZE * tickSpacing) != 0) {
      startIndex = Math.ceil(startIndex) - 1;
    } else {
      startIndex = Math.floor(startIndex);
    }
    return startIndex * (tickSpacing * TICK_ARRAY_SIZE);
  }

  public static getTickArrayOffsetInBitmapByTick(tick: number, tickSpacing: number) {
    const multiplier = tickSpacing * TICK_ARRAY_SIZE;
    const compressed = Math.floor(tick / multiplier) + 512;
    return Math.abs(compressed);
  }

  public static checkTickArrayIsInitialized(bitmap: BN, tick: number, tickSpacing: number) {
    const multiplier = tickSpacing * TICK_ARRAY_SIZE;
    const compressed = Math.floor(tick / multiplier) + 512;
    const bit_pos = Math.abs(compressed);
    return {
      isInitialized: bitmap.testn(bit_pos),
      startIndex: (bit_pos - 512) * multiplier,
    };
  }

  public static getNextTickArrayStartIndex(lastTickArrayStartIndex: number, tickSpacing: number, zeroForOne: boolean) {
    return zeroForOne
      ? lastTickArrayStartIndex - tickSpacing * TICK_ARRAY_SIZE
      : lastTickArrayStartIndex + tickSpacing * TICK_ARRAY_SIZE;
  }

  public static mergeTickArrayBitmap(bns: BN[]) {
    return bns[0]
      .add(bns[1].shln(64))
      .add(bns[2].shln(128))
      .add(bns[3].shln(192))
      .add(bns[4].shln(256))
      .add(bns[5].shln(320))
      .add(bns[6].shln(384))
      .add(bns[7].shln(448))
      .add(bns[8].shln(512))
      .add(bns[9].shln(576))
      .add(bns[10].shln(640))
      .add(bns[11].shln(704))
      .add(bns[12].shln(768))
      .add(bns[13].shln(832))
      .add(bns[14].shln(896))
      .add(bns[15].shln(960));
  }

  public static getInitializedTickArrayInRange(
    tickArrayBitmap: BN,
    tickSpacing: number,
    tickArrayStartIndex: number,
    expectedCount: number
  ) {
    if (tickArrayStartIndex % (tickSpacing * TICK_ARRAY_SIZE) != 0) {
      throw new Error('Invild tickArrayStartIndex');
    }
    const tickArrayOffset = Math.floor(tickArrayStartIndex / (tickSpacing * TICK_ARRAY_SIZE)) + 512;
    return [
      // find right of currenct offset
      ...TickUtils.searchLowBitFromStart(tickArrayBitmap, tickArrayOffset - 1, 0, expectedCount, tickSpacing),

      // find left of current offset
      ...TickUtils.searchHightBitFromStart(
        tickArrayBitmap,
        tickArrayOffset,
        TICK_ARRAY_BITMAP_SIZE,
        expectedCount,
        tickSpacing
      ),
    ];
  }

  public static searchLowBitFromStart(
    tickArrayBitmap: BN,
    start: number,
    end: number,
    expectedCount: number,
    tickSpacing: number
  ) {
    let fetchNum = 0;
    const result: number[] = [];
    for (let i = start; i >= end; i--) {
      if (tickArrayBitmap.shrn(i).and(new BN(1)).eqn(1)) {
        const nextStartIndex = (i - 512) * (tickSpacing * TICK_ARRAY_SIZE);
        result.push(nextStartIndex);
        fetchNum++;
      }
      if (fetchNum >= expectedCount) {
        break;
      }
    }
    return result;
  }

  public static searchHightBitFromStart(
    tickArrayBitmap: BN,
    start: number,
    end: number,
    expectedCount: number,
    tickSpacing: number
  ) {
    let fetchNum = 0;
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      if (tickArrayBitmap.shrn(i).and(new BN(1)).eqn(1)) {
        const nextStartIndex = (i - 512) * (tickSpacing * TICK_ARRAY_SIZE);
        result.push(nextStartIndex);
        fetchNum++;
      }
      if (fetchNum >= expectedCount) {
        break;
      }
    }
    return result;
  }
}
