import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(AuthMiddleware.authenticate);

// Admin only routes
router.use(AuthMiddleware.adminOnly);

router.get('/', UserController.getAllUsers);
router.get('/stats', UserController.getUserStats);
router.get('/:id', UserController.getUserById);
router.put('/:id/status', UserController.updateUserStatus);

export default router;