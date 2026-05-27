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

  try {
    return await itemsModel.insertOne(payload);
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = new Error('A resource with this identifier already exists');
      duplicateError.status = 409;
      duplicateError.code = 'DUPLICATE';
      throw duplicateError;
    }

    throw error;
  }
}
