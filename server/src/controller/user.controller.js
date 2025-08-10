import { registerService } from '../services/user.service.js';
import { ENV } from '../config/env.js';
import User from '../model/User.model.js';

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

//* Controller for logging in a user
const loginUser = async (req, res) => {
  // Get fields from request body
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required', success: false });
  }

  try {
    // Find the user based on email
    const user = await User.findOne({ email });

    // Chelck if user exists or not
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    // Check if password is correct
    const isPassewordCorrect = await bcrypt.compare(password, user.password);
    if (!isPassewordCorrect) {
      return res.status(401).json({ message: 'Invalid password', success: false });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET, { expiresIn: '7d' });

    // Store JWT token in cookie
    const cookieOptions = {
      httpOnly: true,
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'strict',
      secure: ENV.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie('authToken', token, cookieOptions);

    // Send success response
    return res.status(200).json({
      message: 'User logged in successfully',
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message || 'Something went wrong', success: false });
  }
};

//* Export controllers
export { registerUser, loginUser };
