export const generateMailOptions = (user, token, emailType) => {
  const emailConfig = {
    verify: {
      subject: 'Verify Your Email Address',
      path: 'verify',
      action: 'verify your email',
      name: 'Verify Email',
    },
    reset: {
      subject: 'Password Reset Request',
      path: 'reset-password',
      action: 'reset your password',
      name: 'Reset Password',
    },
  };
  const { subject, path, action, name } = emailConfig[emailType];
  const link = `${process.env.BASE_URL}/api/v1/users/${path}/${token}`;
  return {
    from: process.env.MAILTRAP_SENDEREMAIL, // Sender email
    to: user.email,
    subject: subject,
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #007bff; text-align: center;">Verify Your Email Address</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>${subject} using the button below:</p>
       <p style="text-align: center;">
        <a href="${link}" 
          style="background-color: #007bff; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
          ${name}
        </a>
        </p>
      <p>If you didn’t request this, you can ignore this email.</p>
      <p style="margin-top: 20px; font-size: 14px; color: #666;">Best regards,<br><strong>Auth Service</strong></p>
    </div>
    `,
  };
};
