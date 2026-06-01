// src/routes/userRoutes.ts
import express from 'express';
import {
  updateUser,
  deleteUser,
  getUserProfile,
  getPublicUserProfileById,
} from '../controllers/userController';
import { authenticate } from '../middlewares/authenticate/index';

const userRouter = express.Router();

userRouter.get('/profile', authenticate, getUserProfile);
userRouter.delete('/profile', authenticate, deleteUser);
userRouter.patch('/profile', authenticate, updateUser);
userRouter.patch('/profile/change-password', authenticate, updateUser);
userRouter.get('/:user_id', getPublicUserProfileById);

export default userRouter;
