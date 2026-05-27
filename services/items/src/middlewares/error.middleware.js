import { sendError } from '../utils/response.js';

export function errorMiddleware(err, req, res, next) {
  void next;

  sendError(res, {
    status: err.status ?? 500,
    code: err.code ?? 'INTERNAL_ERROR',
    message: err.message ?? 'An internal error occurred',
    requestId: req.requestId,
  });
}
