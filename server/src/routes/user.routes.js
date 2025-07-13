import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controller/user.controller.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

//* Export the router
export default router;
