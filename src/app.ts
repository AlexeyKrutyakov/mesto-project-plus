import 'dotenv/config';
import express, { json } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import errorRootController from './error/error-root-controller';
import { requestsLogger, errorsLogger } from './middlewares/logger';
import rootRouter from './routes';

// eslint-disable-next-line operator-linebreak
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } =
  process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const app = express();

app.use(helmet());
app.use(limiter);

app.use(cookieParser());

app.use(json());

app.use(requestsLogger);

app.use(rootRouter);

app.use(errorsLogger);

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
