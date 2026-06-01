// src/routes/adminRoutes.ts
import Express from 'express';
import { createStation } from '../controllers/adminControllers';
import { authenticate, isAdmin } from '../middlewares/authenticate';

const adminRouter = Express.Router();

// Middleware chain: authenticate first, then check admin role
adminRouter.post('/stations', authenticate, isAdmin, createStation);

export default adminRouter;
