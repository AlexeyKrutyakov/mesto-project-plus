import { Router } from 'express';
import { createCard, getCards } from './card.controllers';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);

export default cardRouter;
