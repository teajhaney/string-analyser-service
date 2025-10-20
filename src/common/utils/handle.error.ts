import type { Response } from 'express';
import { AppError } from './app.error';
import logger from './logger';

export function handleError(res: Response, error: any, context: string) {
  // Generic error
  logger.error(`${context} error occurred`, error);
  return res.status(500).json({
    success: false,
    message: `Internal server error: ${error}`,
  });
}

export const validateStringValue = (value: unknown): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    const error = new AppError(
      'Invalid data type for "value" (must be string)',
      422
    );
    // error.status = 422; // AppError already sets statusCode
    throw error;
  }

  return value.trim();
};

export const validateNaturalQuery = (query: string): string | null => {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    const error = new AppError('Unable to parse natural language query', 400);
    // error.status = 400; // AppError already sets statusCode
    throw error;
  }
  return query.trim();
};
