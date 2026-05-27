import { randomUUID } from 'node:crypto';

const CRITICAL_HEADERS = [
  'x-gateway-secret',
  'x-user-ou',
  'x-user-branch',
  'x-user-id',
  'x-user-role',
  'if-match',
];

export function requestIdMiddleware(req, res, next) {
  const incoming = req.headers['x-request-id'];
  const requestId = typeof incoming === 'string' && incoming.trim() ? incoming.trim() : randomUUID();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
}

export function assertNoDuplicateHeaders(req) {
  for (const header of CRITICAL_HEADERS) {
    const value = req.headers[header];

    if (typeof value === 'string' && value.includes(',')) {
      return header;
    }
  }

  return null;
}
