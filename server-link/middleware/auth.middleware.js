import jwt from 'jsonwebtoken';
import { ENV } from '../utils/env.js';

export const isLoggedIn = async (req, res, next) => {
  try {
    // Get the token from the cookies
    let token = req.cookies?.jwt;

    // If no token is present, return an unauthorized response
    if (!token) {
      console.log('No token found');
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    // Add the decoded user to the request object for later use
    req.user = decoded;
    next();
  } catch (error) {
    // Handle any errors that occur during the middleware execution
    console.error('Middleware error:', error.message);
    res.status(500).json({ message: error.message, success: false });
  }
};
