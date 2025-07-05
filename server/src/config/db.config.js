import mongoose from 'mongoose';
import { ENV } from './env.config.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI, {
      useNewUrlParser: true, // This option tells Mongoose to use the new MongoDB connection string parser instead of the old one.
      useUnifiedTopology: true, // It replaces older connection management logic with a more robust, event-driven engine that better handles:
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.log('❌ MongoDB connection failed');
    process.exit(1);
  }
};
