import { Router } from 'express';
import { registerUser } from '../controller/user.controller.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/register', registerUser);

//* Export the router
export default router;
