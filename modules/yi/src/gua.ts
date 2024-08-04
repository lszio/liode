import type { IntegerRange } from "@liode/kit";

export type Unigram = 0 | 1;
export type Bigram = IntegerRange<0, 3>;
export type Trigram = IntegerRange<0, 7>;
export type Hexagram = IntegerRange<0, 63>;

export type Yao = Unigram;
export type Gua = Trigram | Hexagram;

export const trigrams = new Array(8).fill(null).map((_, i) => i);
export const hexagrams = new Array(64);

export function shape(
  gram: IntegerRange<0, 63>,
  level: 1 | 2 | 3 | 6 = 3,
): string {
  if (gram < 8) {
    return String.fromCharCode(0x268a);
  }

  switch (level) {
    case 1:
      if (gram < 2) return String.fromCharCode(0x268a + gram);
      throw new Error("wrong number");
    case 3:
      if (gram < 8) return String.fromCharCode(0x2630 + gram);
      throw new Error("wrong number");
    default:
      throw new Error("TODO");
  }
}
