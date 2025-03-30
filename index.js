////////// IMPORTING
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import userRoutes from './routes/user.routes.js';
import db from './utils/db.js';

dotenv.config(); // Load environment variables from the .env file

////////// INITIALIZING EXPRESS APPLICATION
const app = express();

////////// CONFIGURING CORS (CROSS-ORIGIN RESOURCE SHARING)
app.use(
  cors({
    origin: process.env.BASE_URL, // Allowed origin from environment variables
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed request headers
  })
);

////////// CONFIGURING MIDDLEWARES
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies'
app.use(cookieParser()); // Parse cookies from incoming requests

////////// SETTING SERVER PORT
const port = process.env.PORT || 8000;

////////// CONNECTING TO DATABASE
db();

////////// DEFINING ROUTES
app.use('/api/v1/users', userRoutes);

////////// STARTING THE SERVER
app.listen(port, () => {
  console.log(`🔥 Server is running on port ${port}`);
});
