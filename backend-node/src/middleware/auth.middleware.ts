import { Request, Response, NextFunction } from 'express';
import { JWTUtil } from '../utils/jwt';
import { ResponseUtil } from '../utils/response';
import { User } from '../model/User';
import { AuthenticatedRequest } from '../types';

export class AuthMiddleware {
  static async authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.header('Authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ResponseUtil.unauthorized(res, 'Access token is required');
      }

      const token = authHeader.substring(7);
      
      if (!token) {
        return ResponseUtil.unauthorized(res, 'Access token is required');
      }

      const decoded = JWTUtil.verifyAccessToken(token);
      
      if (!decoded.userId) {
        return ResponseUtil.unauthorized(res, 'Invalid token payload');
      }

      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return ResponseUtil.unauthorized(res, 'User not found');
      }

      if (user.status === 'inactive') {
        return ResponseUtil.forbidden(res, 'Account is inactive');
      }

      req.user = user;
      req.userId = user._id.toString();
      return next();
    } catch (error) {
      console.error('Authentication error:', error);
      return ResponseUtil.unauthorized(res, 'Invalid or expired token');
    }
  }

  static authorize(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as Request & { user?: any }).user;

      if (!user || !roles.includes(user.role)) {
        return ResponseUtil.forbidden(res, "Access denied! You don't have permission to access this resource!");
      }

      return next();
    };
  }

  static adminOnly(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    return AuthMiddleware.authorize(['admin'])(req, res, next);
  }

  static customerOnly(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    return AuthMiddleware.authorize(['customer'])(req, res, next);
  }

  static adminOrCustomer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    return AuthMiddleware.authorize(['admin', 'customer'])(req, res, next);
  }
}