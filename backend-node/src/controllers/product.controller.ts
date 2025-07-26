import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/response';
import { ErrorHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest, ProductFilter } from '../types';
import { ProductService } from '../services/product.service';

export class ProductController {
  static getAllProducts = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const result = await ProductService.getAllProducts(req.query);

    const { page = 1, limit = 12 } = req.query;
    const totalPages = Math.ceil(result.total / Number(limit));

    return ResponseUtil.success(res, 'Products retrieved successfully', {
      products: result.products,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: result.total,
        itemsPerPage: Number(limit)
      }
    });
  });

  static getProductById = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) {
      return ResponseUtil.notFound(res, 'Product not found');
    }
    return ResponseUtil.success(res, 'Product retrieved successfully', product);
  });

  static createProduct = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const product = await ProductService.createProduct(req.body);
    return ResponseUtil.success(res, 'Product created successfully', product, 201);
  });

  static updateProduct = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const product = await ProductService.updateProduct(req.params.id, req.body);
    return ResponseUtil.success(res, 'Product updated successfully', product);
  });

  static deleteProduct = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await ProductService.deleteProduct(req.params.id);
    return ResponseUtil.success(res, 'Product deleted successfully');
  });

  static getFeaturedProducts = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductService.getFeaturedProducts(Number(req.query.limit) || 8);
    return ResponseUtil.success(res, 'Featured products retrieved successfully', products);
  });

  static getProductsByCategory = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { categoryName } = req.params;
    const { page = 1, limit = 12, sort = 'createdAt', order = 'desc' } = req.query;

    const result = await ProductService.getProductsByCategory(
        categoryName,
        Number(page),
        Number(limit),
        sort as string,
        order as string
    );

    const totalPages = Math.ceil(result.total / Number(limit));

    return ResponseUtil.success(res, 'Products retrieved successfully', {
      products: result.products,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: result.total,
        itemsPerPage: Number(limit)
      }
    });
  });

  static searchProducts = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { q, page = 1, limit = 12 } = req.query;

    if (!q) {
      return ResponseUtil.validation(res, 'Search query is required');
    }

    const result = await ProductService.searchProducts(
        q as string,
        Number(page),
        Number(limit)
    );

    const totalPages = Math.ceil(result.total / Number(limit));

    return ResponseUtil.success(res, 'Search completed successfully', {
      products: result.products,
      query: result.query,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: result.total,
        itemsPerPage: Number(limit)
      }
    });
  });

  static getProductStats = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const stats = await ProductService.getProductStats();
    return ResponseUtil.success(res, 'Product statistics retrieved successfully', stats);
  });
}