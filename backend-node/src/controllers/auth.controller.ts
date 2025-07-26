import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ResponseUtil } from '../utils/response';
import { ErrorHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../types';
import { LoginDto, RegisterDto, ChangePasswordDto } from '../dto/Auth.dto';

export class AuthController {
  static login = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const loginData: LoginDto = req.body;
    
    const result = await AuthService.login(loginData);
    
    return ResponseUtil.success(
      res, 
      'Login successful', 
      result,
      200
    );
  });

  static register = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const registerData: RegisterDto = req.body;
    
    const result = await AuthService.register(registerData);
    
    return ResponseUtil.success(
      res, 
      'Registration successful', 
      result,
      201
    );
  });

  static refreshToken = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return ResponseUtil.validation(res, 'Refresh token is required');
    }
    
    const result = await AuthService.refreshToken(refreshToken);
    
    return ResponseUtil.success(
      res, 
      'Token refreshed successfully', 
      result
    );
  });

  static getProfile = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    
    const user = await AuthService.getUserProfile(userId);
    
    return ResponseUtil.success(
      res, 
      'Profile retrieved successfully', 
      user
    );
  });

  static updateProfile = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const updateData = req.body;
    
    const user = await AuthService.updateProfile(userId, updateData);
    
    return ResponseUtil.success(
      res, 
      'Profile updated successfully', 
      user
    );
  });

  static changePassword = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const passwordData: ChangePasswordDto = req.body;
    
    const result = await AuthService.changePassword(userId, passwordData);
    
    return ResponseUtil.success(
      res, 
      result.message
    );
  });

  static logout = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    return ResponseUtil.success(
      res, 
      'Logout successful'
    );
  });
}