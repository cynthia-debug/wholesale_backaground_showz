import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getProductsController, getProductBySkuController } from '../controllers/products.controller';

const router = Router();

// All product routes require authentication
router.use(authMiddleware);

// GET /api/products
router.get('/', getProductsController);

// GET /api/products/:sku
router.get('/:sku', getProductBySkuController);

export default router;

