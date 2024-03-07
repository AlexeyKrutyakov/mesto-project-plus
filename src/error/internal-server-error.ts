import { constants } from 'http2';

class InternalServerError extends Error {
  codeStatus: number;

  constructor(message: string) {
    super(message);
    this.codeStatus = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
}

export default InternalServerError;
