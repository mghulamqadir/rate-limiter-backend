import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

import rateLimiter from "./routers/rateLimiter.route.js"

const app = express();
dotenv.config();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', rateLimiter);

export { app }