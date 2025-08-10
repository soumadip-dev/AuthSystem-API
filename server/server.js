import express from 'express';

const app = express();

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Root Route
app.use('/', (req, res) => res.send('<h1>Hello from authentication backend</h1>'));

app.listen(8080, () => console.log('Server is running on port 8080'));
