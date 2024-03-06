import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../error/unauthorized-error';
import RESPONSE_MESSAGE from '../constants/responseMessages';
import { IRequest } from '../types/request';

const { SECRET_KEY = 'superpupeR secret sTrinG' } = process.env;

export default (req: IRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError(RESPONSE_MESSAGE.authorizationError);
  }

  jwt.verify(token, SECRET_KEY, (err: any, payload: any) => {
    if (err) {
      throw new UnauthorizedError(err.message);
    }
    req.user = { _id: payload._id };
  });

  next();
};
