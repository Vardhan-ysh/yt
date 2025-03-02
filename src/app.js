import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Apply the cookie parser middleware to parse the cookies
app.use(cookieParser());

// Apply the json middleware to parse the JSON data
app.use(
  express.json({
    limit: '50mb',
  })
);

// Apply the urlencoded middleware to parse the URL-encoded data
app.use(
  express.urlencoded({
    extended: true,
    limit: '50mb',
  })
);

// Serve the static files from the public directory
app.use(
  express.static('public', {
    maxAge: 31557600000,
  })
);

// routes import
import userRouter from './routes/user.routes.js';

// routes
app.use('/users', userRouter);

export { app };
