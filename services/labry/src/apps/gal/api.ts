import type { APIRoute } from "astro";

export const GET: APIRoute = ({ request, params, url }) => {
  return new Response(JSON.stringify("TODO"));
};

export const POST: APIRoute = (option) => {
  return new Response(JSON.stringify("sadg"));
};
