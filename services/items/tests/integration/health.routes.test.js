import request from 'supertest';
import { createApp } from '../../src/app.js';
import { setDatabaseReady } from '../../src/config/readiness.js';

describe('Health routes', () => {
  const app = createApp();

  afterEach(() => {
    setDatabaseReady(false);
  });

  it('GET /healthz returns 200', async () => {
    const res = await request(app).get('/healthz');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /readyz returns 503 before database is connected', async () => {
    const res = await request(app).get('/readyz');

    expect(res.status).toBe(503);
    expect(res.body.status).toBe('not_ready');
  });

  it('GET /readyz returns 200 when database is ready', async () => {
    setDatabaseReady(true);

    const res = await request(app).get('/readyz');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
  });
});
