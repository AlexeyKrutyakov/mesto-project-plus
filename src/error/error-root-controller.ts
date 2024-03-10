import { NextFunction, Request, Response } from 'express';
import { TError } from './error.type';
import convertCelebrateError from '../utils/convertCelebrateError';
import RESPONSE_MESSAGE from '../constants/responseMessages';

export default (
  err: TError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = convertCelebrateError(err);

  let { statusCode = 500, message } = error;

  if (error.name === 'MongoServerError') {
    if (error.message.includes('E11000')) {
      statusCode = 409;
      message = RESPONSE_MESSAGE.userAlreadyExists;
    } else {
      statusCode = 400;
    }
  } else if (
    // eslint-disable-next-line operator-linebreak
    error.name === 'ValidationError' ||
    error.name === 'CelebrateError'
  ) {
    statusCode = 400;
  }

  if (statusCode === 500) {
    message = RESPONSE_MESSAGE.defaultError;
  }

  res.status(statusCode).send({ message });

  next();
};
