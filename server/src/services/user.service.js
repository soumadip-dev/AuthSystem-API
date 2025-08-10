import User from '../model/User.model.js';
import { isValidEmail, isStrongPassword } from '../utils/validation.js';
import { ENV } from '../config/env.js';
import jwt from 'jsonwebtoken';

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
