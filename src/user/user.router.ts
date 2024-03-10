import { Router } from 'express';
import {
  getCurrentUserInfo,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserInfo,
} from './user.controllers';
import validateRequestData from '../middlewares/validators';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/me', getCurrentUserInfo);

userRouter.get('/:userId', validateRequestData.user.id, getUserById);

userRouter.patch('/me', validateRequestData.user.updateInfo, updateUserInfo);

userRouter.patch(
  '/me/avatar',
  validateRequestData.user.updateAvatar,
  updateUserAvatar,
);

export default userRouter;
