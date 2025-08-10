import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  BASE_URL: process.env.BASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  BREVO_HOST: process.env.BREVO_HOST,
  BREVO_PORT: process.env.BREVO_PORT,
  BREVO_USERNAME: process.env.BREVO_USERNAME,
  BREVO_PASSWORD: process.env.BREVO_PASSWORD,
  BREVO_SENDEREMAIL: process.env.BREVO_SENDEREMAIL,
};
