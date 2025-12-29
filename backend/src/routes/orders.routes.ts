import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getOrdersController } from '../controllers/orders.controller';

const router = Router();

// All order routes require authentication
router.use(authMiddleware);

// GET /api/orders
router.get('/', getOrdersController);

export default router;

