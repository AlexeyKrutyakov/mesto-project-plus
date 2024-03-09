import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  addLikeToCard,
  createCard,
  deleteCardById,
  getCards,
  removeLikeFromCard,
} from './card.controllers';
import REGEXP from '../constants/regexp';

const cardRouter = Router();

cardRouter.get('/', getCards);

cardRouter.post(
  '/',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string().required(),
      })
      .unknown(true),
  }),
  createCard,
);

cardRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().regex(REGEXP.mongoObjectId).required(),
    }),
  }),
  deleteCardById,
);

cardRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().regex(REGEXP.mongoObjectId).required(),
    }),
  }),
  addLikeToCard,
);

cardRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().regex(REGEXP.mongoObjectId).required(),
    }),
  }),
  removeLikeFromCard,
);

export default cardRouter;
