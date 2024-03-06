import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import responseMessage from '../constants/responseMessages';
import Card from './card.model';
import BadRequestError from '../error/bad-request-error';
import NotFoundError from '../error/not-found-error';
import { IRequest } from '../types/request';
import InternalServerError from '../error/internal-server-error';

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
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const _id = req.user?._id;

    if (_id === undefined) {
      throw new InternalServerError(responseMessage.INTERNAL_SERVER_ERROR);
    }

    req.body.owner = _id;
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
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const _id = req.user?._id;

    if (_id === undefined) {
      throw new InternalServerError(responseMessage.INTERNAL_SERVER_ERROR);
    }

    const { cardId } = req.params;
    const card = await Card.findOne({ _id: cardId }).orFail(() => {
      throw new NotFoundError(responseMessage.CARD_NOT_FOUND);
    });

    if (_id === `${card.owner}`) {
      await Card.findByIdAndDelete(cardId).orFail(() => {
        throw new InternalServerError(responseMessage.INTERNAL_SERVER_ERROR);
      });

      return res.send({ message: responseMessage.CARD_WAS_DELETED });
    }

    return res.send({ message: responseMessage.NOT_PERMISSIONS });
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
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  const _id = req.user?._id;
  if (_id === undefined) {
    throw new InternalServerError(responseMessage.INTERNAL_SERVER_ERROR);
  }
  try {
    await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } },
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
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  const _id = req.user?._id;

  if (_id === undefined) {
    throw new InternalServerError(responseMessage.INTERNAL_SERVER_ERROR);
  }

  try {
    await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: _id } },
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
