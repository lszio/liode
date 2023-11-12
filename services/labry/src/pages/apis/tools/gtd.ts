import { Effect } from "effect";
import { homedir } from "os";
import { readFileSync } from "fs";
import { parse } from "yaml";
import type { APIRoute } from "astro";
import { readFileObject, writeFileObject } from "../../../utils/file";

export interface Source {
  name: string;
  url: URL;
}

const sources: Source[] = [
  {
    name: "user",
    url: new URL("file:///" + homedir() + "/.config/labry/gtd.yml"),
  },
  {
    name: "local",
    url: new URL("../../../../data/gtd.yml", import.meta.url),
  },
];

export const GET: APIRoute = ({ request, params, url }) => {
  // console.log(readFileObject(sources[1].url));
  console.log(writeFileObject({ test: "adsdfasdgsf" }, sources[1].url));
  return new Response(JSON.stringify(sources));
};

export const POST: APIRoute = (option) => {
  // console.log(option);
  return new Response(JSON.stringify("sadg"));
};
