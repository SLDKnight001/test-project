import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';

const router = Router();

// Public routes
router.post('/', ContactController.sendContactMessage);
router.get('/info', ContactController.getContactInfo);

export default router;