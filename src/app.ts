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
import cardRouter from './card/card.router';
import errorRootController from './error/error-root-controller';

const { PORT = 3000, MONGO_URL = '' } = process.env;

const app = express();
const router = Router();

app.use(json());

// todo remove hardCode later
app.use((req: Request, res: Response, next: NextFunction) => {
  req.body.owner = {
    _id: '65e4cb1ae7c022fcf5f2a541', // Naomi
    // _id: '65de189c8e847fc7a0bcba29', // Alex
  };
  next();
});

router.use('/users', userRouter);
router.use('/cards', cardRouter);

app.use(router);

app.use(errorRootController);

const connect = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URL);
    // console.log(`connected with ${MONGO_URL}`);

    app.listen(PORT);
    // console.log(`server run on port ${PORT}`);
  } catch (err) {
    throw new Error(`${err}`);
  }
};

connect();
