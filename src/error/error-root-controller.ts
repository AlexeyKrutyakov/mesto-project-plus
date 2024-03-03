import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { TError } from './error.type';
import responseMessage from '../constants/responseMessages';
import convertCelebrateError from '../utils/convertCelebrateError';

const serverErrorCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

export default (
  err: TError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = convertCelebrateError(err);
  const statusCode = error.statusCode || err.statusCode || serverErrorCode;

  // eslint-disable-next-line operator-linebreak
  const message =
    statusCode === serverErrorCode
      ? responseMessage.DEFAULT_ERROR
      : error.message;
  res.status(statusCode).send({ message });

  next();
};
