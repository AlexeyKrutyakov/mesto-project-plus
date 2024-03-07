import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  addLikeToCard,
  createCard,
  deleteCardById,
  getCards,
  removeLikeFromCard,
} from './card.controllers';

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
cardRouter.put('/:cardId/likes', addLikeToCard);
cardRouter.delete('/:cardId/likes', removeLikeFromCard);

export default cardRouter;
