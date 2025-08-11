import { ENV } from '../config/env.config.js';

//* Function to generate mail options
export default function generateMailOptions({ user, otp, type, companyName }) {
  // Modern color palette
  const colors = {
    primary: '#4361ee',
    secondary: '#3a0ca3',
    accent: '#7209b7',
    light: '#f8f9fa',
    dark: '#212529',
    muted: '#6c757d',
    success: '#4bb543',
  };

  // Base container styles
  const containerStyles = `
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: ${colors.dark};
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    border-radius: 8px;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  `;

  // Header styles
  const headerStyles = `
    color: ${colors.primary};
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  `;

  // OTP display styles
  const otpStyles = `
    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%);
    color: white;
    padding: 1rem 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.5rem;
    text-align: center;
    margin: 2rem auto;
    border-radius: 8px;
    display: inline-block;
    box-shadow: 0 2px 8px rgba(67, 97, 238, 0.3);
  `;

  // Button styles (for potential future use)
  const buttonStyles = `
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: ${colors.primary};
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
    margin: 1rem 0;
  `;

  // Footer styles
  const footerStyles = `
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 0.85rem;
    color: ${colors.muted};
  `;

  // Greeting component
  const greeting = `<p style="margin-bottom: 1.5rem;">Hello <strong>${user.name}</strong>,</p>`;

  let subject, textMessage, htmlMessage;

  switch (type) {
    case 'welcome':
      subject = `Welcome to ${companyName}!`;
      textMessage = `Welcome to ${companyName}! Your account has been created successfully with the email ${user.email}.`;
      htmlMessage = `
        <div style="${containerStyles}">
          <h1 style="${headerStyles}">Welcome to ${companyName}!</h1>
          ${greeting}
          <p style="margin-bottom: 1rem;">Thank you for joining ${companyName}! Your account has been successfully created with the email <strong>${
        user.email
      }</strong>.</p>
          <p style="margin-bottom: 1.5rem;">We're thrilled to have you on board and can't wait to see what you'll accomplish.</p>
          
          <div style="background: ${
            colors.light
          }; padding: 1rem; border-radius: 8px; margin: 1.5rem 0;">
            <p style="margin: 0; font-size: 0.9rem;">Get started by exploring our platform and completing your profile.</p>
          </div>
          
          <div style="${footerStyles}">
            <p style="margin: 0.5rem 0;">If you didn't create this account, please contact our support team immediately at <a href="mailto:support@${companyName
              .toLowerCase()
              .replace(/\s/g, '')}.com" style="color: ${colors.primary};">support@${companyName
        .toLowerCase()
        .replace(/\s/g, '')}.com</a>.</p>
            <p style="margin: 0.5rem 0;">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
          </div>
        </div>
      `;
      break;

    case 'verifyUser':
      subject = `Your ${companyName} Verification Code`;
      textMessage = `Use the following One-Time Password (OTP) to verify your email address: ${otp}\n\nThis OTP is valid for 24 hours. Do not share it with anyone.`;
      htmlMessage = `
        <div style="${containerStyles}">
          <h1 style="${headerStyles}">Verify Your Email</h1>
          ${greeting}
          <p style="margin-bottom: 1rem;">Thank you for registering with ${companyName}. To complete your registration, please verify your email address using the OTP below:</p>
          
          <div style="${otpStyles}">${otp}</div>
          
          <p style="margin-bottom: 1.5rem; font-size: 0.9rem; color: ${colors.muted};">This verification code will expire in 24 hours. Please don't share it with anyone.</p>
          
          <div style="${footerStyles}">
            <p style="margin: 0.5rem 0;">If you didn't request this verification, please ignore this email or contact support if you have concerns.</p>
          </div>
        </div>
      `;
      break;

    case 'forgetPassword':
      subject = `Reset Your ${companyName} Password`;
      textMessage = `You requested a password reset. Use the following One-Time Password (OTP) to reset your password: ${otp}\n\nIf you did not request this, please ignore this email. This OTP is valid for 15 minutes.`;
      htmlMessage = `
        <div style="${containerStyles}">
          <h1 style="${headerStyles}">Password Reset Request</h1>
          ${greeting}
          <p style="margin-bottom: 1rem;">We received a request to reset the password for your ${companyName} account.</p>
          <p style="margin-bottom: 1.5rem;">Please use the following OTP to reset your password:</p>
          
          <div style="${otpStyles}">${otp}</div>
          
          <p style="margin-bottom: 1rem; font-size: 0.9rem; color: ${
            colors.muted
          };">This OTP is valid for 15 minutes. If you didn't request this password reset, you can safely ignore this email.</p>
          
          <div style="margin: 1.5rem 0; padding: 1rem; background: ${
            colors.light
          }; border-radius: 8px;">
            <p style="margin: 0; font-size: 0.9rem;">For your security, we recommend:</p>
            <ul style="margin: 0.5rem 0 0 1rem; padding-left: 1rem;">
              <li>Choosing a strong, unique password</li>
              <li>Updating your password regularly</li>
              <li>Enabling two-factor authentication</li>
            </ul>
          </div>
          
          <div style="${footerStyles}">
            <p style="margin: 0.5rem 0;">Need help? Contact our support team at <a href="mailto:support@${companyName
              .toLowerCase()
              .replace(/\s/g, '')}.com" style="color: ${colors.primary};">support@${companyName
        .toLowerCase()
        .replace(/\s/g, '')}.com</a></p>
          </div>
        </div>
      `;
      break;

    default:
      throw new Error('Unsupported email type');
  }

  return {
    from: `${companyName} <${ENV.BREVO_SENDEREMAIL}>`,
    to: user.email,
    subject,
    text: `Hello ${user.name},\n\n${textMessage}\n\nBest regards,\nThe ${companyName} Team`,
    html: htmlMessage,
  };
}
