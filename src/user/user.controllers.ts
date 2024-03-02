import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import BadRequestError from '../error/bad-request-error';
import NotFoundError from '../error/not-found-error';
import responseMessage from '../constants/responseMessages';
import User from './user.model';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      throw new NotFoundError(responseMessage.USER_NOT_FOUND);
    });
    return res.send(user);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      const badRequestError = new BadRequestError(
        responseMessage.NOT_VALID_USER_ID,
      );
      return next(badRequestError);
    }
    return next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newUser = new User(req.body);
    // todo ?
    // User.populate(newUser, ['owner, likes'])
    return res.status(constants.HTTP_STATUS_CREATED).send(await newUser.save());
  } catch (error) {
    return next(error);
  }
};

export const updateUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.body.owner;
  const { name, about } = req.body;
  try {
    await User.findByIdAndUpdate(_id, { name, about }).orFail(() => {
      throw new NotFoundError(responseMessage.USER_NOT_FOUND);
    });
    return res.send(await User.findById(_id));
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      const badRequestError = new BadRequestError(
        responseMessage.NOT_VALID_USER_ID,
      );
      return next(badRequestError);
    }
    return next(error);
  }
};

export const updateUserAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.body.owner;
  const { avatar } = req.body;
  try {
    await User.findByIdAndUpdate(_id, { avatar }).orFail(() => {
      throw new NotFoundError(responseMessage.USER_NOT_FOUND);
    });
    return res.send(await User.findById(_id));
  } catch (error) {
    return next(error);
  }
};
