import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.config.js';

//* Middleware for user authentication
export const userAuth = async (req, res, next) => {
  try {
    console.log('All cookies:', req.cookies); // Debug: Check all received cookies
    const token = req.cookies?.authToken;
    console.log('Extracted token:', token); // Debug: Verify token extraction

    // If no token is present, respond with 401 Unauthorized
    if (!token) {
      console.log('No token found');
      return res.status(401).json({ message: 'Unauthorized. Login again', success: false });
    }

    // Verify the token using the secret key from environment variables
    const { id } = jwt.verify(token, ENV.JWT_SECRET);

    // If the token contains a user id, attach it to the request body for downstream handlers
    if (id) {
      req.user = { userId: id };
    } else {
      // If no id is found in token payload, respond with 401 Unauthorized
      return res.status(401).json({ message: 'Unauthorized. Login again', success: false });
    }

    // Call next middleware or route handler
    next();
  } catch (error) {
    console.error('Middleware error:', error.message);
    res.status(500).json({ message: error.message, success: false });
  }
};
