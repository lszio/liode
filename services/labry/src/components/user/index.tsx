import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { supabase } from "../../libs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { $session, $user } from "../../store";

export default function User() {
  const session = useStore($session);
  const user = useStore($user);

  useEffect(() => {
    supabase.getSession().then(({ data: { session } }) => {
      $session.set(session);
      $user.set(session?.user);
    });

    const {
      data: { subscription },
    } = supabase.client.auth.onAuthStateChange((_, session) => {
      $session.set(session);
      $user.set(session?.user);
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
    return <div>Logged in as {user.email}</div>;
  }
}
