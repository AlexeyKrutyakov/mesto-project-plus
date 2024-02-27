import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createUser,
  getUserById,
  getUsers,
  updateUserInfo,
} from './user.controllers';

const userRouter = Router();

userRouter.get('/', getUsers);

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

userRouter.get('/:userId', getUserById);

userRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(200),
      avatar: Joi.string().required(),
    }),
  }),
  createUser,
);

export default userRouter;
