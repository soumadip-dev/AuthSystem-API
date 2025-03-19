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
    // 1. Get verification token from URL parameters
    const { token } = req.params;
    console.log(token);

    // 2. Validate if token exists
    if (!token) {
      return res.status(400).json({
        message: 'Invalid token',
      });
    }

    // 3. Find user based on token
    const user = await User.findOne({ verificationToken: token });

    // 4. If user not found, return error
    if (!user) {
      return res.status(404).json({
        message: 'User not found or already verified',
      });
    }

    // 5. Update user's isVerified status to true
    user.isVerified = true;

    // 6. Remove verification token from database
    user.verificationToken = null;

    // 7. Save changes to database
    await user.save();

    // 8. Send success response to user
    res.status(200).json({
      message: 'Verification successful. You can now log in.',
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
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    };
    res.cookie('token', token, cookieOptions);

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

// Controller for profile
const getMe = async (req, res) => {
  try {
    // Get user ID from middleware
    const userId = req.user.id;

    // Find user without password
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

// Controller for logout user
const logout = async (req, res) => {
  try {
    // clear the cookies
    res.cookie('token', '', {});
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

// Controller for forgot password
const forgotPassword = async (req, res) => {
  try {
    // 1. Get email from req.body
    const { email } = req.body;
    // 2. validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }
    // 2. find user based on email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    // 3. set reset token and reset ecpiry(Date.now()+10*60*1000)
    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log(resetToken);
    user.resetPasswordToken = resetToken; // set reset token
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10minutes

    // 4. save user with reset token
    await user.save();

    // 5. Send email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    // create email content
    const mailOption = {
      from: process.env.MAILTRAP_SENDEREMAIL || 'no-reply@example.com',
      to: user.email,
      subject: 'Reset Your Password', // Subject line
      text: `Hello ${user.name},\n\nWe received a request to reset your password. Please use the link below to set a new password:\n\n${process.env.BASE_URL}/api/v1/users/reset-password/${resetToken}\n\nThis link is valid for 10 minutes.\n\nIf you did not request this, please ignore this email or contact support if you have concerns.\n\nThank you!`,
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto;">
      <h2 style="color: #333;">Hello <strong>${user.name}</strong>,</h2>
      <p style="font-size: 16px; color: #555;">We received a request to reset your password.</p>
      <p style="font-size: 16px; color: #555;">Click the button below to reset your password:</p>
      <p style="text-align: center;">
        <a href="${process.env.BASE_URL}/api/v1/users/reset-password/${resetToken}" 
          style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p style="font-size: 14px; color: #777;">This link will expire in 10 minutes.</p>
      <p style="font-size: 14px; color: #777;">If you did not request this, you can ignore this email.</p>
      <p style="font-size: 14px; color: #777;">Thank you!</p>
    </div>
  `,
    };

    // send verification email
    await transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
          success: false,
          message: 'Error sending email',
        });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({
          success: true,
          message: 'Password reset email sent successfully',
        });
      }
    });
  } catch (err) {
    console.error('Error sending password reset email:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
// Controller for reset password
const resetPassword = async (req, res) => {
  try {
    // 1. get reset token from params
    const { resetToken } = req.params;
    // 2. password from re.body
    const { password } = req.body;

    // 2. validate reset token
    if (!resetToken || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password is required',
      });
    }
    try {
      const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
      });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token',
        });
      }
      // set password in user
      user.password = password;
      // resetToken,resetExpiry reset them
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      // save changes
      await user.save();

      // Sen success message
      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (err) {
      console.error('Error resetting password:', err);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export {
  forgotPassword,
  getMe,
  login,
  logout,
  registerUser,
  resetPassword,
  verifyUser,
};
