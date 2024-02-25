import 'dotenv/config';
import express, {
  NextFunction,
  Request,
  Response,
  Router,
  json,
} from 'express';
import mongoose from 'mongoose';
import userRouter from './user/user.router';

const { PORT = 3000, MONGO_URL = '' } = process.env;

const app = express();
const router = Router();
router.use('/users', userRouter);

app.use(json());

// todo remove hardCode later
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '65da4fc1d20d808272b8d586',
  };

  next();
});

app.use(router);

const connect = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URL);
    console.log(`connected with ${MONGO_URL}`);

    await app.listen(PORT);
    console.log(`server run on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
};

connect();
