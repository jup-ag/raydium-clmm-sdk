import { blob, Layout, Structure, u32, u8, union } from '@solana/buffer-layout';
import { u64 } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

class PublicKeyLayout extends Layout<PublicKey> {
  private layout: Layout<any>;

  constructor(property?: string) {
    const layout = blob(32);
    super(layout.span, property);
    this.layout = layout;
  }

  getSpan(b: Uint8Array, offset?: number) {
    return this.layout.getSpan(b, offset);
  }

  decode(b: Uint8Array, offset?: number): PublicKey {
    return new PublicKey(this.layout.decode(b, offset));
  }

  encode(src: PublicKey, b: Uint8Array, offset: number): number {
    return this.layout.encode(src.toBuffer(), b, offset);
  }
}

/**
 * Layout for a public key
 */
export const publicKey = (property: string) => new PublicKeyLayout(property);

class U64Layout extends Layout<u64> {
  private layout: Layout<any>;

  constructor(span = 8, property: string) {
    const layout = blob(span);
    super(layout.span, property);
    this.layout = layout;
  }

  getSpan(b: Uint8Array, offset?: number) {
    return this.layout.getSpan(b, offset);
  }

  decode(b: Uint8Array, offset?: number): u64 {
    //@ts-ignore
    const bn = new u64(this.layout.decode(b, offset), 10, 'le');

    return bn;
  }

  encode(src: u64, b: Uint8Array, offset: number): number {
    //@ts-ignore
    return this.layout.encode(src.toArrayLike(Buffer, 'le', this.layout.span), b, offset);
  }
}

/**
 * Layout for a 64bit unsigned value
 */
export const uint64 = (property: string) => new U64Layout(8, property);

export const uint128 = (property: string) => new U64Layout(16, property);

// TODO: Implement properly, this is fine as long as first bit isn't set
export const i32 = u32;
export const i128 = uint128;

export const rustEnum = (variants: Structure<any>[], property: string) => {
  // @ts-expect-error TODO: fix this
  const unionLayout = union(u8(), u8(), property);
  variants.forEach((variant, index) => unionLayout.addVariant(index, variant, variant.property || ''));
  return unionLayout;
};
