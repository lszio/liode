import { createClient } from "@supabase/supabase-js";
import cookie from "cookie";

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key, {
  auth: {
    persistSession: false // TODO
  }
});

export async function getUser(request: Request) {
  const c = cookie.parse(request.headers.get("cookie") ?? "");

  if (!c.sbat)
    return null;

  const { data: { user } } = await supabase.auth.getUser(c.sbat);
  if (!user || user.role !== "authenticated")
    return null;

  return user;
}

export async function isSingIn(request: Request) {
  return await getUser(request) != null;
}
