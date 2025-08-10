import User from '../model/User.model.js';
import { isValidEmail, isStrongPassword } from '../utils/validation.js';
import { ENV } from '../config/env.js';
import jwt from 'jsonwebtoken';

//* Controller for registering a user
const registerUser = async (req, res) => {
  // Get fields from request body
  const { name, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required', success: false });
  }

  // Check if email is valid
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Email is not valid', success: false });
  }

  // Check if password is strong enough
  if (!isStrongPassword(password)) {
    return res.status(400).json({ message: 'Password is not strong enough', success: false });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists', success: false });
    }

    // Create a new user
    const newUser = await User.create({ name, email, password });

    // If user is not created return error
    if (!newUser) return res.status(500).json({ message: 'User not registered', success: false });

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, ENV.JWT_SECRET, { expiresIn: '7d' });

    // Store JWT token in cookie
    const cookieOptions = {
      httpOnly: true,
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'strict',
      secure: ENV.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res.cookie('authToken', token, cookieOptions);

    // Send success response
    res.status(201).json({
      message: 'User registered successfully',
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message || 'Something went wrong', success: false });
  }
};

export { registerUser };
