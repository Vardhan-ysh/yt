import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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

// Apply the cookie parser middleware to parse the cookies
app.use(cookieParser());
