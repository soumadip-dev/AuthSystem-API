import cors from 'cors'; // Importing CORS (Cross-Origin Resource Sharing) middleware
import dotenv from 'dotenv'; // Importing dotenv to load environment variables from a .env file
import express from 'express'; // Importing the Express framework
import db from './utils/db.js';

// import all routes
import userRoutes from './routes/user.routes.js';

dotenv.config(); // Loading environment variables

const app = express(); // Creating an instance of an Express application

app.use(
  cors({
    origin: process.env.BASE_URL, // Allowing requests only from the specified frontend origin
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], // Specifying the allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Defining the allowed request headers
  })
);

const port = process.env.PORT || 3000; // Defining the port number (from .env if available, otherwise default to 3000)

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse incoming form data (extended: true allows nested objects)
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  // Handling a GET request to the root URL ('/')
  res.send('Hello World!'); // Responding with 'Hello World!' when this route is accessed
});

app.get('/about', (req, res) => {
  // Handling a GET request to the '/about' URL
  res.send('About'); // Responding with 'About' when this route is accessed
});

// Connect to Database
db();

// 
app.use('/api/v1/users', userRoutes);

app.listen(port, () => {
  // Starting the server and making it listen on the defined port
  console.log(`Server is running on port ${port}`); // Logging a message when the server starts successfully
});
