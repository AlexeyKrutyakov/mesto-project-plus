import { Router } from 'express';
import { createUser, getUserById, getUsers } from './user.controller';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:userId', getUserById);

userRouter.post('/', createUser);

export default userRouter;
