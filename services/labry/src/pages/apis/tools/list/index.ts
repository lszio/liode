import { Effect } from "effect";
export * from "./action";
import { homedir } from "os";
import type { APIRoute } from "astro";
import { readFileObject, writeFileObject } from "../../../../utils/file";
import type { Database, Source } from "./protocol";

const sources: Record<string, string | URL> = {
  local: new URL("../../../../../data/list.yml", import.meta.url),
  sync: new URL("file:///" + homedir() + "/Sync/Database/Labry/list.yml"),
};

const db: Database = {};

const load = (...sections: string[]) => {
  if (sections.length === 0) sections = Object.keys(sources);
  for (const s of sections) {
    if (s in sources) {
      db[s] = readFileObject(sources[s]);
    }
  }
};

const save = (...sections: string[]) => {
  if (sections.length === 0) sections = Object.keys(sources);
  for (const s of sections) {
    if (s in sources) {
      writeFileObject(db[s], sources[s]);
    }
  }
};

export const GET: APIRoute = ({ request, params, url }) => {
  load();
  return new Response(JSON.stringify(db));
};

interface Param {
  action: string;
  dryrun?: boolean;
  reload?: boolean;
  payload: Record<string, string>;
}

export const POST: APIRoute = (option) => {
  return new Response(JSON.stringify("sadg"));
};
