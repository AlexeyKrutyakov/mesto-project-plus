import 'dotenv/config';
import express, { Router, json } from 'express';
import mongoose from 'mongoose';
import { Joi, celebrate } from 'celebrate';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import userRouter from './user/user.router';
import cardRouter from './card/card.router';
import errorRootController from './error/error-root-controller';
import { createUser, login } from './user/user.controllers';
import authMiddleware from './middlewares/auth';
import { requestsLogger, errorsLogger } from './middlewares/logger';

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
const router = Router();

app.use(helmet());
app.use(limiter);

app.use(cookieParser());
app.use(json());

app.use(requestsLogger);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required(),
        password: Joi.string().required().min(8),
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(200),
        avatar: Joi.string(),
      })
      .unknown(true),
  }),
  createUser,
);

app.use(authMiddleware);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

app.use(router);

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
