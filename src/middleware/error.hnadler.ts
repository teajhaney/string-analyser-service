import type { ErrorRequestHandler } from 'express';
import { AppError } from '../common/utils/app.error.ts';
import logger from '../common/utils/logger.ts';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    logger.error('AppError:', err.message);
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  logger.error('Unexpected Error:', err.stack || err);
  return res
    .status(500)
    .json({ success: false, message: 'Internal server error' });
};

export default errorHandler;
