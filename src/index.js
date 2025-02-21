import dotenv from 'dotenv';
dotenv.config();

import { connectToDB } from './db/index.js';
import { app } from './app.js';

// Connect to the database and start the server
connectToDB()
  .then(() => {
    app.on('ready', () => {
      console.log('App is ready');
    });

    app.on('error', (error) => {
      console.error('App error:', error);
      throw new Error('App initialization failed');
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
      console.log(`App is available at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database', error);
  });
