import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import auth_routes from './routes/user.routes.js';

const app = express();

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());

//* Root Route
app.get('/', (req, res) => res.send('<h1>Hello from authentication backend</h1>'));

//* Routes
app.use('/api/v1/users', auth_routes);

export default app;
