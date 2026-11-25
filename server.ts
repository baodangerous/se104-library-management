import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { apiRouter } from './server/routes/index';
import { chatbotRouter } from './server/chatbotRoute';
import { db } from './server/db';
import { createRateLimiter, securityHeaders } from './server/security';

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(securityHeaders);
  app.use(express.json({ limit: '10mb' }));

  app.get('/api/health', (_req, res) => {
    const journalMode = db.pragma('journal_mode', { simple: true });
    const busyTimeout = db.pragma('busy_timeout', { simple: true });
    const foreignKeys = db.pragma('foreign_keys', { simple: true });
    const indexCount = (
      db
        .prepare("SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type = 'index' AND name LIKE 'idx_%'")
        .get() as { cnt: number }
    ).cnt;
    res.json({
      ok: true,
      status: 'UP',
      db: 'sqlite',
      pragmas: { journalMode, busyTimeout, foreignKeys, indexCount },
      timestamp: new Date().toISOString(),
    });
  });

  const chatbotLimiter = createRateLimiter({
    windowMs: 60_000,
    max: 30,
    message: 'Bạn gửi câu hỏi quá nhanh. Vui lòng thử lại sau 1 phút.',
  });

  app.use('/api/chatbot', chatbotLimiter, chatbotRouter);
  app.use('/api', apiRouter);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build artifacts not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UIT Library Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start UIT Library server:', err);
  process.exit(1);
});
