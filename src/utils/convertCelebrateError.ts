import { CelebrateError, isCelebrateError } from 'celebrate';
import { constants } from 'http2';
import { TError } from '../error/error.type';

export default (error: TError | CelebrateError) => {
  if (error && isCelebrateError(error)) {
    const celebrateMessage = error.details.get('body')?.details[0].message;
    return {
      statusCode: constants.HTTP_STATUS_BAD_REQUEST,
      message: celebrateMessage,
    };
  }
  return { statusCode: error.statusCode, message: error.message };
};
