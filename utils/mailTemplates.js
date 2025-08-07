import { ENV } from './env.js';

export default function generateMailOptions({ user, token, type, companyName }) {
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
      actionUrlPath = `/api/v1/users/reset-password/${token}`;
      message = 'Click the button below to reset your password:';
      break;

    case 'welcome':
      subject = 'Welcome to Our Platform!';
      actionText = null;
      actionUrlPath = null;
      message = 'We are excited to have you with us.';
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
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
          <div style="background: linear-gradient(135deg, #4361ee, #3a0ca3); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">${subject}</h1>
          </div>
          
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hello <strong>${
              user.name
            }</strong>,</p>
            <p style="font-size: 16px; color: #555; margin-bottom: 30px;">${message}</p>
            
            ${
              fullActionUrl
                ? `<div style="margin: 30px 0; text-align: center;">
                    <a href="${fullActionUrl}" 
                      style="background: linear-gradient(135deg, #4361ee, #3a0ca3); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-size: 16px; 
                      font-weight: 500;
                      display: inline-block;
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                      transition: all 0.3s ease;">
                      ${actionText}
                    </a>
                  </div>`
                : ''
            }
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px;">
              <p style="font-size: 14px; color: #888; margin-bottom: 10px;">If you didn't request this, you can safely ignore this email.</p>
              <p style="font-size: 14px; color: #888; margin: 0;">Thank you for using our service!</p>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px 0; color: #999; font-size: 12px;">
          <p style="margin: 5px 0;">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
        </div>
      </div>
    `,
  };
}
