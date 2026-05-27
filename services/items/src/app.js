import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import healthRoutes from './routes/health.routes.js';

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
});

export function createApp() {
  const app = express();

  app.use(
    pinoHttp({
      logger,
      redact: ['req.headers.authorization', 'req.headers.cookie', 'req.headers["x-gateway-secret"]'],
    }),
  );

  app.use(express.json());
  app.use(healthRoutes);

  return app;
}

export { logger };
