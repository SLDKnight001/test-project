import { Response } from 'express';
import { ApiResponse } from '../types';

export class ResponseUtil {
  static success<T>(res: Response, message: string, data?: T, statusCode: number = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      statusCode
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, error?: string, statusCode: number = 400): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error,
      statusCode
    };
    return res.status(statusCode).json(response);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, 'Unauthorized access', 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, 'Insufficient permissions', 403);
  }

  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.error(res, message, 'Resource not found', 404);
  }

  static serverError(res: Response, message: string = 'Internal server error', error?: string): Response {
    return this.error(res, message, error, 500);
  }

  static validation(res: Response, message: string = 'Validation failed', error?: string): Response {
    return this.error(res, message, error, 422);
  }
}