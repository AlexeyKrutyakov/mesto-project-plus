import { Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
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
    if (error instanceof MongooseError.ValidationError) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
        error: error.message,
      });
    }
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: errorText.INTERNAL_SERVER_ERROR });
  }
};

export const deleteCardById = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    await Card.findByIdAndDelete(cardId).orFail(() => {
      const error = new Error('card not found');
      error.name = 'NotFoundError';
      return error;
    });
    return res.send({ message: 'card deleted' });
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ error: 'not valid cardId' });
    }
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: error.message });
    }
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: errorText.INTERNAL_SERVER_ERROR });
  }
};

export const addLikeToCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.body.owner._id;
  try {
    await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    ).orFail(() => {
      const error = new Error('card not found');
      error.name = 'NotFoundError';
      return error;
    });
    return res.send(await Card.findById(cardId));
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: `not valid cardId ( _id=${cardId} )` });
    }
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: `card with _id=${cardId} not found` });
    }
    return res.send({ error });
  }
};

export const removeLikeFromCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.body.owner._id;
  try {
    await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    ).orFail(() => {
      const error = new Error('card not found');
      error.name = 'NotFoundError';
      return error;
    });
    return res.send(await Card.findById(cardId));
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: `not valid cardId ( _id=${cardId} )` });
    }
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: `card with _id=${cardId} not found` });
    }
    return res.send({ error });
  }
};
