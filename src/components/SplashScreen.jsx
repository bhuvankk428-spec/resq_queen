export default function SplashScreen({ start }) {
  return (
    <main className="splash">
      <img className="logo" src="/logo.png" />
      <p>AI KNOWLEDGE QUEST</p>
      <h1>SAVE THE QUEEN</h1>
      <p className="tagline">Ten questions. Three lives. One royal rescue.</p>
      <button onClick={start}>Start adventure</button>
    </main>
  );
}
