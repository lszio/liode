export type Params = Record<string, string[]>;

export const fromSearchParams = (sp: URLSearchParams): Params => {
  const ps: Params = {};

  for (const k of new Set(sp.keys())) {
    ps[k] = sp.getAll(k);
  }

  return ps;
};

export const toSearchParams = (ps: Params): URLSearchParams => {
  const sp = new URLSearchParams();

  for (const [k, v] of Object.keys(ps)) {
    if (Array.isArray(v)) {
      for (const i of v) {
        sp.append(k, i);
      }
    } else {
      sp.append(k, v);
    }
  }

  return sp;
};
