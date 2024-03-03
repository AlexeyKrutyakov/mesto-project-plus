import { CelebrateError, isCelebrateError } from 'celebrate';
import { constants } from 'http2';
import { TError } from '../error/error.type';

export default (error: TError | CelebrateError) => {
  if (error && isCelebrateError(error)) {
    return {
      statusCode: constants.HTTP_STATUS_BAD_REQUEST,
      message: error.details.get('body')?.details[0].message,
    };
  }
  return { message: error.message };
};
