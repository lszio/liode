import { CanStringify } from "./string";

type Literal = string | number | symbol | boolean
type WithPrefix<K extends string, P extends string = ""> = K extends `[${infer _}]` ? `${P}${K}` : `${P}.${K}`

type FlattenArray<A extends Array<unknown>, P extends string = ""> = A extends Array<infer T> ? {
  [K in keyof A & number as `${P}[${K}]`]: T extends Literal ? T : FlattenObject<T, WithPrefix<`[${K}]`, P>>
} : never

type FlattenRecord<O extends object, P extends string = ""> =
  {
    [K in keyof O]:
    O[K] extends Literal
    ? { [KK in keyof O & string as `${P}${P extends "" ? "" : "."}${KK}`]: O[KK] }
    : K extends string
    ? FlattenObject<O[K], `${P}${P extends "" ? "" : "."}${K}`>
    : never
  }[keyof O]

export type FlattenObject<G, P extends string = ""> = G extends Array<unknown> ? FlattenArray<G, P> : G extends Record<string, unknown> ? FlattenRecord<G, P> : never

// TODO use positive number
type ArrayWithLengthHelper<T, L extends number, A extends Array<T> = []> = A["length"] extends L ? A : ArrayWithLengthHelper<T, L, [T, ...A]>
export type ArrayWithLength<T, L extends number = 0> = ArrayWithLengthHelper<T, L, []>
export type GetTuple<L extends number = 0> = ArrayWithLength<never, L>

export type Join<A extends CanStringify[], S extends string = ""> = A["length"] extends 0
  ? ""
  : A extends [infer First, ...infer Rest]
  ? First extends CanStringify
  ? Rest extends CanStringify[]
  ? `${First}${A["length"] extends 1 ? "" : S}${Join<Rest, S>}`
  : never
  : never
  : never
