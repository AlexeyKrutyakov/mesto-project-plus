import { Request, Response } from 'express';
import { constants } from 'http2';
import errorText from '../constants/errors';
import Card from './card.model';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: errorText.INTERNAL_SERVER_ERROR });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const newCard = new Card(req.body);
    return res.status(constants.HTTP_STATUS_CREATED).send(await newCard.save());
  } catch (error) {
    return res.send(error);
  }
};
