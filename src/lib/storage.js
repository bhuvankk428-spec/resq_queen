const key = 'save-the-queen-player';
export const getPlayer = () => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
export const savePlayer = p => localStorage.setItem(key, JSON.stringify(p));
export const recordResult = (p, won) => { const next={...p,wins:p.wins+(won?1:0),losses:p.losses+(won?0:1)}; savePlayer(next); return next; };
