# Save the Queen — AI Knowledge Quest

A responsive React quiz game where a King must answer ten AI-generated questions to rescue the Queen. It is deliberately a game interface, not a chatbot.

## Features

- First-time player setup and a short static, animated story; returning players go straight home.
- Secure OpenAI integration through Express only; no secret is sent to the browser.
- Strict server and client validation: exactly ten questions, four string choices, and a zero-based valid answer index.
- Loading, network/API/schema error states, retry, request cancellation, and stale-response protection.
- Three lives, score-based King movement, answer feedback, win/loss persistence, responsive fantasy arena.

## Stack and architecture

React 18 + Vite provides the UI. Node.js/Express handles `POST /api/generate`; it calls OpenAI and validates the returned JSON before responding. The browser validates it again before it can reach the game. Game statistics live in `localStorage` under `save-the-queen-player`.

```
React UI → Express /api/generate → OpenAI
React UI ← validated JSON ← Express
```

## Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.
3. In one terminal run `npm run server`.
4. In another run `npm run dev`, then open the Vite URL.

`OPENAI_MODEL` is optional and defaults to `gpt-4o-mini`. The `.env` file is ignored by Git.

## API contract

`POST /api/generate` accepts `{ "topic": "JavaScript Promises", "difficulty": "Mixed" }` and returns `{ topic, difficulty, questions }`. Each of the ten questions has `id`, `question`, four `options`, and `correctAnswer` (0–3). Both backend and `src/lib/validateResult.js` reject malformed JSON, missing fields, wrong counts, invalid options, and answer indexes.

## Game rules

There are 10 questions and 3 lives. A correct answer advances the King and adds one score; a wrong answer costs a life. The player wins with at least 7 correct answers. Reaching zero lives ends the game immediately. The app prevents duplicate answers and waits briefly so feedback is visible.

## Error handling

The UI shows a safe retry state for missing topics, failed requests, network issues, empty/malformed LLM replies, and invalid schemas. Each generation has a monotonically increasing request ID plus an `AbortController`; a late older request cannot replace a newer one.

## Project structure

- `src/components` — flow screens and game UI
- `src/lib` — API, validation, and local storage
- `src/data/story.js` — predefined dialogue
- `server/routes`, `server/services`, `server/prompts` — backend boundary
- `public` — supplied game artwork

## Mobile and deployment

The arena and answers adapt to one column on small screens with no horizontal scrolling. For Vercel, deploy the Vite app and deploy/proxy the Express endpoint as a serverless function or separate Node service; set `OPENAI_API_KEY` in the host environment, never as a `VITE_` variable.

## Scope and limitations

No authentication, database, or leaderboard is included. The assignment brief contains conflicting requests for a Supabase leaderboard and an explicit scope rule not to add one; this implementation follows the explicit scope rule and uses local persistence. Questions require a valid OpenAI key and network connection. The default model may require access on the configured OpenAI account.

## Future improvements

Optional sound effects, keyboard shortcuts, a reviewed Supabase leaderboard, question review, and test coverage could be added after core deployment.

## Time and AI disclosure

Estimated implementation time: 5–7 hours. AI tools were used for brainstorming, implementation assistance, debugging, and documentation. Generated code was reviewed and tested as part of the project.
