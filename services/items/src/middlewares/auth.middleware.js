import { sendError } from '../utils/response.js';
import { assertNoDuplicateHeaders } from './request-id.middleware.js';

export function authMiddleware(req, res, next) {
  const duplicateHeader = assertNoDuplicateHeaders(req);

  if (duplicateHeader) {
    sendError(res, {
      status: 400,
      code: 'INVALID_HEADER',
      message: `Duplicate header: ${duplicateHeader}`,
      requestId: req.requestId,
    });
    return;
  }

  const secret = req.headers['x-gateway-secret'];
  const expected = process.env.GATEWAY_SECRET;

  if (!secret || !expected || secret !== expected) {
    sendError(res, {
      status: 401,
      code: 'GATEWAY_SECRET_REJECTED',
      message: 'Authentication failed',
      requestId: req.requestId,
    });
    return;
  }

  next();
}
