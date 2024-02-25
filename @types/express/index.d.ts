import { ObjectId } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      owner: {
        _id: ObjectId;
      };
    }
  }
}
