import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import BadRequestError from '../error/bad-request-error';
import NotFoundError from '../error/not-found-error';
import RESPONSE_MESSAGE from '../constants/responseMessages';
import User from './user.model';
import UnauthorizedError from '../error/unauthorized-error';
import { IRequest } from '../types/request';
import DEFAULT_USER from '../constants/defaultUser';

const { SECRET_KEY = 'superpupeR secret sTrinG' } = process.env;

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
      throw new NotFoundError(RESPONSE_MESSAGE.userNotFound);
    });
    return res.send(user);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      const badRequestError = new BadRequestError(
        RESPONSE_MESSAGE.notValidUserId,
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
    const {
      name = DEFAULT_USER.name,
      email,
      password,
      about = DEFAULT_USER.about,
      avatar = DEFAULT_USER.avatar,
    } = req.body;
    const user = await User.find({ email });
    if (user.length !== 0) {
      throw new BadRequestError(RESPONSE_MESSAGE.userAlreadyExists);
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hash, about, avatar });
    return res.status(constants.HTTP_STATUS_CREATED).send(await newUser.save());
  } catch (error) {
    return next(error);
  }
};

export const updateUserInfo = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;
  const _id = req.user?._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => {
      throw new NotFoundError(RESPONSE_MESSAGE.userNotFound);
    });
    return res.send(await updatedUser);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      const badRequestError = new BadRequestError(
        RESPONSE_MESSAGE.notValidUserId,
      );
      return next(badRequestError);
    }
    return next(error);
  }
};

export const updateUserAvatar = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { avatar } = req.body;
    const _id = req.user?._id;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(() => {
      throw new NotFoundError(RESPONSE_MESSAGE.userNotFound);
    });
    return res.send(updatedUser);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      const badRequestError = new BadRequestError(
        RESPONSE_MESSAGE.notValidUserId,
      );
      return next(badRequestError);
    }
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
      .select('+password')
      .orFail(() => {
        throw new UnauthorizedError(RESPONSE_MESSAGE.wrongEmailOrPassword);
      });
    if (user) {
      const passwordIsCorrect = await bcrypt.compare(password, user.password);
      if (!passwordIsCorrect) {
        throw new UnauthorizedError(RESPONSE_MESSAGE.wrongEmailOrPassword);
      }
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
        expiresIn: '7d',
      });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
    }
    return res.send({ message: RESPONSE_MESSAGE.successfulAuthorization });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUserInfo = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const _id = req.user?._id;

    const user = await User.findOne({ _id }).orFail();
    return res.send(user);
  } catch (error) {
    return next(error);
  }
};
