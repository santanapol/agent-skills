import { Router } from 'express';
import { isDatabaseReady } from '../config/readiness.js';

const router = Router();

router.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.get('/readyz', (_req, res) => {
  if (isDatabaseReady()) {
    res.status(200).json({ status: 'ready' });
    return;
  }

  res.status(503).json({ status: 'not_ready' });
});

export default router;
