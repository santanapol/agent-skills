import { ObjectId } from 'mongodb';
import * as itemsModel from '../models/items.model.js';
import { buildAuditCreate } from '../utils/audit.js';

const CREATE_PROG = 'POST /api/v1/items';

export async function createItem({ ouId, branchId, userId, body }) {
  const payload = {
    ou_id: new ObjectId(ouId),
    branch_id: new ObjectId(branchId),
    name: body.name,
    desc: body.desc ?? '',
    ...buildAuditCreate({ userId, prog: CREATE_PROG }),
  };

  return itemsModel.insertOne(payload);
}
