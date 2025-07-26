import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/response';
import { ErrorHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../types';
import { UserService } from '../services/user.service';

export class UserController {
  static getAllUsers = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const result = await UserService.getAllUsers(req.query);

    const { page = 1, limit = 10 } = req.query;
    const totalPages = Math.ceil(result.total / Number(limit));

    return ResponseUtil.success(res, 'Users retrieved successfully', {
      users: result.users,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: result.total,
        itemsPerPage: Number(limit)
      }
    });
  });

  static getUserById = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return ResponseUtil.notFound(res, 'User not found');
    }
    return ResponseUtil.success(res, 'User retrieved successfully', user);
  });

  static updateUserStatus = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await UserService.updateUserStatus(req.params.id, req.body);
    return ResponseUtil.success(res, 'User status updated successfully', user);
  });

  static getUserStats = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const stats = await UserService.getUserStats();
    return ResponseUtil.success(res, 'User statistics retrieved successfully', stats);
  });
}