import { Router } from 'express';
import { isLoggedIn } from '../middleware/auth.middleware.js';
// Import the user controller
import {
  registerUser,
  verifyUser,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
} from '../controller/user.controller.js';

// create a new Express router
const router = Router();

// Define routes
router.post('/register', registerUser);
router.get('/verify/:token', verifyUser);
router.post('/login', login);
router.get('/me', isLoggedIn, getMe);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Export the router
export default router;
