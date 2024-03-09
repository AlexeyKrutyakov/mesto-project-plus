import { CelebrateError, isCelebrateError } from 'celebrate';
import { constants } from 'http2';
import { TError } from '../error/error.type';

export default (error: TError | CelebrateError): TError => {
  if (error && isCelebrateError(error)) {
    // eslint-disable-next-line operator-linebreak
    const celebrateMessage =
      error.details.get('body')?.details[0].message || 'unknown error';
    return {
      name: 'CelebrateError',
      statusCode: constants.HTTP_STATUS_BAD_REQUEST,
      message: celebrateMessage,
    };
  }
  return {
    name: error.name,
    statusCode: error.statusCode,
    message: error.message,
  };
};
