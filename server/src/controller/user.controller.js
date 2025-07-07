import {
  registerService,
  loginService,
  sendVerificationEmailService,
} from '../services/user.service.js';
import { ENV } from '../config/env.js';
import generateMailOptions from '../utils/mailTemplates.utils.js';
import transporter from '../config/nodemailer.js';
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

    // Send welcome email to user
    const mailOptions = generateMailOptions({
      user: newUser,
      type: 'welcome',
      companyName: 'Auth System',
    });

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({ message: 'Email sending failed', success: false });
    }

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

  try {
    // Get the user and token from loginService
    const { user, token } = await loginService(email, password);

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

//* Controller for logout
const logoutUser = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie('authToken', {
      httpOnly: true,
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'strict',
      secure: ENV.NODE_ENV === 'production',
    });

    // return success message
    return res.status(200).json({ message: 'User logged out successfully', success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: error.message || 'Something went wrong when logging out',
      success: false,
    });
  }
};

//* Controller to send verification OTP to the user's email
const sendVerificationEmail = async (req, res) => {
  // Get fields from request body
  const { userId } = req.body;
  try {
    const { user, otp } = await sendVerificationEmailService(userId);

    // Send verification email to user
    const mailOptions = generateMailOptions({
      user,
      otp,
      type: 'verifyUser',
      companyName: 'Auth System',
    });

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({ message: 'Email sending failed', success: false });
    }

    // Send success response
    return res.status(200).json({
      message: 'Verification email sent successfully',
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: error.message || 'Something went wrong when logging out',
      success: false,
    });
  }
};

//* Controller to verify user with the OTP
const verifyUser = async (req, res) => {
  // Get fields from request body
  const { userId, otp } = req.body;

  try {
    // Get user by ID
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) throw new Error('User not found');

    // Check if user is already verified
    if (user.isVerified) throw new Error('User already verified');

    console.log(user);

    console.log('DB', user.verificationOtp);
    console.log('BODY', otp);

    // Check if OTP is valid
    if (user.verificationOtp !== otp) throw new Error('Invalid OTP');

    // Check if OTP has expired
    if (user.verificationOtpExpiry < Date.now()) throw new Error('OTP has expired');

    // Update user verification status
    user.isVerified = true;
    user.verificationOtp = null;
    user.verificationOtpExpiry = null;

    // Save the updated user
    await user.save();

    // Send success response
    return res.status(200).json({
      message: 'User verified successfully',
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: error.message || 'Something went wrong when logging out',
      success: false,
    });
  }
};

//* Export controllers
export { registerUser, loginUser, logoutUser, sendVerificationEmail, verifyUser };
