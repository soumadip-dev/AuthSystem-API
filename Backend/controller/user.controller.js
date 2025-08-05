import User from '../model/User.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { ENV } from '../utils/env.js';
import generateMailOptions from '../utils/mailTemplates.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Controller for registering a user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  // Check if all fields are provided
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required', success: false });

  // Check if email is valid
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ message: 'Email is not valid', success: false });

  // Check if password is strong enough
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  if (!passwordRegex.test(password))
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
    const mailOptions = generateMailOptions({ user: newUser, token, type: 'verify' });

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
    const isPaswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPaswordCorrect)
      return res.status(401).json({ message: 'Password is incorrect', success: false });

    // Geberate JWT token
    const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET, { expiresIn: '1d' });

    // Store jwt token in cookie
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Something went wrong', success: false });
  }
};

// Export controllers
export { registerUser, verifyUser };
