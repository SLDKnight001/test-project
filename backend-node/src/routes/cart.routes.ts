import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(AuthMiddleware.authenticate);

router.get('/', CartController.getCart);
router.post('/add', CartController.addToCart);
router.put('/item/:productId', CartController.updateCartItem);
router.delete('/item/:productId', CartController.removeFromCart);
router.delete('/clear', CartController.clearCart);

export default router;