////////// IMPORT
import express from 'express';
import {
  forgotPassword,
  getProfile,
  login,
  logout,
  registerUser,
  resetPassword,
  verifyUser,
} from '../controller/user.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

////////// INITIALIZING EXPRESS ROUTER
const router = express.Router();

////////// DEFINING USER AUTHENTICATION ROUTES
router.post('/register', registerUser);
router.get('/verify/:token', verifyUser);
router.post('/login', login);
router.get('/profile', isLoggedIn, getProfile);
router.get('/logout', isLoggedIn, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

////////// EXPORT
export default router;
