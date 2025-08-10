import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

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
app.get('/', (req, res) => res.send('<h1>Hello from authentication backend</h1>'));

export default app;
