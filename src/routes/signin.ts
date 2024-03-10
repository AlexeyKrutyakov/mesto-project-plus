import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import REGEXP from '../constants/regexp';
import { login } from '../user/user.controllers';

const signinRoute = Router();

signinRoute.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().regex(REGEXP.email).required(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

export default signinRoute;
