import { validateResult } from './validateResult';
export async function generateQuestions(topic, difficulty, signal) {
  const res = await fetch('/api/generate', { method: 'POST', headers: {'Content-Type':'application/json'}, signal, body: JSON.stringify({topic, difficulty}) });
  let data; try { data = await res.json(); } catch { throw new Error('The server returned malformed JSON. Please retry.'); }
  if (!res.ok) throw new Error(data.error || 'The enemy could not prepare your challenge.');
  return validateResult(data);
}
export async function syncLeaderboard(player) {
  const res = await fetch('/api/leaderboard', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: player.playerName, wins: player.wins, losses: player.losses }) });
  if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data.error || 'Unable to save your score.'); }
}
export async function fetchLeaderboard(signal) {
  const res = await fetch('/api/leaderboard', { signal }); const data = await res.json().catch(() => null);
  if (!res.ok || !Array.isArray(data)) throw new Error(data?.error || 'Unable to load the leaderboard.');
  return data;
}
