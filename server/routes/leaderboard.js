import { Router } from 'express';
import { getLeaderboard, saveScore } from '../services/leaderboardService.js';

const router = Router();
router.get('/', async (_req, res) => { try { res.json(await getLeaderboard()); } catch (error) { res.status(error.status || 500).json({ error: error.message }); } });
router.post('/', async (req, res) => {
  const { name, wins, losses } = req.body || {};
  if (typeof name !== 'string' || !name.trim() || name.length > 30 || !Number.isInteger(wins) || wins < 0 || !Number.isInteger(losses) || losses < 0) return res.status(400).json({ error: 'A valid player name, wins, and losses are required.' });
  try { await saveScore({ name: name.trim(), wins, losses }); res.status(204).end(); } catch (error) { res.status(error.status || 500).json({ error: error.message }); }
});
export default router;
