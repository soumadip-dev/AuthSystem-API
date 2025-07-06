import {
  registerService,
  loginService,
  sendVerificationEmailService,
  verifyUserService,
  sendPasswordResetEmailService,
} from '../services/user.service.js';
import { ENV } from '../config/env.config.js';
import generateMailOptions from '../utils/mailTemplates.utils.js';
import transporter from '../config/nodemailer.config.js';
import User from '../model/User.model.js';
import { isStrongPassword } from '../utils/validation.utils.js';
import bcrypt from 'bcryptjs';

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
  const { userId } = req.user;

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
  // Get otp from request body
  const { otp } = req.body;

  // Get userId from request.user attached by userAuth middleware
  const { userId } = req.user;

  try {
    await verifyUserService(userId, otp);
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

//* Controller to check if user is authenticated
const isAuthenticated = (req, res) => {
  try {
    // Send success response
    return res.status(200).json({
      message: 'User is authenticated',
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

//* Controller to send password reset email to the user's email
const sendPasswordResetEmail = async (req, res) => {
  // Get the email from body
  const { email } = req.body;

  try {
    // Get the user and otp from sendPasswordResetEmailService
    const { user, otp } = await sendPasswordResetEmailService(email);

    // Send password reset email to user
    const mailOptions = generateMailOptions({
      user,
      otp,
      type: 'forgetPassword',
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
      message: 'Password reset email sent successfully',
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

//* Controller to reset password with the OTP
const resetPassword = async (req, res) => {
  // Get otp from request body
  const { email, otp, newPassword } = req.body;

  // Check if email, otp, and newPassword are provided
  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: 'Email, OTP, and new password are required', success: false });
  }

  try {
    // Find user based on email
    const user = await User.findOne({ email });

    // Check if the user exists or not
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    // Check if provided OTP is valid or not
    if (user.resetPasswordOtp === '' || user.resetPasswordOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP', success: false });
    }

    // Check if OTP has expired or not
    if (user.resetPasswordOtpExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired', success: false });
    }

    // Check if password is strong enough or not
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ message: 'Password is not strong enough', success: false });
    }

    // Check if password is sam eas previous
    const isPasswordSame = await bcrypt.compare(newPassword, user.password);
    if (isPasswordSame) {
      return res.status(400).json({ message: 'Password is same as previous', success: false });
    }

    // Change the password
    user.password = newPassword;
    user.resetPasswordOtp = '';
    user.resetPasswordOtpExpiry = 0;

    // Save the user
    await user.save();

    // Send success response
    return res.status(200).json({
      message: 'Password reset successfully',
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
export {
  registerUser,
  loginUser,
  logoutUser,
  sendVerificationEmail,
  verifyUser,
  isAuthenticated,
  sendPasswordResetEmail,
  resetPassword,
};
