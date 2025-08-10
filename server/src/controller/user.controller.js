import { registerService } from '../services/user.service.js';
import { ENV } from '../config/env.js';

//* Controller for registering a user
const registerUser = async (req, res) => {
  // Get fields from request body
  const { name, email, password } = req.body;

  try {
    // Get the user and token from registerService
    const { newUser, token } = await registerService(name, email, password);

    // Store JWT token in cookie
    const cookieOptions = {
      httpOnly: true,
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'strict',
      secure: ENV.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie('authToken', token, cookieOptions);

    // Send success response
    res.status(201).json({
      message: 'User registered successfully',
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message || 'Something went wrong', success: false });
  }
};

export { registerUser };
