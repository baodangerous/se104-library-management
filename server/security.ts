import type { NextFunction, Request, Response } from 'express';

export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
}

export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message: string;
}) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = hits.get(key);

    if (!record || now > record.resetAt) {
      hits.set(key, { count: 1, resetAt: now + options.windowMs });
      next();
      return;
    }

    record.count += 1;
    if (record.count > options.max) {
      res.status(429).json({ error: options.message });
      return;
    }
    next();
  };
}
