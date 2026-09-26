const key = (userId) => `save-the-queen-player-${userId}`;
export const getPlayer = (userId) => {
  try {
    return JSON.parse(localStorage.getItem(key(userId)));
  } catch {
    return null;
  }
};
export const savePlayer = (p) =>
  localStorage.setItem(key(p.userId), JSON.stringify(p));
export const recordResult = (p, won) => {
  const next = {
    ...p,
    wins: p.wins + (won ? 1 : 0),
    losses: p.losses + (won ? 0 : 1),
  };
  savePlayer(next);
  return next;
};

const sessionKey = "save-the-queen-quiz-session";

export const loadQuizSession = () => {
  try {
    const raw = localStorage.getItem(sessionKey);
    if (!raw) return null;
    const s = JSON.parse(raw);
    const ok =
      s &&
      s.view === "game" &&
      typeof s.topic === "string" &&
      Array.isArray(s.questions) &&
      s.questions.length > 0 &&
      Number.isInteger(s.current) &&
      s.current >= 0 &&
      s.current < s.questions.length &&
      Number.isFinite(s.score) &&
      Number.isInteger(s.lives);
    if (!ok) return null;

    const total = s.questions.length;
    const answers = Array.isArray(s.answers) ? s.answers.slice(0, total) : [];
    const selected =
      Number.isInteger(s.selected) && s.selected >= 0 && s.selected < 4
        ? s.selected
        : null;
    const answered = s.answered === true && selected !== null;

    if (!answered) answers[s.current] = null;

    return { ...s, answers, selected: answered ? selected : null, answered };
  } catch {
    return null;
  }
};

export const saveQuizSession = (s) => {
  try {
    localStorage.setItem(sessionKey, JSON.stringify(s));
  } catch {}
};

export const clearQuizSession = () => {
  try {
    localStorage.removeItem(sessionKey);
  } catch {}
};
