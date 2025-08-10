import express from 'express';
import { ENV } from './src/utils/env.js';
import cors from 'cors';
import { connectDB } from './src/utils/db.js';
import cookieParser from 'cookie-parser';

const app = express();

const PORT = ENV.PORT || 8080;

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
  })
);
app.use(cookieParser());

//* Root Route
app.use('/', (req, res) => res.send('<h1>Hello from authentication backend</h1>'));

//* Function to connect the DB and start the server
const startServer = async () => {
  try {
    await connectDB(); // Ensure DB is connected before starting the server
    app.listen(PORT, () => {
      console.info(`✔️ Server is up and running on port: ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};
startServer();
