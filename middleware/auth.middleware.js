import jwt from 'jsonwebtoken';
export const isLoggedIn = async (req, res, next) => {
  try {
    // Get token from cookie
    let token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: 'Authentication failed',
        success: false,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, 'shhhhh');
    console.log('Decoded data: ', decoded); 

    // Attach user to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth middleware failure:', err);

    // Handle JWT specific errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token',
        success: false,
      });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired',
        success: false,
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
  // Remove extra next() here
};
