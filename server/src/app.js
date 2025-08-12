import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import auth_routes from './routes/user.routes.js';
import { ENV } from './config/env.config.js';

const app = express();

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

//* Root Route
app.get('/', (req, res) => res.send('<h1>Hello from authentication backend</h1>'));

//* Routes
app.use('/api/v1/users', auth_routes);

export default app;
