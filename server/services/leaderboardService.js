import { createClient } from "@supabase/supabase-js";

function client() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const error = new Error(
      "Leaderboard is not configured yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env."
    );
    error.status = 503;
    throw error;
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export async function saveScore({ name, wins, losses }) {
  const { error } = await client()
    .from("leaderboard")
    .upsert(
      { name, wins, losses, updated_at: new Date().toISOString() },
      { onConflict: "name" }
    );
  if (error) {
    const e = new Error(`Unable to save leaderboard score: ${error.message}`);
    e.status = 502;
    throw e;
  }
}

export async function getLeaderboard() {
  const { data, error } = await client()
    .from("leaderboard")
    .select("name,wins,losses,updated_at")
    .order("wins", { ascending: false })
    .order("losses", { ascending: true })
    .order("updated_at", { ascending: true })
    .limit(50);
  if (error) {
    const e = new Error(`Unable to load leaderboard: ${error.message}`);
    e.status = 502;
    throw e;
  }
  return data;
}

export async function verifyAccessToken(token) {
  if (!token) {
    const e = new Error("Sign in with Google before saving a score.");
    e.status = 401;
    throw e;
  }
  const { data, error } = await client().auth.getUser(token);
  if (error || !data.user) {
    const e = new Error(
      "Your Google session has expired. Please sign in again."
    );
    e.status = 401;
    throw e;
  }
  return data.user;
}
