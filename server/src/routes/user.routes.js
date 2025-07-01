import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  sendVerificationEmail,
  verifyUser,
  isAuthenticated,
  sendPasswordResetEmail,
} from '../controller/user.controller.js';
import { userAuth } from '../middleware/user.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/send-verification-email', userAuth, sendVerificationEmail);
router.post('/verify-user', userAuth, verifyUser);
router.post('/is-auth', userAuth, isAuthenticated);
router.post('/send-pass-reset-email', sendPasswordResetEmail);

//* Export the router
export default router;
