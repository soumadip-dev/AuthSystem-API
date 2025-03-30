////////// IMPORTING MODULES
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

////////// AUTHENTICATION MIDDLEWARE
export const isLoggedIn = async function (req, res, next) {
  try {
    // 1. Retrieve the token from cookies
    console.log('🍪 Cookies received:', req.cookies);
    const token = req.cookies?.jwtToken;
    console.log('🔍 Token detected:', token ? '✅ YES' : '❌ NO');

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Access denied. No token provided.', success: false });
    }

    // 2. Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('🔑 Decoded token:', decoded);

    // 3. Attach the user to the request object
    req.user = decoded;

    next();
  } catch (error) {
    console.error('⚠️ Token verification failed in middleware:', error.message);
    return res
      .status(401)
      .json({ message: 'Invalid or expired token.', success: false });
  }
};
