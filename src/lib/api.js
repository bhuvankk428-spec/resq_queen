import { validateResult } from './validateResult';
export async function generateQuestions(topic, difficulty, signal) {
  const res = await fetch('/api/generate', { method: 'POST', headers: {'Content-Type':'application/json'}, signal, body: JSON.stringify({topic, difficulty}) });
  let data; try { data = await res.json(); } catch { throw new Error('The server returned malformed JSON. Please retry.'); }
  if (!res.ok) throw new Error(data.error || 'The enemy could not prepare your challenge.');
  return validateResult(data);
}
