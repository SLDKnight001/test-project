import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { ValidationMiddleware } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(AuthMiddleware.authenticate);

// Customer routes
router.post('/', ValidationMiddleware.validateOrder, OrderController.createOrder);
router.get('/my-orders', OrderController.getUserOrders);
router.get('/:id', OrderController.getOrderById);

// Admin routes
router.get('/', AuthMiddleware.adminOnly, OrderController.getOrders);
router.put('/:id/status', AuthMiddleware.adminOnly, OrderController.updateOrderStatus);
router.get('/admin/stats', AuthMiddleware.adminOnly, OrderController.getOrderStats);

export default router;