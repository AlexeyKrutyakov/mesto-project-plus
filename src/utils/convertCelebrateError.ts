import { CelebrateError, isCelebrateError } from 'celebrate';
import { constants } from 'http2';
import { TError } from '../error/error.type';
import RESPONSE_MESSAGE from '../constants/responseMessages';

export default (error: TError | CelebrateError): TError => {
  if (error && isCelebrateError(error)) {
    // eslint-disable-next-line operator-linebreak
    const celebrateMessage =
      // eslint-disable-next-line operator-linebreak
      error.details.get('body')?.details[0].message ||
      // eslint-disable-next-line operator-linebreak
      error.details.get('params')?.details[0].message ||
      RESPONSE_MESSAGE.celebrateValidationFailed;
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
