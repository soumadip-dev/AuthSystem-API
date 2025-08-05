import { Router } from 'express';

// Import the user controller
import { registerUser, verifyUser, login } from '../controller/user.controller.js';

// create a new Express router
const router = Router();

// Define routes
router.post('/register', registerUser);
router.get('/verify/:token', verifyUser);
router.post('/login', login);

// Export the router
export default router;
