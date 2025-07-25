import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
const clientConfigs = new Map();
const requestLogs = new Map();
import rateLimiter from "./routers/rateLimiter.route.js"
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/admin', rateLimiter);

export { app }