import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { TError } from './error.type';
import responseMessage from '../constants/responseMessages';

export default (
  err: TError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // eslint-disable-next-line operator-linebreak
  const { statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, message } =
    err;

  const error: TError = {
    statusCode,
    message,
  };

  if (statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR) {
    error.message = responseMessage.INTERNAL_SERVER_ERROR;
  }
  if (message === responseMessage.CELEBRATE_VALIDATION_FAILED) {
    error.message = responseMessage.REQUEST_BODY_IS_NOT_VALID;
  }

  res.status(error.statusCode).send({ message: error.message });

  next();
};
