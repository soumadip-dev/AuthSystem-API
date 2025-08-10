import express from 'express';
import { ENV } from './src/utils/env.js';
import cors from 'cors';
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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
