import dotenv from 'dotenv';
import { createApp, logger } from './app.js';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const port = Number(process.env.PORT ?? 3000);
const app = createApp();

app.listen(port, () => {
  logger.info({ port }, 'items-service started');
});
