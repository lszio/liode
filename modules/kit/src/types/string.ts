export type CanStringify =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined;

export type Stringify<T extends CanStringify> = `${T}`;
export type ToString<T extends CanStringify> = Stringify<T>;
