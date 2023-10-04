import { useState, useEffect } from "react";
import { supabase } from "../../libs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function User() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.client.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <Auth
        supabaseClient={supabase.client}
        appearance={{ theme: ThemeSupa }}
        providers={["github"]}
      />
    );
  } else {
    return <div>Logged in!</div>;
  }
}
