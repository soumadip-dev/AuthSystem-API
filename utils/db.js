////////// IMPORTING
import dotenv from 'dotenv';
import mongoose from 'mongoose';

////////// DATABASE CONNECTION FUNCTION
const db = () => {
  dotenv.config();
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log('✅ Successfully connected to the database.');
    })
    .catch(err => {
      console.error(
        '❌ Database connection failed. Please check your configuration.'
      );
    });
};

////////// EXPORTING
export default db;
