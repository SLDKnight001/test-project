import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { ValidationMiddleware } from '../middleware/validation';
import { uploadMultiple } from '../middleware/upload';

const router = Router();


// Public routes
router.get('/featured', ProductController.getFeaturedProducts);

router.use(AuthMiddleware.authenticate);

router.get('/', ProductController.getAllProducts);
router.get('/search', ProductController.searchProducts);
router.get('/:categoryName', ProductController.getProductsByCategory);
router.get('/:id', ProductController.getProductById);

// Product management routes
router.post('/', uploadMultiple('images'), ValidationMiddleware.validateProduct, AuthMiddleware.adminOnly, ProductController.createProduct);
router.put('/:id', uploadMultiple('images'), AuthMiddleware.adminOnly, ProductController.updateProduct);
router.delete('/:id', AuthMiddleware.adminOnly, ProductController.deleteProduct);
router.get('/admin/stats', AuthMiddleware.adminOnly, ProductController.getProductStats);

export default router;