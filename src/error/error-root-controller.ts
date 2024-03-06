import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { TError } from './error.type';
import convertCelebrateError from '../utils/convertCelebrateError';
import RESPONSE_MESSAGE from '../constants/responseMessages';

const serverErrorCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

export default (
  err: TError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = convertCelebrateError(err);
  let statusCode = error.statusCode || err.statusCode || serverErrorCode;
  if (err.message.includes(RESPONSE_MESSAGE.mongooseValidErrMessage)) {
    statusCode = constants.HTTP_STATUS_BAD_REQUEST;
  }

  // eslint-disable-next-line operator-linebreak
  const message =
    statusCode === serverErrorCode
      ? RESPONSE_MESSAGE.defaultError
      : error.message;

  res.status(statusCode).send({ message });

  next();
};
