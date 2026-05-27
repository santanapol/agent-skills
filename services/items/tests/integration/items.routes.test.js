import request from 'supertest';
import { createApp } from '../../src/app.js';
import { connectDatabase, closeDatabase, getDatabase } from '../../src/config/database.js';
import { setDatabaseReady } from '../../src/config/readiness.js';
import { COLLECTION_NAME, ensureItemIndexes } from '../../src/models/items.model.js';
import { validHeaders } from '../helpers/headers.js';

const hasMongo = Boolean(process.env.MONGODB_URI && process.env.DB_NAME);
const describeIfMongo = hasMongo ? describe : describe.skip;

describeIfMongo('POST /api/v1/items', () => {
  const app = createApp();

  beforeAll(async () => {
    await connectDatabase();
    await ensureItemIndexes();
    setDatabaseReady(true);
  });

  afterAll(async () => {
    const db = getDatabase();
    await db.collection(COLLECTION_NAME).deleteMany({});
    await closeDatabase();
    setDatabaseReady(false);
  });

  beforeEach(async () => {
    const db = getDatabase();
    await db.collection(COLLECTION_NAME).deleteMany({});
  });

  it('creates item and returns 201 CREATED with ETag', async () => {
    const res = await request(app)
      .post('/api/v1/items')
      .set(validHeaders())
      .send({ name: 'Widget A', desc: 'A useful widget' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.code).toBe('CREATED');
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.name).toBe('Widget A');
    expect(res.body.data.desc).toBe('A useful widget');
    expect(res.body.data.cr_by).toBe('user-001');
    expect(res.headers.etag).toMatch(/^W\/"/);

    const db = getDatabase();
    const saved = await db.collection(COLLECTION_NAME).findOne({ name: 'Widget A' });
    expect(saved).toBeTruthy();
    expect(saved.ou_id.toString()).toBe('665a1b2c3d4e5f6789012345');
    expect(saved.branch_id.toString()).toBe('665a1b2c3d4e5f6789012346');
  });
});
