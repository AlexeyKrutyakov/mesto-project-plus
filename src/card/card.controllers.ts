import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import responseMessage from '../constants/responseMessages';
import Card from './card.model';
import BadRequestError from '../error/bad-request-error';
import NotFoundError from '../error/not-found-error';

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newCard = new Card(req.body);
    return res.status(constants.HTTP_STATUS_CREATED).send(await newCard.save());
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      const badRequestError = new BadRequestError(
        responseMessage.NOT_VALID_USER_ID,
      );
      return next(badRequestError);
    }
    return next(error);
  }
};

export const deleteCardById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    await Card.findByIdAndDelete(cardId).orFail(() => {
      throw new NotFoundError(responseMessage.CARD_NOT_FOUND);
    });
    return res.send({ message: responseMessage.CARD_WAS_DELETED });
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      const badRequestError = new BadRequestError(
        responseMessage.NOT_VALID_CARD_ID,
      );
      return next(badRequestError);
    }
    return next(error);
  }
};

export const addLikeToCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  const userId = req.body.owner._id;
  try {
    await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    ).orFail(() => {
      throw new NotFoundError(responseMessage.CARD_NOT_FOUND);
    });
    return res.send(await Card.findById(cardId));
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      const badRequestError = new BadRequestError(
        responseMessage.NOT_VALID_CARD_OR_USER_ID,
      );
      return next(badRequestError);
    }
    return next(error);
  }
};

export const removeLikeFromCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  const userId = req.body.owner._id;
  try {
    await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    ).orFail(() => {
      throw new NotFoundError(responseMessage.CARD_NOT_FOUND);
    });
    return res.send(await Card.findById(cardId));
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      const badRequestError = new BadRequestError(
        responseMessage.NOT_VALID_CARD_OR_USER_ID,
      );
      return next(badRequestError);
    }
    return next(error);
  }
};
