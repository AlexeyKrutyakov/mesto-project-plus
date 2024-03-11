import { NextFunction, Request, Response, Router } from 'express';
import NotFoundError from '../error/not-found-error';
import RESPONSE_MESSAGE from '../constants/responseMessages';

const notFoundRouter = Router();

notFoundRouter.use('*', (req: Request, res: Response, next: NextFunction) => {
  const notFoundError = new NotFoundError(RESPONSE_MESSAGE.pageNotFound);
  return next(notFoundError);
});

export default notFoundRouter;
