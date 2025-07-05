import nodemailer from 'nodemailer';
import { ENV } from './env.config.js';

//* Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: ENV.BREVO_HOST,
  port: ENV.BREVO_PORT,
  auth: {
    user: ENV.BREVO_USERNAME,
    pass: ENV.BREVO_PASSWORD,
  },
});

export default transporter;
