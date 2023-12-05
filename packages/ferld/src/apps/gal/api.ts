import type { APIRoute } from "astro";
import { filterWith, flatDb, getDb, load } from "./source";
import { fromSearchParams } from "./utils";

export const GET: APIRoute = ({ request, url }) => {
  const params = fromSearchParams(url.searchParams);

  if (params.refresh) {
    load();
  }

  const db = filterWith(getDb(), params);

  return new Response(JSON.stringify(params.raw ? db : flatDb(db)));
};

export const POST: APIRoute = (option) => {
  return new Response(JSON.stringify("sadg"));
};
