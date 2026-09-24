import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../lib/api";
export default function Leaderboard({ home }) {
  const [rows, setRows] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const load = () => {
    setLoading(true);
    setError("");
    fetchLeaderboard()
      .then(setRows)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  return (
    <main className="screen leaderboard">
      <p className="eyebrow">THE KINGDOM'S FINEST</p>
      <h1>Leaderboard</h1>
      <section className="card leaderboard-card">
        {loading ? (
          <p>Gathering royal records…</p>
        ) : error ? (
          <>
            <p>{error}</p>
            <button onClick={load}>Try again</button>
          </>
        ) : rows.length === 0 ? (
          <p>No completed quests yet. Claim the first place!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>King</th>
                <th>Wins</th>
                <th>Losses</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.name}>
                  <td>{index + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.wins}</td>
                  <td>{row.losses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <button className="ghost" onClick={home}>
        Return home
      </button>
    </main>
  );
}
