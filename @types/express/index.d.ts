import { ObjectId } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      owner: {
        _id: string | ObjectId;
        name: string;
        about: string;
        avatar: string;
      };
    }
  }
}
