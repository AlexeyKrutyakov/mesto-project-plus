import { Joi, celebrate } from 'celebrate';
import REGEXP from '../constants/regexp';

const celebrateKeys = {
  id: Joi.string().regex(REGEXP.mongoObjectId),
  name: Joi.string().min(2).max(30),
  email: Joi.string().regex(REGEXP.email),
  password: Joi.string().min(8),
  about: Joi.string().min(2).max(200),
  link: Joi.string().regex(REGEXP.url),
};

const validateRequestData = {
  signin: celebrate({
    body: Joi.object().keys({
      email: celebrateKeys.email.required(),
      password: celebrateKeys.password.required(),
    }),
  }),
  signup: celebrate({
    body: Joi.object()
      .keys({
        name: celebrateKeys.name,
        email: celebrateKeys.email.required(),
        password: celebrateKeys.password.required(),
        about: celebrateKeys.about,
        avatar: celebrateKeys.link,
      })
      .unknown(true),
  }),
  user: {
    id: celebrate({
      params: Joi.object().keys({
        userId: celebrateKeys.id.required(),
      }),
    }),
    updateInfo: celebrate({
      body: Joi.object()
        .keys({
          name: celebrateKeys.name.required(),
          about: celebrateKeys.about.required(),
        })
        .unknown(true),
    }),
    updateAvatar: celebrate({
      body: Joi.object()
        .keys({
          avatar: celebrateKeys.link.required(),
        })
        .unknown(true),
    }),
  },
  card: {
    id: celebrate({
      params: Joi.object().keys({
        cardId: celebrateKeys.id.required(),
      }),
    }),
    create: celebrate({
      body: Joi.object()
        .keys({
          name: celebrateKeys.name.required(),
          link: celebrateKeys.link.required(),
        })
        .unknown(true),
    }),
  },
};

export default validateRequestData;
