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
