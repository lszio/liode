import { readFileObject, writeFileObject } from "../../utils";
import type { Database, FlatItem, Item, Source } from "./protocol";
import { homedir } from "os";

const database: Database = {
  meta: {
    sources: [
      {
        name: "local",
        with: [],
        detail: {
          path: new URL("../../../data/gal/local.yml", import.meta.url),
        },
      },
      {
        name: "sync",
        with: [],
        detail: {
          path: new URL(
            "file:///" + homedir() + "/Sync/Database/Labry/Gal/sync.yml"
          ),
        },
      },
    ],
  },
};

export type ComputeSource = [string, (db: Database) => Source];

const computeSources: ComputeSource[] = [
  [
    "@groups",
    (db: Database) => {
      const groups: Source = {};

      for (const k of Object.keys(db).filter((k) => !k.startsWith("@"))) {
        for (const g of Object.keys(db[k])) {
          const item = {
            name: g,
            with: [],
            detail: {},
          };
          if (groups[k]) {
            groups[k].push(item);
          } else {
            groups[k] = [item];
          }
        }
      }

      return groups;
    },
  ],
];

export const setDb = (updates: Database): Database => {
  for (const [k, v] of Object.entries(updates)) {
    database[k] = v;
  }

  for (const [key, compute] of computeSources) {
    database[key] = compute(database);
  }

  return database;
};

export const getDb = (...sources: string[]): Database => {
  if (sources.length === 0) return database;
  else {
    return sources.reduce<Database>((d, k) => ({ ...d, k: database[k] }), {});
  }
};

export const load = (...toLoad: string[]) => {
  const filter =
    toLoad.length === 0 ? () => true : (s: Item) => toLoad.includes(s.name);
  const sources = database.meta?.sources.filter(filter) ?? [];
  const updates: Database = {};
  for (const {
    name,
    detail: { path },
  } of sources) {
    updates[name] = readFileObject(path);
    console.log(`load ${name} from ${path}`);
  }

  setDb(updates);
};

export const save = (...toSave: string[]) => {
  const filter =
    toSave.length === 0 ? () => true : (s: Item) => toSave.includes(s.name);
  const sources = database.meta?.sources.filter(filter) ?? [];
  for (const {
    name,
    detail: { path },
  } of sources) {
    writeFileObject(database[name], path);
    console.log(`save ${name} to ${path}`);
  }
};

export function getSources(db: Database, ...names: string[]): Source[] {
  if (names.length === 0) {
    return Object.values(db);
  } else {
    return Object.entries(db)
      .filter(([k]) => names.includes(k))
      .map((v) => v[1]);
  }
}

export function filterWith(
  db: Database,
  option: {
    source?: string[];
    group?: string[];
    name?: string[];
    // with?: string[];
  }
): Database {
  console.log(option);
  const { source, group, name } = option;
  if (source && source.length !== 0) {
    const filterd = Object.fromEntries(
      Object.entries(db).filter(([k]) => option.source?.includes(k))
    );
    console.log(`filter with source: ${option.source?.join(", ")}`);
    delete option.source;
    return filterWith(filterd, option);
  } else if (group && group.length !== 0) {
    for (const k of Object.keys(db)) {
      db[k] = Object.fromEntries(
        Object.entries(db[k]).filter(([k]) => option.group?.includes(k))
      );
    }

    console.log(`filter with group: ${option.source?.join(", ")}`);
    delete option.group;
    return filterWith(db, option);
  } else if (name && name.length !== 0) {
    for (const s of Object.keys(db)) {
      for (const g of Object.keys(db[s])) {
        db[s][g] = db[s][g].filter((i: Item) => option.name?.includes(i.name));
      }
    }
    console.log(`filter with name: ${option.source?.join(", ")}`);
    return db;
  }

  return db;
}

export function flatDb(db: Database): FlatItem[] {
  const items: FlatItem[] = [];

  for (const s of Object.keys(db)) {
    for (const g of Object.keys(db[s])) {
      console.log(db[s][g]);
      for (const i of db[s][g]) {
        items.push({
          ...i,
          source: s,
          group: g,
        });
      }
    }
  }

  return items;
}
