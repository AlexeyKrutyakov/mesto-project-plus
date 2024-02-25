import { Router } from 'express';
import { createCard, deleteCardById, getCards } from './card.controllers';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCardById);

export default cardRouter;
