import User from '../model/User.model.js';
import { isValidEmail, isStrongPassword } from '../utils/validation.utils.js';
import { ENV } from '../config/env.config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

//* Service for registering a user
export const registerService = async (name, email, password) => {
  // Check if all fields are provided
  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }

  // Check if email is valid
  if (!isValidEmail(email)) {
    throw new Error('Email is not valid');
  }

  // Check if password is strong enough
  if (!isStrongPassword(password)) {
    throw new Error('Password is not strong enough');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Create new user
  const newUser = await User.create({ name, email, password });
  if (!newUser) {
    throw new Error('User not registered');
  }

  // Generate JWT token
  const token = jwt.sign({ id: newUser._id }, ENV.JWT_SECRET, { expiresIn: '7d' });

  return { newUser, token };
};

//* Service for logging in a user
export const loginService = async (email, password) => {
  // Check if email and password are provided
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Find the user based on email
  const user = await User.findOne({ email });

  // Chelck if user exists or not
  if (!user) {
    throw new Error('User not found');
  }

  // Check if password is correct
  const isPassewordCorrect = await bcrypt.compare(password, user.password);
  if (!isPassewordCorrect) {
    throw new Error('Invalid password');
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET, { expiresIn: '7d' });

  // Return user and token
  return { user, token };
};

//* Service for send verification OTP to the user's email
export const sendVerificationEmailService = async userId => {
  // Find the user by ID
  const user = await User.findById(userId);

  // Check if user exists
  if (!user) throw new Error('User not found');

  // Check if user is already verified
  if (user.isVerified) throw new Error('User already verified');

  // Generate OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));

  // update user verificationOtp and verificationOtpExpiry
  user.verificationOtp = otp;
  user.verificationOtpExpiry = Date.now() + 24 * 60 * 60 * 1000;

  // Save the updated user
  await user.save();

  return { user, otp };
};

//* Service for verify user
export const verifyUserService = async (userId, otp) => {
  // Get user by ID
  const user = await User.findById(userId);

  // Check if user exists
  if (!user) throw new Error('User not found');

  // Check if OTP is provided
  if (!otp) throw new Error('OTP is required');

  // Check if user is already verified
  if (user.isVerified) throw new Error('User already verified');

  // Check if OTP is valid
  if (user.verificationOtp === '' || user.verificationOtp !== otp) throw new Error('Invalid OTP');

  // Check if OTP has expired
  if (user.verificationOtpExpiry < Date.now()) throw new Error('OTP has expired');

  // Update user verification status
  user.isVerified = true;
  user.verificationOtp = '';
  user.verificationOtpExpiry = 0;

  // Save the updated user
  await user.save();
};

//* Service for send password reset OTP to the user's email
export const sendPasswordResetEmailService = async email => {
  // Chek if email is provided
  if (!email) {
    throw new Error('Email is required');
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  // Generate OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));

  // update user resetPasswordOtp and resetPasswordOtpExpiry
  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpiry = Date.now() + 24 * 60 * 60 * 1000;

  // Save the updated user
  await user.save();

  return { user, otp };
};

//* Service for reset password
export const resetPasswordService = async (email, otp, newPassword) => {
  // Check if email, otp, and newPassword are provided
  if (!email || !otp || !newPassword) {
    throw new Error('Email, OTP, and new password are required');
  }

  // Find user based on email
  const user = await User.findOne({ email });

  // Check if the user exists or not
  if (!user) {
    throw new Error('User not found');
  }

  // Check if provided OTP is valid or not
  if (user.resetPasswordOtp === '' || user.resetPasswordOtp !== otp) {
    throw new Error('Invalid OTP');
  }

  // Check if OTP has expired or not
  if (user.resetPasswordOtpExpiry < Date.now()) {
    throw new Error('OTP has expired');
  }

  // Check if password is strong enough or not
  if (!isStrongPassword(newPassword)) {
    throw new Error('Password is not strong enough');
  }

  // Check if password is sam eas previous
  const isPasswordSame = await bcrypt.compare(newPassword, user.password);
  if (isPasswordSame) {
    throw new Error('Password is same as previous');
  }

  // Change the password
  user.password = newPassword;
  user.resetPasswordOtp = '';
  user.resetPasswordOtpExpiry = 0;

  // Save the user
  await user.save();
};
