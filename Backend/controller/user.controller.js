import User from '../model/User.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { ENV } from '../utils/env.js';
import generateMailOptions from '../utils/mailTemplates.js';

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

    // If no User found crate an user
    const newUser = await User.create({ name, email, password });

    if (!newUser) return res.status(500).json({ message: 'User not registered', success: false });

    const token = crypto.randomBytes(32).toString('hex');
    console.log(token);

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
    }

    res.status(201).json({ message: 'User created successfully', success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Something went wrong', success: false });
  }
};

export { registerUser };
