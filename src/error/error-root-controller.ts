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

  let { statusCode = 500, message = RESPONSE_MESSAGE.defaultError } = error;

  if (message.includes('email already exists')) {
    statusCode = 409;
  } else if (message.includes('email')) {
    statusCode = 401;
  } else if (message.includes('password')) {
    statusCode = 401;
  } else if (message.includes('avatar')) {
    statusCode = 400;
  } else if (message.includes('validation failed')) {
    statusCode = 400;
  } else if (message.includes('name')) {
    statusCode = 400;
  } else if (message.includes('about')) {
    statusCode = 400;
  }

  if (statusCode === 500) {
    message = RESPONSE_MESSAGE.defaultError;
  }

  res.status(statusCode).send({ message });

  next();
};
