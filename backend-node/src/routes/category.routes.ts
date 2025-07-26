import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { ValidationMiddleware } from '../middleware/validation';
import { uploadMultiple } from '../middleware/upload';

const router = Router();

router.use(AuthMiddleware.authenticate);

router.get('/', CategoryController.getAllCategories);

// Category management routes
router.post('/', ValidationMiddleware.validateCategory, AuthMiddleware.adminOnly, CategoryController.createCategory);
router.put('/:id', ValidationMiddleware.validateCategory, AuthMiddleware.adminOnly, CategoryController.updateCategory);
router.delete('/:id', AuthMiddleware.adminOnly, CategoryController.deleteCategory);
router.get('/stats', AuthMiddleware.adminOnly, CategoryController.getCategoryStats);

export default router;