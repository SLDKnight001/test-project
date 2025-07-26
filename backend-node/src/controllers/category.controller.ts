import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/response';
import { ErrorHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../types';
import { CategoryService } from '../services/category.service';

export class CategoryController {
    static createCategory = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const category = await CategoryService.createCategory(req.body);
        return ResponseUtil.success(res, 'Category created successfully', category, 201);
    });

    static getAllCategories = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
        const categories = await CategoryService.getAllCategories(req.query.status as string | undefined);
        return ResponseUtil.success(res, 'Categories retrieved successfully', categories);
    });

    static updateCategory = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const category = await CategoryService.updateCategory(req.params.id, req.body);
        return ResponseUtil.success(res, 'Category updated successfully', category);
    });

    static deleteCategory = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        await CategoryService.deleteCategory(req.params.id);
        return ResponseUtil.success(res, 'Category deleted successfully');
    });

    static getCategoryStats = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const stats = await CategoryService.getCategoryStats();
        return ResponseUtil.success(res, 'Category statistics retrieved successfully', stats);
    });
}