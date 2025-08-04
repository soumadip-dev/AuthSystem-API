import { ENV } from './env';

export default function generateMailOptions({ user, token, type }) {
  let subject, actionText, actionUrlPath, message;

  switch (type) {
    case 'verify':
      subject = 'Verify Your Email Address';
      actionText = 'Verify Email';
      actionUrlPath = `/api/v1/users/verify/${token}`;
      message = 'Please verify your email by clicking the button below:';
      break;

    case 'reset':
      subject = 'Reset Your Password';
      actionText = 'Reset Password';
      actionUrlPath = `/reset-password/${token}`;
      message = 'Click the button below to reset your password:';
      break;

    case 'welcome':
      subject = 'Welcome to Our Platform!';
      actionText = null;
      actionUrlPath = null;
      message = 'We’re excited to have you with us.';
      break;

    default:
      throw new Error('Unsupported email type');
  }

  const baseUrl = ENV.BASE_URL;
  const fullActionUrl = actionUrlPath ? `${baseUrl}${actionUrlPath}` : null;

  return {
    from: process.env.MAILTRAP_SENDEREMAIL,
    to: user.email,
    subject,
    text: `Hello ${user.name},\n\n${message}${
      fullActionUrl ? `\n\n${fullActionUrl}` : ''
    }\n\nThank you!`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto;">
        <h2 style="color: #333;">Hello <strong>${user.name}</strong>,</h2>
        <p style="font-size: 16px; color: #555;">${message}</p>
        ${
          fullActionUrl
            ? `<p style="text-align: center;">
                <a href="${fullActionUrl}" 
                  style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
                  ${actionText}
                </a>
              </p>`
            : ''
        }
        <p style="font-size: 14px; color: #777;">If you didn’t request this, you can ignore this email.</p>
        <p style="font-size: 14px; color: #777;">Thank you!</p>
      </div>
    `,
  };
}
