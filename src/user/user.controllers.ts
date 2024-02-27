import { Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import errorText from '../constants/errors';
import User from './user.model';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: errorText.INTERNAL_SERVER_ERROR });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      const error = new Error('user not found');
      error.name = 'NotFoundError';
      return error;
    });
    return res.send(user);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ error: 'not valid userId' });
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

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    // todo
    // User.populate(newUser, ['owner, likes'])
    return res.status(constants.HTTP_STATUS_CREATED).send(await newUser.save());
  } catch (error) {
    // todo is need check for duplicate user ?
    // if (error instanceof Error && error.message.startsWith('E11000')) {
    //   return res.status(constants.HTTP_STATUS_CONFLICT).send({
    //     error: error.message,
    //   });
    // }
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

export const updateUserInfo = async (req: Request, res: Response) => {
  const { _id } = req.body.owner;
  const { name, about } = req.body;
  try {
    await User.findByIdAndUpdate(_id, { name, about });
    return res.send(await User.findById(_id));
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
};
