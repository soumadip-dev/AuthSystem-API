import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../model/user.model.js';

// Controller of register user
const registerUser = async (req, res) => {
  // 1. Get data from request body
  const { name, email, password } = req.body;

  // 2. Validate input fields
  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Please fill in all fields',
    });
  }

  try {
    // 3. Check if user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists',
      });
    }

    // 4. Create a new user in the database
    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user) {
      return res.status(500).json({
        message: 'User not created',
      });
    }

    // 5. Generate a verification token
    const token = crypto.randomBytes(32).toString('hex');
    console.log(token);

    // Assign token to user object
    user.verificationToken = token;

    // 6. Save the user with the verification token in the database
    await user.save();

    // 7. Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    // Email details
    const mailOptions = {
      from: process.env.MAILTRAP_SENDEREMAIL, // Sender email
      to: user.email, // Recipient email
      subject: 'Verify Your Email Address', // Subject
      text: `Hello ${user.name},\n\nPlease verify your email using the following link:\n\n${process.env.BASE_URL}/api/v1/users/verify/${token}\n\nThank you!`, // Plain text body
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto;">
          <h2 style="color: #333;">Hello <strong>${user.name}</strong>,</h2>
          <p style="font-size: 16px; color: #555;">Please verify your email by clicking the button below:</p>
          <p style="text-align: center;">
            <a href="${process.env.BASE_URL}/api/v1/users/verify/${token}" 
              style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
              Verify Email
            </a>
          </p>
          <p style="font-size: 14px; color: #777;">If you didn’t request this, you can ignore this email.</p>
          <p style="font-size: 14px; color: #777;">Thank you!</p>
        </div>
      `, // HTML email body
    };

    // Send verification email
    await transporter.sendMail(mailOptions);

    // 8. Send success response to user
    res.status(201).json({
      message: 'User registered successfully.',
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

// Controller for user verification
const verifyUser = async (req, res) => {
  try {
    // 1. Get verification token from URL query parameter
    const token = req.params;
    console.log(token);
    // 2. validate if token
    if (!token) {
      return res.status(400).json({
        message: 'Invalid token',
      });
    }
    // 3. find user based on token
    const user = await User.findOne({ verificationToken: token });
    // 4. if not found, return error
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    // 5. if found, update user's isVerified status to true
    user.isVerified = true;
    // 6. remove verification token from database
    user.verificationToken = '';
    // 7. save changes to database
    await user.save();
    // 8. send success response to user
    res.status(201).json({
      message: 'verfication successfull',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

// Controller fro login
const login = async (req, res) => {
  try {
    // 1. get user credentials from request body
    const { email, password } = req.body;
    // 2. validate if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }
    // 3. find user based on email
    const user = await User.findOne({ email });
    // 4. if not found, return error
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    // 5. compare password with hashed password in database
    const isValidPassword = await bcrypt.compare(password, user.password);
    // 6. if password is invalid, return error
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid password',
      });
    }
    // 7. check if user is verified or not
    if (!user.isVerified) {
      return res.status(401).json({
        message: 'User is not verified',
      });
    }
    // 8. generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
      },
      'shhhhh',
      {
        expiresIn: '24h',
      }
    );

    // 9. store JWT token in cookie
    res.cookie('test', token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // 10. send success response to user
    res.status(200).json({
      message: 'Login successful',
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

export { login, registerUser, verifyUser };
