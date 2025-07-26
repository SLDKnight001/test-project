import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/response';
import { ErrorHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../types';
import { CartService } from '../services/cart.service';

export class CartController {
  static getCart = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const cart = await CartService.getCart(userId);
    return ResponseUtil.success(res, 'Cart retrieved successfully', cart);
  });

  static addToCart = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const cart = await CartService.addToCart(userId, req.body);
    return ResponseUtil.success(res, 'Item added to cart successfully', cart);
  });

  static updateCartItem = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const { productId } = req.params;
    const cart = await CartService.updateCartItem(userId, productId, req.body);
    return ResponseUtil.success(res, 'Cart item updated successfully', cart);
  });

  static removeFromCart = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const { productId } = req.params;
    const cart = await CartService.removeFromCart(userId, productId);
    return ResponseUtil.success(res, 'Item removed from cart successfully', cart);
  });

  static clearCart = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const cart = await CartService.clearCart(userId);
    return ResponseUtil.success(res, 'Cart cleared successfully', cart);
  });
}