import { Router } from 'express';
import userRouter from '../user/user.router';
import cardRouter from '../card/card.router';
import signinRoute from './signin';
import signupRoute from './signup';
import authMiddleware from '../middlewares/auth';

const rootRouter = Router();

rootRouter.use(signinRoute);
rootRouter.use(signupRoute);

rootRouter.use(authMiddleware);

rootRouter.use('/users', userRouter);
rootRouter.use('/cards', cardRouter);

export default rootRouter;
