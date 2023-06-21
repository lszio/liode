type Literal = string | number | Symbol | boolean
type WithPrefix<K extends string, P extends string = ""> = K extends `[${infer _}]` ? `${P}${K}` : `${P}.${K}`

type FlattenArray<A extends Array<unknown>, P extends string = ""> = A extends Array<infer T> ? {
  [K in keyof A & number as `${P}[${K}]`]: T extends Literal ? T : FlattenObject<T, WithPrefix<`[${K}]`, P>>
} : never

type FlattenRecord<O extends object, P extends string = ""> =
  {
    [K in keyof O]:
    O[K] extends Literal
    ? { [KK in keyof O & string as `${P}${P extends '' ? '' : "."}${KK}`]: O[KK] }
    : K extends string
    ? FlattenObject<O[K], `${P}${P extends '' ? '' : "."}${K}`>
    : never
  }[keyof O]

export type FlattenObject<G, P extends string = ""> = G extends Array<unknown> ? FlattenArray<G, P> : G extends Record<string, unknown> ? FlattenRecord<G, P> : never
