import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

// export a function that connect to db
const db = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log('Connected to mongoDb');
    })
    .catch(err => {
      console.log('Error connecting to mongodb');
    });
};

export default db;
