import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: ENV.BREVO_HOST,
  port: ENV.BREVO_PORT,
  auth: {
    user: ENV.BREVO_USERNAME,
    pass: ENV.BREVO_PASSWORD,
  },
});

export default transporter;
