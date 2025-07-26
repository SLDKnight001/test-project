import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class ErrorHandler {
  static handle(error: AppError, req: Request, res: Response, next: NextFunction) {
    console.error('Error:', error);

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map((err: any) => err.message);
      return ResponseUtil.validation(res, 'Validation failed', messages.join(', '));
    }

    // Mongoose duplicate key error
    if ((error as any).code === 11000) {
      const field = Object.keys((error as any).keyValue)[0];
      return ResponseUtil.validation(res, `${field} already exists`, 'Duplicate field value');
    }

    // Mongoose cast error
    if (error.name === 'CastError') {
      return ResponseUtil.validation(res, 'Invalid ID format', 'Invalid resource ID');
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
      return ResponseUtil.unauthorized(res, 'Invalid token');
    }

    if (error.name === 'TokenExpiredError') {
      return ResponseUtil.unauthorized(res, 'Token expired');
    }

    // Multer errors
    if ((error as any).code === 'LIMIT_FILE_SIZE') {
      return ResponseUtil.validation(res, 'File size too large', 'Maximum file size is 5MB');
    }

    if ((error as any).code === 'LIMIT_FILE_COUNT') {
      return ResponseUtil.validation(res, 'Too many files', 'Maximum 5 files allowed');
    }

    // Default error
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';

    if (statusCode === 500) {
      return ResponseUtil.serverError(res, 'Something went wrong', message);
    }

    return ResponseUtil.error(res, message, error.message, statusCode);
  }

  static notFound(req: Request, res: Response, next: NextFunction) {
    const error: AppError = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404;
    error.isOperational = true;
    next(error);
  }

  static asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}