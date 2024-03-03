// import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import BadRequestError from '../error/bad-request-error';
import NotFoundError from '../error/not-found-error';
import responseMessage from '../constants/responseMessages';
import User from './user.model';
// import InternalServerError from '../error/internal-server-error';

// const { HASH_SALT = 'superpupeR secret sTrinG' } = process.env;

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
    const { name, email, password, about, avatar } = req.body;
    if (!validator.isEmail(email)) {
      throw new BadRequestError('Not valid email');
    }
    const user = await User.find({ email });
    if (user.length !== 0) {
      throw new BadRequestError(responseMessage.USER_ALREADY_EXISTS);
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hash, about, avatar });
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
    if (error instanceof MongooseError.CastError) {
      const badRequestError = new BadRequestError(
        responseMessage.NOT_VALID_USER_ID,
      );
      return next(badRequestError);
    }
    return next(error);
  }
};

// export const login = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { email, password } = req.body;
//     // const user = await User.find({ email }).orFail(() => {
//     //   throw new BadRequestError(responseMessage.WRONG_EMAIL_OR_PASSWORD);
//     // });
//     bcrypt.compare(password, password, () => {});
//     await User.find({ email, password }).orFail(() => {
//       throw new NotFoundError(responseMessage.WRONG_EMAIL_OR_PASSWORD);
//     });
//     return res.send('jwt');
//   } catch (error) {
//     return next(error);
//   }
// };
