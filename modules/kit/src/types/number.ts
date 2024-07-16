import type { GetTuple } from "./array";

export type NumberLike = number | `${number}`;

export type Add<A extends number, B extends number> = [
  ...GetTuple<A>,
  ...GetTuple<B>,
]["length"];
export type Sub<A extends number, B extends number> = GetTuple<A> extends [
  ...subs: GetTuple<B>,
  ...rest: infer R,
]
  ? R["length"]
  : never;
