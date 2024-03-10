import express, { json } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import config from './config';
import errorRootController from './error/error-root-controller';
import rateLimiter from './middlewares/rate-limiter';
import { requestsLogger, errorsLogger } from './middlewares/logger';
import rootRouter from './routes';

const app = express();

app.use(helmet());

app.use(rateLimiter);

app.use(cookieParser());

app.use(json());

app.use(requestsLogger);

app.use(rootRouter);

app.use(errorsLogger);

app.use(errorRootController);

const connect = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.database.URL);
    // console.log(`connected with ${config.database.URL}`);

    app.listen(config.server.PORT);
    // console.log(`server run on port ${config.server.PORT}`);
  } catch (err) {
    throw new Error(`${err}`);
  }
};

connect();
