export default function PlayerSetup({
  name,
  setName,
  topic,
  setTopic,
  difficulty,
  setDifficulty,
  continueToStory,
}) {
  return (
    <main className="screen">
      <header>
        <p className="eyebrow">A NEW LEGEND BEGINS</p>
        <h1>Name your King</h1>
      </header>
      <section className="card form">
        <label>
          Your name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="King Arthur"
            maxLength="30"
          />
        </label>
        <label>
          Your first topic
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Computer Networks"
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
        <button onClick={continueToStory}>Hear the challenge</button>
      </section>
    </main>
  );
}
