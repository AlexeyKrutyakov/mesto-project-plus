import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import InternalServerError from '../errors/internal-server-error';
import errorText from '../constants/errors';
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
    const serverError = new InternalServerError(
      errorText.INTERNAL_SERVER_ERROR,
    );
    return next(serverError);
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
      throw new NotFoundError(errorText.USER_NOT_FOUND);
    });
    return res.send(user);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      const badRequestError = new BadRequestError(errorText.NOT_VALID_USER_ID);
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
      throw new NotFoundError(errorText.USER_NOT_FOUND);
    });
    return res.send(await User.findById(_id));
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      const badRequestError = new BadRequestError(errorText.NOT_VALID_USER_ID);
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
      throw new NotFoundError(errorText.USER_NOT_FOUND);
    });
    return res.send(await User.findById(_id));
  } catch (error) {
    return next(error);
  }
};
