import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { createCard, deleteCardById, getCards } from './card.controllers';

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
cardRouter.delete('/:cardId', deleteCardById);

export default cardRouter;
