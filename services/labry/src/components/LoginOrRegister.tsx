import { supabase } from "../supabase";

async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
  });
}

export default function SignIn() {
  return (
    <div>
      <form>
        <div>
          <div>Username</div>
          <input />
        </div>

        <div>
          <div>Password</div>
          <input type="password" />
        </div>
        <button>Login</button>
      </form>
        <button onClick={signInWithGithub}>Github</button>
    </div>
  );
}
