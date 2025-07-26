import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { ValidationMiddleware } from '../middleware/validation';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// Public routes
router.post('/login', ValidationMiddleware.validateLogin, AuthController.login);
router.post('/register', ValidationMiddleware.validateRegister, AuthController.register);
router.post('/refresh-token', AuthController.refreshToken);

// Protected routes
router.use(AuthMiddleware.authenticate);
router.get('/profile', AuthController.getProfile);
router.put('/profile', uploadSingle('profileImage'), AuthController.updateProfile);
router.post('/change-password', AuthController.changePassword);
router.post('/logout', AuthController.logout);

export default router;