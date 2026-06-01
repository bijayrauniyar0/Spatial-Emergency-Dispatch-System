// src/routes/userRoutes.ts
import express from 'express';
import {
  updateUser,
  deleteUser,
  getUserProfile,
  getPublicUserProfileById,
} from '../controllers/userController';
import { authenticate } from '../middlewares/authenticate/index';
import multer from 'multer';

const userRouter = express.Router();

const upload = multer({
  dest: '/',
  limits: { fileSize: 1024 * 1024 },
});

userRouter.get('/profile', authenticate, getUserProfile);
userRouter.delete('/profile', authenticate, deleteUser);
userRouter.patch('/profile', authenticate, upload.single('avatar'), updateUser);
userRouter.patch('/profile/change-password', authenticate, updateUser);
userRouter.get('/:user_id', getPublicUserProfileById);

export default userRouter;
