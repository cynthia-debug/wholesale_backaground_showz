import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { 
  getProfileController, 
  updateProfileController,
  changePasswordController,
  createUserController,
  getAllUsersController,
  deleteUserController
} from '../controllers/user.controller';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// GET /api/user/profile
router.get('/profile', getProfileController);

// PUT /api/user/profile
router.put('/profile', updateProfileController);

// PUT /api/user/password
router.put('/password', changePasswordController);

// Admin only routes
// GET /api/user/all - Get all users
router.get('/all', getAllUsersController);

// POST /api/user/create - Create new user
router.post('/create', createUserController);

// DELETE /api/user/:id - Delete user
router.delete('/:id', deleteUserController);

export default router;
