import jwt from 'jsonwebtoken';
import { ENV } from '../utils/env.js';

export const isLoggedIn = async (req, res, next) => {
  try {
    // Check if a token is present in the cookies
    console.log(req.cookies);

    let token = req.cookies?.jwt;

    // If no token is present, return an unauthorized response
    console.log('Token Found', token ? 'True' : 'False');
    if (!token) {
      console.log('No token found');
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    if (!ENV.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in env');
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    // Add the decoded user to the request object
    console.log('Decoded Token', decoded);

    req.user = decoded;
    next();
  } catch (error) {
    // Handle any errors that occur during the middleware execution
    console.error('Middleware error:', error.message);
    res.status(500).json({ message: error.message, success: false });
  }
};
