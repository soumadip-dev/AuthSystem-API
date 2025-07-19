import { ENV } from '../config/env.js';

export default function generateMailOptions({ user, otp, type, companyName }) {
  let subject = null;
  let message = null;

  switch (type) {
    case 'welcome':
      subject = `Welcome to ${companyName}!`;
      message = `Welcome to ${companyName}! Your account has been created successfully with the email ${user.email}.`;
      break;

    case 'verifyUser':
      subject = `Your ${companyName} Verification OTP`;
      message = `Use the following One-Time Password (OTP) to verify your email address: ${otp}\n\nThis OTP is valid for a limited time. Do not share it with anyone.`;
      break;

    case 'forgetPassword':
      subject = `Your ${companyName} Password Reset OTP`;
      message = `You requested a password reset. Use the following One-Time Password (OTP) to reset your password: ${otp}\n\nIf you did not request this, please ignore this email. This OTP is valid for a limited time.`;
      break;

    default:
      throw new Error('Unsupported email type');
  }

  return {
    from: ENV.BREVO_SENDEREMAIL,
    to: user.email,
    subject,
    text: `Hello ${user.name},\n\n${message}`,
  };
}
