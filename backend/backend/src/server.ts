// src/server.ts
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import adminRouter from './routes/adminRoutes';

import { CORS_ORIGIN } from './constants/index';
import { getCorsOptions } from './utils/createCorsMiddleware';

const app = express();

app.set('view engine', 'ejs');
app.use(cors(getCorsOptions(CORS_ORIGIN)));
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRouter);

app.use('/api/v1/health-check/', (_req, res) => {
  res.status(200).send('Server is healthy');
});

export default app;
