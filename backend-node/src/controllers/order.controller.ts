import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/response';
import { ErrorHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../types';
import { OrderService } from '../services/order.service';

export class OrderController {
  static createOrder = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const order = await OrderService.createOrder(userId, req.body);
    return ResponseUtil.success(res, 'Order created successfully', order, 201);
  });

  static getOrders = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search,
      orderStatus,
      paymentStatus,
      userId
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = {};

    if (search) {
      filter.orderNumber = { $regex: search, $options: 'i' };
    }

    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (userId) {
      filter.userId = userId;
    }

    const sortObj: any = {};
    sortObj[sort as string] = order === 'desc' ? -1 : 1;

    const { orders, total } = await OrderService.getOrders(filter, sortObj, skip, Number(limit));
    const totalPages = Math.ceil(total / Number(limit));

    return ResponseUtil.success(res, 'Orders retrieved successfully', {
      orders,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  });

  static getOrderById = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await OrderService.getOrderById(id);

    if (!order) {
      return ResponseUtil.notFound(res, 'Order not found');
    }

    return ResponseUtil.success(res, 'Order retrieved successfully', order);
  });

  static getUserOrders = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      orderStatus
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = {};

    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }

    const sortObj: any = {};
    sortObj[sort as string] = order === 'desc' ? -1 : 1;

    const { orders, total } = await OrderService.getUserOrders(userId, filter, sortObj, skip, Number(limit));
    const totalPages = Math.ceil(total / Number(limit));

    return ResponseUtil.success(res, 'User orders retrieved successfully', {
      orders,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  });

  static updateOrderStatus = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const updatedOrder = await OrderService.updateOrderStatus(id, req.body);
    return ResponseUtil.success(res, 'Order status updated successfully', updatedOrder);
  });

  static getOrderStats = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const stats = await OrderService.getOrderStats();
    return ResponseUtil.success(res, 'Order statistics retrieved successfully', stats);
  });
}