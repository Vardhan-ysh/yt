import dotenv from 'dotenv';
dotenv.config();

import { connectToDB } from './db/index.js';

connectToDB();
