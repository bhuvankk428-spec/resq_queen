export default function HomeScreen({
  player,
  topic,
  setTopic,
  difficulty,
  setDifficulty,
  begin,
  logout,
  leaderboard,
}) {
  return (
    <main className="screen">
      <header>
        <p className="eyebrow">SAVE THE QUEEN</p>
        <h1>Welcome back, {player.playerName}</h1>
        <p className="muted">
          Wins: {player.wins} · Losses: {player.losses}
        </p>
      </header>
      <section className="card form">
        <h2>Choose your challenge</h2>
        <label>
          Study topic
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. JavaScript Promises"
            maxLength="140"
          />
        </label>
        <label>
          Difficulty
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option>Mixed</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </label>
        <button onClick={begin}>Begin quest</button>
        <button className="secondary" onClick={leaderboard}>
          View leaderboard
        </button>
        <button className="text-button" onClick={logout}>
          Log out
        </button>
      </section>
    </main>
  );
}
