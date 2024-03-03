import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createUser,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserInfo,
} from './user.controllers';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:userId', getUserById);

userRouter.post(
  '/',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required(),
        password: Joi.string().required().min(8),
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(200),
        avatar: Joi.string(),
      })
      .unknown(true),
  }),
  createUser,
);

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
