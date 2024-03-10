import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import REGEXP from '../constants/regexp';
import { createUser } from '../user/user.controllers';

const signupRoute = Router();

signupRoute.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().regex(REGEXP.email).required(),
        password: Joi.string().required().min(8),
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(200),
        avatar: Joi.string().regex(REGEXP.url),
      })
      .unknown(true),
  }),
  createUser,
);

export default signupRoute;
