import { supabase } from "../lib/supabase";
export default function AuthScreen({ error }) {
  const signIn = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) window.alert(error.message);
  };
  return (
    <main className="splash">
      <img className="logo" src="/logo.png" />
      <p>AI KNOWLEDGE QUEST</p>
      <h1>SAVE THE QUEEN</h1>
      <p className="tagline">Sign in with Google to begin your royal quest.</p>
      {error && <p className="auth-error">{error}</p>}
      <button onClick={signIn} disabled={!supabase}>
        Continue with Google
      </button>
      {!supabase && (
        <p className="muted">Google sign-in has not been configured.</p>
      )}
    </main>
  );
}
