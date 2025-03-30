////////// IMPORTING
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../model/user.model.js';
import { generateMailOptions } from '../utils/email.templates.js';

dotenv.config();

////////// CONTROLLER FOR REGISTERUSER
const registerUser = async function (req, res) {
  // 1. Get data from body
  const { name, email, password } = req.body;

  // 2. Validate
  if (!name || !email || !password) {
    return res.status(400).json({ 
      status: 'error',
      message: 'All fields are required.' 
    });
  }

  const comprehensiveEmailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!comprehensiveEmailRegex.test(email)) {
    return res.status(400).json({ 
      status: 'error',
      message: 'Invalid email format.' 
    });
  }

  // Password validation
  const upperCaseRegex = /[A-Z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  if (
    password.length < 6 ||
    !upperCaseRegex.test(password) ||
    !numberRegex.test(password) ||
    !specialCharRegex.test(password)
  ) {
    return res.status(400).json({
      status: 'error',
      message: 'Password must be at least 6 characters long, contain an uppercase letter, a number, and a special character.'
    });
  }

  console.log(`📧 Email received for registration: ${email}`);

  try {
    // 3. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️ User already exists:', email);
      return res.status(400).json({ 
        status: 'error',
        message: 'User already exists.' 
      });
    }

    // 4. Create user
    const newUser = await User.create({ name, email, password });
    console.log('✅ User created successfully:', newUser);

    if (!newUser) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Failed to create user.' 
      });
    }

    // 5. Create verification token
    const token = crypto.randomBytes(32).toString('hex');
    console.log('🔑 Verification token generated:', token);

    // 6. Save token
    newUser.verificationToken = token;
    await newUser.save();

    // 7. Send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOptions = generateMailOptions(newUser, token, 'verify');
    await transporter.sendMail(mailOptions);
    console.log(`📩 Verification email sent to: ${newUser.email}`);

    // 8. Return success
    res.status(200).json({
      status: 'success',
      message: 'User registered successfully.',
      success: true,
    });
  } catch (error) {
    console.error('❌ Error during user registration:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while registering the user. Please try again later.',
      success: false,
    });
  }
};

////////// CONTROLLER FOR VERIFYUSER
const verifyUser = async function (req, res) {
  try {
    // 1. Extract token
    const { token } = req.params;
    console.log(`🔍 Received verification token: ${token}`);

    // 2. Validate token
    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Verification token is required.',
        success: false,
      });
    }

    // 3. Find user
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      console.log('⚠️ Invalid verification token');
      return res.status(400).json({
        status: 'error',
        message: 'Invalid verification token.',
        success: false,
      });
    }

    // 4. Update user
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    console.log(`✅ User verified successfully: ${user.email}`);

    // 5. Respond
    res.status(200).json({
      status: 'success',
      message: 'User verified successfully.',
      success: true,
    });
  } catch (error) {
    console.error('❌ Error during verification:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while verifying the user. Please try again later.',
      success: false,
    });
  }
};

////////// CONTROLLER FOR LOGIN
const login = async function (req, res) {
  // 1. Get data
  const { email, password } = req.body;

  // 2. Validate
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Email and password are required.',
      success: false,
    });
  }

  try {
    // 3. Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('⚠️ Invalid email or password attempt:', email);
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email or password.',
        success: false,
      });
    }

    // 4. Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('🚫 Wrong password for:', email);
      return res.status(400).json({
        status: 'error',
        message: 'Wrong password.',
        success: false,
      });
    }

    // 5. Check verification
    if (!user.isVerified) {
      console.log('🔒 User is not verified:', email);
      return res.status(400).json({
        status: 'error',
        message: 'User is not verified.',
        success: false,
      });
    }

    // 6. Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY || 'fallbackSecretKey',
      { expiresIn: '24h' }
    );

    console.log(`✅ Login successful for: ${email}`);

    // 7. Set cookie
    res.cookie('jwtToken', token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 8. Respond
    return res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      success: true,
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('❌ Internal server error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      success: false,
    });
  }
};

////////// CONTROLLER FOR PROFILE
const getProfile = async function (req, res) {
  try {
    // 1. Get user
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
        success: false,
      });
    }
    // 2. Respond
    return res.status(200).json({
      status: 'success',
      user,
      success: true,
    });
  } catch (error) {
    console.error('❌ Internal server error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      success: false,
    });
  }
};

////////// CONTROLLER FOR LOGOUT
const logout = async function (req, res) {
  try {
    // 1. Clear cookie
    res.cookie('jwtToken', '');
    // 2. Respond
    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
      success: true,
    });
  } catch (error) {
    console.error('❌ Internal server error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      success: false,
    });
  }
};

////////// CONTROLLER FOR FORGOTPASSWORD
const forgotPassword = async function (req, res) {
  try {
    // 1. Get email
    const { email } = req.body;

    // 2. Validate
    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required',
        success: false,
      });
    }

    // 3. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
        success: false,
      });
    }

    // 4. Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 5. Update user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // 6. Send email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = generateMailOptions(user, resetToken, 'reset');
    await transporter.sendMail(mailOption);

    console.log(`📩 Password reset email sent to: ${user.email}`);
    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    res.status(500).json({
      status: 'error',
      success: false,
      message: 'Error sending password reset email',
    });
  }
};

////////// CONTROLLER FOR RESET PASSWORD
const resetPassword = async function (req, res) {
  try {
    // 1. Get token and password
    const { resetToken } = req.params;
    const { password } = req.body;

    // 2. Validate
    if (!resetToken || !password) {
      return res.status(400).json({
        status: 'error',
        success: false,
        message: 'Please provide both reset token and new password',
      });
    }

    // 3. Find user
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log('❌ User not found with reset token');
      return res.status(400).json({
        status: 'error',
        success: false,
        message: 'Invalid reset token',
      });
    }

    // 4. Update user
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // 5. Respond
    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    return res.status(500).json({
      status: 'error',
      success: false,
      message: 'Error resetting password',
    });
  }
};

export {
  forgotPassword,
  getProfile,
  login,
  logout,
  registerUser,
  resetPassword,
  verifyUser,
};