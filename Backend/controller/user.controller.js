import User from '../model/User.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { ENV } from '../utils/env.js';
import generateMailOptions from '../utils/mailTemplates.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isValidEmail, isStrongPassword } from '../utils/validation.js';

// Controller for registering a user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  // Check if all fields are provided
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required', success: false });

  // Check if email is valid
  if (!isValidEmail(email))
    return res.status(400).json({ message: 'Email is not valid', success: false });

  // Check if password is strong enough
  if (!isStrongPassword(password))
    return res.status(400).json({ message: 'Password is not strong enough', success: false });

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists', success: false });

    // If no User found create an user
    const newUser = await User.create({ name, email, password });

    if (!newUser) return res.status(500).json({ message: 'User not registered', success: false });

    const token = crypto.randomBytes(32).toString('hex');

    // Store the token in the user
    newUser.verificationToken = token;

    // Save the user
    await newUser.save();

    // Configure email transport
    const transporter = nodemailer.createTransport({
      host: ENV.MAILTRAP_HOST,
      port: ENV.MAILTRAP_PORT,
      auth: {
        user: ENV.MAILTRAP_USERNAME,
        pass: ENV.MAILTRAP_PASSWORD,
      },
    });

    // Send email
    const mailOptions = generateMailOptions({
      user: newUser,
      token,
      type: 'verify',
      companyName: 'Auth System',
    });

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({ message: 'Email sending failed', success: false });
    }

    res.status(201).json({ message: 'User created successfully', success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Something went wrong', success: false });
  }
};

// Controller for user verification
const verifyUser = async (req, res) => {
  // Get verification token from URL parameters
  const { token } = req.params;
  console.log(token);

  // Check if token is provided
  if (!token)
    return res.status(400).json({ message: 'Verification token is required', success: false });

  try {
    // Find user based on verification token
    const user = await User.findOne({ verificationToken: token });

    // Check if user found or not
    if (!user) return res.status(404).json({ message: 'User not found', success: false });

    // Update user verification status and remove verification token
    user.isVerified = true;
    user.verificationToken = undefined;

    // Save user
    await user.save();

    // Send success response
    res.status(200).json({ message: 'User verified successfully', success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Something went wrong', success: false });
  }
};

// Controller for user login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required', success: false });

  try {
    // Find user based on email
    const user = await User.findOne({ email });

    // Check if user found or not
    if (!user) return res.status(404).json({ message: 'User not found', success: false });

    // Check if user is verified or not
    if (!user.isVerified)
      return res.status(401).json({ message: 'User is not verified', success: false });

    // Check if password is correct or not
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: 'Password is incorrect', success: false });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, ENV.JWT_SECRET, { expiresIn: '1d' });

    // Store jwt token in cookie
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'strict',
      secure: ENV.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie('jwt', token, cookieOptions);

    // Send success response
    res.status(200).json({
      message: 'User logged in successfully',
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Something went wrong', success: false });
  }
};

// Controller for getting current user
const getMe = async (req, res) => {
  try {
    // Find user based on id without password
    const user = await User.findById(req.user.id).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found', success: false });

    res.status(200).json({ message: 'User found', success: true, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Something went wrong', success: false });
  }
};

// Controller for logout
const logout = async (req, res) => {
  try {
    // Clear the cookie
    res.cookie('jwt', '', {});
    // return success message
    res.status(200).json({ message: 'User logged out successfully', success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Something went wrong when logging out', success: false });
  }
};

// Controller for forgot password
const forgotPassword = async (req, res) => {
  // Get the email from the request body
  const { email } = req.body;

  // Check if the email is present or not
  if (!email) return res.status(400).json({ message: 'Email is required', success: false });

  try {
    // Find the user based on email
    const user = await User.findOne({ email });

    // Check if the user is present or not
    if (!user)
      return res.status(404).json({ message: 'User not found with this email', success: false });

    // Generate a random token for password reset
    const token = crypto.randomBytes(32).toString('hex');

    // Store the token inside resetPasswordToken
    user.resetPasswordToken = token;

    // Save the user after updating
    await user.save();

    // Configure email transport
    const transporter = nodemailer.createTransport({
      host: ENV.MAILTRAP_HOST,
      port: ENV.MAILTRAP_PORT,
      auth: {
        user: ENV.MAILTRAP_USERNAME,
        pass: ENV.MAILTRAP_PASSWORD,
      },
    });

    // Send email
    const mailOptions = generateMailOptions({
      user,
      token,
      type: 'reset',
      companyName: 'Auth System',
    });
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({ message: 'Email sending failed', success: false });
    }

    res.status(200).json({ message: 'Password reset email sent successfully', success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Something went wrong', success: false });
  }
};

// Controller for reset password
const resetPassword = async (req, res) => {
  // Get reset token from URL parameters
  const { token } = req.params;
  const { password } = req.body;

  // Check if token is present or not
  if (!token) return res.status(400).json({ message: 'Reset token is required', success: false });

  try {
    // Find user based on reset token
    const user = await User.findOne({ resetPasswordToken: token });

    // Check if user is present or not
    if (!user)
      return res
        .status(404)
        .json({ message: 'User not found with this reset token', success: false });

    // Check if password is strong enough
    if (!isStrongPassword(password))
      return res.status(400).json({ message: 'Password is not strong enough', success: false });

    // Update the user by setting the password(hashing in pre hook) and remove reset token
    user.password = password;
    user.resetPasswordToken = undefined;

    // Save the user after updating
    await user.save();

    // Send success response
    res.status(200).json({ message: 'Password reset successfully', success: true });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: 'Something went wrong when resetting password', success: false });
  }
};

// Export controllers
export { registerUser, verifyUser, login, getMe, logout, forgotPassword, resetPassword };
