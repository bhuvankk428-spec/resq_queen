export default function ErrorState({ error, retry, home }) {
  return (
    <section className="state">
      <img className="waiting" src="/King.png" />
      <h2>The quest paused</h2>
      <p>{error}</p>
      <div className="actions">
        <button onClick={retry}>Try again</button>
        <button className="ghost" onClick={home}>
          Return home
        </button>
      </div>
    </section>
  );
}
