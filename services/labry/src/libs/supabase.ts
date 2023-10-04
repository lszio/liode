import { createClient } from "@supabase/supabase-js";

export const client = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });

// const supabase = client;

export async function getSession() {
  return await client.auth.getSession();
}
