import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getCurrentUserInfo,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserInfo,
} from './user.controllers';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/me', getCurrentUserInfo);

userRouter.get('/:userId', getUserById);

userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        about: Joi.string().required().min(2).max(200),
      })
      .unknown(true),
  }),
  updateUserInfo,
);

userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object()
      .keys({
        avatar: Joi.string().required(),
      })
      .unknown(true),
  }),
  updateUserAvatar,
);

export default userRouter;
