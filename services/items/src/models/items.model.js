import { getDatabase } from '../config/database.js';

export const COLLECTION_NAME = 'items';

export async function ensureItemIndexes() {
  const db = getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  await collection.createIndex(
    { ou_id: 1, branch_id: 1, name: 1 },
    { unique: true, name: 'uniq_ou_branch_name' },
  );
}
