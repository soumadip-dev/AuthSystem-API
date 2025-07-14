import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  sendVerificationEmail,
} from '../controller/user.controller.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/send-verification-email', sendVerificationEmail);

//* Export the router
export default router;
