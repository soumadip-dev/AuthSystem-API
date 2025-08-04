import express from 'express';
import { ENV } from './utils/env.js';
import cors from 'cors';
import { connectDB } from './utils/db.js';

const app = express();

const PORT = ENV.PORT || 8080;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Handle GET response from root URl
app.get('/', (req, res) => {
  res.send('<h1>Hello from authentication backend</h1>');
});

// Function to connect to DB and start the server
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
