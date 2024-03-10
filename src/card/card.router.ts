import { Router } from 'express';
import {
  addLikeToCard,
  createCard,
  deleteCardById,
  getCards,
  removeLikeFromCard,
} from './card.controllers';
import validateRequestData from '../middlewares/validators';

const cardRouter = Router();

cardRouter.get('/', getCards);

cardRouter.post('/', validateRequestData.card.create, createCard);

cardRouter.delete('/:cardId', validateRequestData.card.id, deleteCardById);

cardRouter.put('/:cardId/likes', validateRequestData.card.id, addLikeToCard);

cardRouter.delete(
  '/:cardId/likes',
  validateRequestData.card.id,
  removeLikeFromCard,
);

export default cardRouter;
